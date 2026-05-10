import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getWorkoutById } from '../../../shared/api/workoutApi'

import BackButton from '../../../shared/ui/BackButton'
import ExerciseItem from '../../workout/components/ExerciseItem'

/**
 * Page for displaying detailed information about a single workout.
 *
 * Fetches workout by ID and displays completed workout details.
 * @returns {import('react').ReactElement} Workout detail page UI
 */
export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [workout, setWorkout] = useState(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      const data = await getWorkoutById(id)

      setWorkout(data)
    }

    fetchWorkout()
  }, [id])

  if (!workout) {
    return <p className="center">Loading...</p>
  }

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/history" />

      {/* HEADER */}
      <div className="workout-header">
        <h2>{workout.name}</h2>

        <span>
          {workout.exercises?.length || 0} exercises
        </span>
      </div>

      {/* EXERCISES */}
      {workout.exercises.map((ex, i) => (
        <ExerciseItem
          key={ex.exerciseId || i}
          ex={ex}
          i={i}
          navigate={navigate}
          restTime={ex.restTime}
          isEditable={false}
          showCheckbox={false}
        />
      ))}

      {/* NOTES */}
      {workout.notes && (
        <div className="section">
          <h3>Notes</h3>

          <p className="muted">
            {workout.notes}
          </p>
        </div>
      )}
    </div>
  )
}
