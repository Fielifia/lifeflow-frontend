import { formatDuration, formatDate, formatWeight } from '../../../shared/utils/format'
import { calculateWorkoutStats } from '../../../shared/utils/calculateWorkoutStats'

export default function RecentWorkoutCard({
  workout,
}) {
  const exercises = workout.exercises || []

  const {
    totalReps,
    totalVolume,
    personalBests,
    duration,
  } = calculateWorkoutStats(workout)

  return (
    <div className="recent-workouts">
      <div className="card-base recent-workout-card card-clickable">
        <div className="recent-workout-header">
          <h2 className="close">{workout.name}</h2>
          <p className="recent-workout-date small muted">
            {formatDate(workout.date)}
          </p>
        </div>

        <div className="recent-workout-info">
          <div className="recent-workout-info-content">
            <span className="muted small">Duration</span>
            <strong className="small">
              {formatDuration(
                Math.round((duration || 0) / 60)
              )}
            </strong>
          </div>

          <div className="recent-workout-info-content">
            <span className="muted small">Reps</span>
            <strong className="small">{totalReps}</strong>
          </div>

          <div className="recent-workout-info-content">
            <span className="muted small">Volume</span>
            <strong className="small">{formatWeight(totalVolume)}</strong>
          </div>

          <div className="recent-workout-info-content">
            <span className="muted small">Pbs</span>
            <strong className="small">{personalBests}</strong>
          </div>

        </div>

        <div className="recent-workout-meta">
          <ul className="template-list">
            {exercises.slice(0, 2).map((ex, i) => (
              <li key={i}>{ex.name}</li>
            ))}
          </ul>
        </div>

        {exercises.length > 2 && (
          <p className="muted small center close">
            And {exercises.length - 2} more ..
          </p>
        )}
      </div>
    </div>
  )
}
