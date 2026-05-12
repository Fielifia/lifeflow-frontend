import { Dumbbell, Clock3 } from 'lucide-react'
import { formatDuration, formatDate } from '../../../shared/utils/format'

export default function RecentWorkoutCard({
  workout,
}) {
  const exercises = workout.exercises || []
  return (
    <div className="recent-workouts">
      <div className="card-base recent-workout-card">
        <p className="recent-workout-date small muted">
          {formatDate(workout.date)}
        </p>
        <div className="recent-workout-header">
          <h4>{workout.name}</h4>
        </div>

        <div className="recent-workout-meta">
          <ul className="template-list">
            {exercises.slice(0, 4).map((ex, i) => (
              <li key={i}>{ex.name}</li>
            ))}
          </ul>
          <span>
            <Dumbbell size={14} />

            {workout.exercises?.length || 0}{' '}
            {workout.exercises?.length === 1
              ? 'exercise'
              : 'exercises'}
          </span>

          <span>
            <Clock3 size={14} />

            {formatDuration(
              Math.round((workout.duration || 0) / 60)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
