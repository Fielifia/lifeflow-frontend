import DurationDisplay from './DurationDisplay'
import ActionMenu from '../../../shared/components/ui/action-menu/ActionMenu'

/**
 * Header for workout page.
 * @param {object} props - Component props
 * @param {string} props.name - Workout name
 * @param {boolean} props.isEditing - Edit mode state
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {(value: string) => void} props.onChangeName - Update name
 * @param {number} props.elapsed - Duration in seconds
 * @param {string} props.status - Workout status
 * @param {string} props.mode - Workout mode
 * @param {number} props.duration - Workout duration in seconds
 * @param {(duration: number) => void} props.onChangeDuration - Updates workout duration
 * @param {boolean} props.isEditable - Whether workout can be edited
 * @param {boolean} props.showDuration - Whether duration should be displayed
 * @param props.startTime - Workout start time
 * @returns {import('react').ReactElement} Header UI
 */
export default function WorkoutHeader({
  name,
  isEditing,
  setIsEditing,
  onChangeName,
  elapsed,
  startTime,
  mode = 'run',
  duration,
  onChangeDuration,
  isEditable = true,
  showDuration = true,
  menuItems,
}) {
  return (
    <div className="workout-header">
      <ActionMenu items={menuItems} align="right" />

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
          <h2
            className="close"
            onClick={() => {
              if (isEditable) {
                setIsEditing(true)
              }
            }}
          >
            {name}
          </h2>
        )}
      </div>

      {showDuration && (
        <DurationDisplay
          mode={mode}
          elapsed={elapsed}
          startTime={startTime}
          duration={duration}
          onChangeDuration={onChangeDuration}
          isEditable={isEditable}
        />
      )}
    </div>
  )
}
