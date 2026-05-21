import { formatDuration, formatDate } from '../../../shared/utils/format'

/**
 * Recent workout preview card.
 * @param {object} props - Component props
 * @param {object} props.workout - Workout data
 * @returns {import('react').ReactElement} Recent workout card UI
 */
export default function RecentWorkoutCard({
  workout,
}) {
  const exercises = workout.exercises || []

  return (
    <div className="recent-workouts">
      <div className="card-base workout-card card-clickable">
        {/* HEADER */}
        <div className="workout-card-header">
          <div className="workout-card-header-content">
            <h3>{workout.name}</h3>
            <p className="muted small">
              {formatDuration(
                Math.round((workout.duration || 0) / 60)
              )} • {formatDate(workout.timestamp)}</p>
          </div>
        </div>

        <div className="workout-meta">
          <ul className="workout-card-exercise-list">
            {exercises.slice(0, 3).map((ex, i) => (
              <li key={i}>{ex.name}</li>
            ))}
          </ul>
        </div>

        {exercises.length > 2 && (
          <p className="muted small center">
            And {exercises.length - 2} more ..
          </p>
        )}
      </div>
    </div>
  )
}
