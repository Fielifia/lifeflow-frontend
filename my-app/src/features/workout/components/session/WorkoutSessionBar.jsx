import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import { ChevronUp } from 'lucide-react'

/**
 * Workout session bar display and controls.
 * * @param {object} props - Component props.
 * @param {boolean} props.isResting - Indicates whether the rest timer is active.
 * @param {number} props.restRemaining - Remaining rest time in seconds.
 * @param {Function} props.adjustRest - Adjusts the remaining rest timer duration.
 * @param {Function} props.skipRest - Skips the current rest period.
 * @param {Function} props.onExpand - Opens the expanded workout session view.
 * @returns {React.ReactElement} Workout session bar component.
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

  const exercises = activeWorkout?.exercises || []

  let lastCompletedIndex = -1

  exercises.forEach((ex, i) => {
    if (ex.sets?.some((s) => s.completed)) {
      lastCompletedIndex = i
    }
  })

  let nextExercise = null

  for (let i = lastCompletedIndex + 1; i < exercises.length; i++) {
    const ex = exercises[i]
    const isFullyCompleted = ex.sets?.every((s) => s.completed)

    if (!isFullyCompleted) {
      nextExercise = ex
      break
    }
  }

  if (!nextExercise) {
    nextExercise = exercises.find(
      (ex) => !ex.sets?.every((s) => s.completed)
    )
  }

  const currentExercise = nextExercise
    ? `Next: ${nextExercise.name}`
    : 'Done ✔'

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
