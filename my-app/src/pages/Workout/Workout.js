import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Pencil } from 'lucide-react'

/**
 * Workout page for creating and saving a workout session.
 *
 * Allows the user to:
 * - Add exercises
 * - Add sets (reps and weight)
 * - Write notes
 * - Save workout to backend API
 * @returns {import('react').ReactElement} Workout UI
 */
export default function Workout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [workout, setWorkout] = useState({
    exercises: [],
    notes: '',
  })

  const [customName, setCustomName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    const selected = location.state?.selectedExercises
    const existing = location.state?.currentExercises || []
    const lastWorkout = JSON.parse(localStorage.getItem('lastWorkout'))

    if (!selected) return

    const newExercises = selected.map((ex) => {
      const previous = lastWorkout?.exercises?.find(
        (e) => e.exerciseId === ex.id,
      )

      return {
        exerciseId: ex.id,
        name: ex.name,
        image: ex.image,
        sets: previous
          ? previous.sets.map((s) => ({
            reps: s.reps,
            weight: s.weight,
            completed: false,
          }))
          : [
            { reps: 8, weight: 0 },
            { reps: 8, weight: 0 },
          ],
      }
    })

    setWorkout((prev) => ({
      ...prev,
      exercises: [...existing, ...newExercises],
    }))

    window.history.replaceState({}, '')
  }, [location.state])

  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        currentExercises: workout.exercises,
      },
    })
  }

  const addSet = (index) => {
    const updated = [...workout.exercises]

    const sets = updated[index].sets
    const lastSet = sets[sets.length - 1]

    const newSet = lastSet
      ? { ...lastSet, completed: false }
      : { reps: 8, weight: 0, completed: false }

    sets.push(newSet)

    setWorkout({ ...workout, exercises: updated })
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    const updated = [...workout.exercises]
    updated[exIndex].sets[setIndex][field] = value
    setWorkout({ ...workout, exercises: updated })
  }

  const updateWorkoutNotes = (value) => {
    setWorkout({ ...workout, notes: value })
  }

  const removeExercise = (index) => {
    const updated = workout.exercises.filter((_, i) => i !== index)
    setWorkout({ ...workout, exercises: updated })
  }

  const removeSet = (exIndex, setIndex) => {
    const updated = [...workout.exercises]
    if (updated[exIndex].sets.length === 1) return

    updated[exIndex].sets = updated[exIndex].sets.filter(
      (_, i) => i !== setIndex,
    )

    setWorkout({ ...workout, exercises: updated })
  }

  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      if (workout.exercises.length === 0) {
        setError('Add at least one exercise')
        return
      }

      const token = JSON.parse(localStorage.getItem('user'))?.token

      localStorage.setItem('lastWorkout', JSON.stringify(workout))

      const res = await fetch('http://localhost:5000/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...workout,
          name: title,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setSuccess(true)

      setWorkout({
        name: '',
        exercises: [],
        notes: '',
      })
    } catch (err) {
      setError('Could not save workout')
    } finally {
      setSaving(false)
    }
  }

  const getAutoTitle = () => {
    if (workout.exercises.length === 0) return 'Workout'

    const counts = {}

    workout.exercises.forEach((ex) => {
      const key = ex.name.toLowerCase()

      if (key.includes('squat') || key.includes('leg')) {
        counts.legs = (counts.legs || 0) + 1
      } else if (key.includes('bench') || key.includes('chest')) {
        counts.chest = (counts.chest || 0) + 1
      } else if (key.includes('row') || key.includes('pull')) {
        counts.back = (counts.back || 0) + 1
      } else if (key.includes('shoulder')) {
        counts.shoulders = (counts.shoulders || 0) + 1
      } else {
        counts.other = (counts.other || 0) + 1
      }
    })

    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]

    switch (top) {
    case 'legs':
      return 'Leg day'
    case 'chest':
      return 'Chest day'
    case 'back':
      return 'Back day'
    case 'shoulders':
      return 'Shoulder day'
    default:
      return 'Workout'
    }
  }

  const title = customName || getAutoTitle()

  return (
    <div className="card-base card-workout">
      <div className="workout-header">
        {isEditingName ? (
          <input
            className="input-base"
            value={customName}
            autoFocus
            placeholder="Workout name..."
            onChange={(e) => setCustomName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditingName(false)
            }}
          />
        ) : (
          <h2 className="workout-title" onClick={() => setIsEditingName(true)}>
            {title} <Pencil className="icon-small" />
          </h2>
        )}
      </div>

      <button className="btn btn-secondary" onClick={openLibrary}>
        Add exercise
      </button>

      {workout.exercises.map((ex, i) => (
        <div key={ex.exerciseId} className="workout-exercise">
          <div className="exercise-header">
            <img src={ex.image} alt={ex.name} className="exercise-img-small" />

            <div className="exercise-header-info">
              <h3 className="exercise-title">{ex.name}</h3>
            </div>

            <button
              className="btn btn-secondary btn-small"
              onClick={() => removeExercise(i)}
            >
              Remove
            </button>
          </div>

          {/* SET HEADER */}
          <div className="set-header">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
          </div>

          {/* SET LIST */}
          {ex.sets.map((set, j) => (
            <div key={j} className="set-row">
              <input type="checkbox" className="checkbox set-done" />
              <input
                className="input-base"
                type="number"
                value={set.weight ?? ''}
                onChange={(e) =>
                  updateSet(
                    i,
                    j,
                    'weight',
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
              />

              <input
                className="input-base"
                type="number"
                value={set.reps ?? ''}
                onChange={(e) =>
                  updateSet(
                    i,
                    j,
                    'reps',
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
              />

              <button
                className="btn btn-secondary btn-small"
                onClick={() => removeSet(i, j)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="btn btn-secondary btn-small"
            onClick={() => addSet(i)}
          >
            Add set
          </button>
        </div>
      ))}

      <textarea
        className="input-base"
        placeholder="Workout notes..."
        value={workout.notes}
        onChange={(e) => updateWorkoutNotes(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={saveWorkout}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save workout'}
      </button>

      {success && <p className="muted">Workout saved ✔</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
