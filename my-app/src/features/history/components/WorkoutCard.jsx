import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Displays a summary card for a workout.
 * @param {{
 *   workout: {
 *     _id: string,
 *     name?: string,
 *     createdAt: string,
 *     duration: number,
 *     exercises: Array<{
 *       name?: string,
 *       sets?: Array<{ reps: number, weight: number }>
 *     }>
 *   }
 * }} props - Component props
 * @returns {import('react').ReactElement} Workout card UI
 */
export default function WorkoutCard({ workout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const date = new Date(workout.createdAt).toLocaleDateString()

  return (
    <div
      className="card-base clickable"
      onClick={() => navigate(`/workouts/${workout._id}`, {
        state: {
          workout,
          from: location.pathname,
        },
      })}
    >
      <h3>{workout.name || 'Workout'}</h3>

      <p className="muted small">{date}</p>

      <p className="muted small">
        {workout.exercises.length} exercises •{' '}
        {Math.round(workout.duration / 60)} min
      </p>
    </div>
  )
}
