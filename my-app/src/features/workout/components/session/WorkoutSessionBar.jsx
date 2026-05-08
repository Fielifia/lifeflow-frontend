import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import { ChevronUp } from 'lucide-react'

/**
 * @param {object} props
 * @param {number} props.elapsed
 * @param {string} props.status
 * @param {string} props.workoutName
 * @param {string} props.currentExercise
 * @param {() => void} props.onExpand
 */
export default function WorkoutSessionBar({
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
  onExpand,
}) {
  const { elapsed, status, activeWorkout } = useWorkoutContext()

  const workoutName = activeWorkout?.name || 'Workout'

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  const currentExercise =
  activeWorkout?.exercises?.find((ex) =>
    ex.sets?.some((s) => !s.completed)
  )?.name || 'No exercise'

  return (
    <div
      className={`workout-session-bar ${isResting ? 'rest-active' : ''}`}
      onClick={onExpand}
    >
      <div className="session-left">
        <div className="session-time">{formatted}</div>
        <div className="session-status">{status}</div>
      </div>

      <div className="session-center">
        <div className="session-center-left">
          <div className="session-name">{workoutName}</div>

          <div className="session-exercise-row">
            <div className="session-exercise">{currentExercise}</div>
          </div>
        </div>

        {isResting && (
          <div className="rest-controls">
            <button onClick={(e) => { e.stopPropagation(); adjustRest(-15) }}>−</button>

            <span className="rest-time">{restRemaining}s</span>

            <button onClick={(e) => { e.stopPropagation(); adjustRest(15) }}>+</button>

            <button
              className="skip"
              onClick={(e) => {
                e.stopPropagation()
                skipRest()
                requestAnimationFrame(() => onExpand())
              }}
            >
              Skip
            </button>
          </div>
        )}
      </div>

      <div className="session-right">
        <ChevronUp />
      </div>
    </div>
  )
}
