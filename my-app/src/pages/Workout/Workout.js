import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

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
    name: '',
    exercises: [],
    notes: '',
  })

  useEffect(() => {
    const selected = location.state?.selectedExercises
    const existing = location.state?.currentExercises || []
    const lastWorkout = JSON.parse(localStorage.getItem('lastWorkout'))

    if (!selected) return

    const newExercises = selected.map((ex) => {
      const previous = lastWorkout?.exercises?.find((e) => e.name === ex.name)

      return {
        exerciseId: ex.id,
        name: ex.name,
        sets: previous
          ? previous.sets.map((s) => ({
            reps: s.reps,
            weight: s.weight,
          }))
          : [{ reps: '', weight: '' }],
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

  const updateExerciseName = (index, value) => {
    const updated = [...workout.exercises]
    updated[index].name = value
    setWorkout({ ...workout, exercises: updated })
  }

  const addSet = (index) => {
    const updated = [...workout.exercises]
    updated[index].sets.push({ reps: '', weight: '' })
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

      // Save last workout for autofill
      localStorage.setItem('lastWorkout', JSON.stringify(workout))

      const res = await fetch('http://localhost:5000/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
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

  return (
    <div className="card-base card-workout">
      <h2>Workout</h2>

      <input
        className="input-base"
        placeholder="Workout name..."
        value={workout.name}
        onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
      />

      <button className="btn btn-secondary" onClick={openLibrary}>
        Add exercise
      </button>

      {workout.exercises.map((ex, i) => (
        <div key={ex.exerciseId} className="exercise">
          <button
            className="btn btn-secondary"
            onClick={() => removeExercise(i)}
          >
            Remove Exercise
          </button>

          <input
            className="input-base"
            value={ex.name}
            onChange={(e) => updateExerciseName(i, e.target.value)}
            placeholder="Exercise name"
          />

          {ex.sets.map((set, j) => (
            <div key={j} className="set-row">
              <input
                className="input-base"
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => updateSet(i, j, 'reps', e.target.value)}
              />

              <input
                className="input-base"
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => updateSet(i, j, 'weight', e.target.value)}
              />

              <button
                className="btn btn-secondary"
                onClick={() => removeSet(i, j)}
              >
                Remove Set
              </button>
            </div>
          ))}

          <button className="btn btn-secondary" onClick={() => addSet(i)}>
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
