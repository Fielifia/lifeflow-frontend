import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getWorkoutById } from '../../../shared/api/workoutApi'
import BackButton from '../../../shared/ui/BackButton'

/**
 * Page for displaying detailed information about a single workout.
 *
 * Fetches workout by ID and shows exercises, sets, reps, and weight.
 * @returns {import('react').ReactElement} Workout detail page UI
 */
export default function WorkoutDetailPage() {
  const { id } = useParams()
  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const data = await getWorkoutById(id)
      setWorkout(data)
    }

    fetch()
  }, [id])

  if (!workout) return <p>Loading...</p>

  return (
    <div className="app">
      <BackButton fallback="/history" />

      <h2>{workout.name}</h2>

      {workout.exercises.map((ex, i) => (
        <div key={i} className="card-base">
          <h3>{ex.name}</h3>

          {ex.sets.map((set, j) => (
            <p key={j}>
              {set.weight} kg × {set.reps}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
