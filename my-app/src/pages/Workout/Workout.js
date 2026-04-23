import { useState } from 'react'

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
  const [workout, setWorkout] = useState({
    exercises: [],
    notes: '',
  })

  const addExercise = () => {
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: Date.now().toString(),
          name: 'New Exercise',
          sets: [{ reps: '', weight: '' }],
          notes: '',
        },
      ],
    }))
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
    <div className="card">
      <h2>Workout</h2>

      <button onClick={addExercise}>Add exercise</button>

      {workout.exercises.map((ex, i) => (
        <div key={ex.exerciseId} className="exercise">
          <input
            className="input"
            value={ex.name}
            onChange={(e) => updateExerciseName(i, e.target.value)}
            placeholder="Exercise name"
          />

          {ex.sets.map((set, j) => (
            <div key={j} className="set-row">
              <input
                className="input"
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => updateSet(i, j, 'reps', e.target.value)}
              />

              <input
                className="input"
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => updateSet(i, j, 'weight', e.target.value)}
              />
            </div>
          ))}

          <button onClick={() => addSet(i)}>Add set</button>
        </div>
      ))}

      <textarea
        className="input"
        placeholder="Workout notes..."
        value={workout.notes}
        onChange={(e) => updateWorkoutNotes(e.target.value)}
      />

      <button className="primary" onClick={saveWorkout}>
        Save workout
      </button>
    </div>
  )
}
