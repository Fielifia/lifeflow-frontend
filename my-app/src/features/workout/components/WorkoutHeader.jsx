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
  mode = 'run',
  duration,
  onChangeDuration,
  isEditable = true,
  showDuration = true,
}) {

  return (
    <div className="workout-header">
      <div className="workout-name">
        {isEditing && isEditable ? (
          <input
            className="input-base"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            autoFocus
            onBlur={() => {
              onChangeName(name.trim() || 'Workout –')
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
          <h2 className="close"
            onClick={() => {
              if (isEditable) {
                setIsEditing(true)
              }
            }}
          >
            {name} {isEditable && <Pencil className="icon-small" />}
          </h2>
        )}
      </div>

      {showDuration && (
        <DurationDisplay
          mode={mode}
          elapsed={elapsed}
          status={status}
          startTime={startTime}
          adjustStartTime={adjustStartTime}
          duration={duration}
          onChangeDuration={onChangeDuration}
          isEditable={isEditable}
        />
      )}
    </div>
  )
}
