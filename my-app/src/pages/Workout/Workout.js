import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
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

  const [workout, setWorkout] = useState({
    exercises: [],
    notes: '',
  })

  useEffect(() => {
    const selected = location.state?.selectedExercises
    const existing = location.state?.currentExercises || []

    if (!selected) return

    setWorkout({
      exercises: [
        ...existing,
        ...selected.map((ex) => ({
          exerciseId: ex.id,
          name: ex.name,
          sets: [{ reps: '', weight: '' }],
        })),
      ],
      notes: '',
    })

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

  const saveWorkout = async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token

    await fetch('http://localhost:5000/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workout),
    })
  }

  return (
    <div className="card-base card-workout">
      <h2>Workout</h2>

      <button className="btn btn-secondary" onClick={openLibrary}>
        Add exercise
      </button>

      {workout.exercises.map((ex, i) => (
        <div key={ex.exerciseId} className="exercise">
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

      <button className="btn btn-primary" onClick={saveWorkout}>
        Save workout
      </button>
    </div>
  )
}
