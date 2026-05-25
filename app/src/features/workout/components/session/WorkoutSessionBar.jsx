import { ChevronUp } from 'lucide-react'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import { getCurrentExercise } from '../../../../shared/utils/getCurrentExercise'

/**
 * Workout session bar display and controls.
 * @param {object} props - Component props
 * @param {{
 *   name: string,
 *   exercises: Array<object>
 * }} props.workout - Current workout data
 * @param {boolean} props.isResting - Whether rest timer is active
 * @param {number} props.restRemaining - Remaining rest time in seconds
 * @param {(seconds: number) => void} props.adjustRest - Adjusts rest timer duration
 * @param {() => void} props.skipRest - Skips current rest timer
 * @param {() => void} props.onExpand - Opens workout session page
 * @returns {import('react').ReactElement} Workout session bar UI
 */
export default function WorkoutSessionBar({
  workout,
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
  onExpand,
}) {
  const { elapsed, status } = useWorkoutContext()

  const workoutName = workout?.name || 'Workout'

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  const exercises = workout?.exercises || []

  const currentExercise = getCurrentExercise(exercises)

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
            <div className="session-exercise">
              <span>Next: </span>
              <span className="exercise-name">{currentExercise}</span>
            </div>
          </div>
        </div>

        {isResting && (
          <div className="rest-controls">
            <button
              onClick={(e) => {
                e.stopPropagation()
                adjustRest(-15)
              }}
            >
              −
            </button>

            <span className="rest-time">{restRemaining}s</span>

            <button
              onClick={(e) => {
                e.stopPropagation()
                adjustRest(15)
              }}
            >
              +
            </button>

            <button
              className="skip"
              onClick={(e) => {
                e.stopPropagation()
                skipRest()
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
