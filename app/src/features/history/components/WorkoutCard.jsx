import { formatDate, formatDuration } from '../../../shared/utils/format'
import WorkoutControls from '../../workout/components/WorkoutControls'
import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

/**
 * Displays a summary card for a workout.
 * @param {{ workout: { _id: string, name?: string, createdAt: string, duration: number, exercises: Array } }} props
 * @returns {import('react').ReactElement} Workout card UI
 */
export default function WorkoutCard({ workout, onClick }) {
  const exercises = workout.exercises || []
  const { startWorkout } = useStartWorkout()

  return (
    <div
      className="card-base workout-card clickable"
      onClick={onClick}
    >
      {/* HEADER */}
      <div className="workout-card-header">
        <div className="workout-card-header-content">
          <h3>{workout.name}</h3>
          <p className="muted small">
            {formatDuration(
              Math.round((workout.duration || 0) / 60)
            )} • {formatDate(workout.date)}</p>
        </div>

        <button className="btn-clean btn-dots">⋮</button>
      </div>

      {/* EXERCISE PREVIEW */}
      <ul className="workout-card-exercise-list">
        {exercises.slice(0, 3).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      {exercises.length > 2 && (
        <p className="muted small center">
          And {exercises.length - 2} more ..
        </p>
      )}

      {/* ACTION */}
      <WorkoutControls
        onStartWorkout={(e) => {
          e.stopPropagation()
          startWorkout({ workout })
        }}
        hasExercises={exercises.length > 0}
      />
    </div>
  )
}
