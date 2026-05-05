import { Pencil } from 'lucide-react'
import DurationDisplay from './DurationDisplay'

/**
 * Header for workout page.
 * @param {object} props - Component props
 * @param {string} props.name - Workout name
 * @param {boolean} props.isEditing - Edit mode state
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {(value: string) => void} props.onChangeName - Update name
 * @param {number} props.elapsed - Duration in seconds
 * @param {string} props.status - Workout status
 * @param props.startTime - Workout start time
 * @param props.adjustStartTime - Adjust start time
 * @returns {import('react').ReactElement} Header UI
 */
export default function WorkoutHeader({
  name,
  isEditing,
  setIsEditing,
  onChangeName,
  elapsed,
  status,
  startTime,
  adjustStartTime,
}) {

  return (
    <div className="workout-header">
      {isEditing ? (
        <input
          className="input-base"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          autoFocus
          onBlur={() => {
            onChangeName(name.trim() || 'Workout')
            setIsEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.target.blur()
            }
          }}
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>
          {name} <Pencil className="icon-small" />
        </h2>
      )}

      <DurationDisplay
        elapsed={elapsed}
        status={status}
        startTime={startTime}
        adjustStartTime={adjustStartTime}
      />
    </div>
  )
}
