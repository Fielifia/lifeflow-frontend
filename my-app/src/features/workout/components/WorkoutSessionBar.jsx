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
  elapsed,
  status,
  workoutName,
  currentExercise,
  onExpand,
}) {
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  return (
    <div className="workout-session-bar" onClick={onExpand}>
      <div className="session-left">
        <div className="session-time">{formatted}</div>
        <div className="session-status">{status}</div>
      </div>

      <div className="session-center">
        <div className="session-name">{workoutName}</div>
        <div className="session-exercise">{currentExercise}</div>
      </div>

      <div className="session-right">
        <ChevronUp />
      </div>
    </div>
  )
}
