import { getCurrentExercise } from '../../../../shared/utils/getCurrentExercise'

import './RestTimer.css'

/**
 * Floating rest timer shown after completing a set.
 * @param {object} props - Component props
 * @param {boolean} props.isResting - If timer is active
 * @param {number} props.restRemaining - Seconds left
 * @param {(amount: number) => void} props.adjustRest - Adjust time (+/-)
 * @param {() => void} props.skipRest - Skip current rest
 * @param {string} props.exercises - Exercises
 * @returns {import('react').ReactElement|null} Rest timer UI or null
 */
export default function RestTimer({
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
  exercises,
}) {

  const currentExercise = getCurrentExercise(exercises || [])

  return (
    <div className={`rest-timer-floating ${isResting ? 'show' : ''}`}>
      <div className="session-exercise">
        <span>Next: </span>
        <span className="exercise-name">{currentExercise}</span>
      </div>

      <div className="rest-controls">
        <button onClick={() => adjustRest(-15)}>−</button>

        <span className="rest-time">{Math.max(0, restRemaining)}s</span>

        <button onClick={() => adjustRest(15)}>+</button>

        <button className="skip" onClick={skipRest}>
          Skip
        </button>
      </div>
    </div>
  )
}
