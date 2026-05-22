import DurationDisplay from './time/DurationDisplay'
import ActionMenu from '../../../shared/components/ui/action-menu/ActionMenu'

/**
 * Header for workout page.
 * @param {object} props - Component props.
 * @param {string} props.name - Workout name.
 * @param {boolean} props.isEditing - Edit mode state.
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode.
 * @param {(value: string) => void} props.onChangeName - Update name.
 * @param {number} props.elapsed - Duration in seconds.
 * @param {Date | null} props.startTime - Workout start time.
 * @param {'run' | 'history'} [props.mode] - Duration display mode.
 * @param {number} props.duration - Workout duration in seconds.
 * @param {string} [props.durationLabel] - Duration label text.
 * @param {(duration: number) => void} props.onChangeDuration - Updates workout duration.
 * @param {boolean} [props.isEditable] - Whether workout can be edited.
 * @param {boolean} [props.showDuration] - Whether duration should be displayed.
 * @param {Array<object>} props.menuItems - Contextual action menu items.
 * @param {() => void} [props.onEditStartTime] - Callback triggered when editing workout start time.
 * @returns {import('react').ReactElement} Header UI.
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
  durationLabel,
  onChangeDuration,
  isEditable = true,
  showDuration = true,
  menuItems,
  onEditStartTime,
}) {

  return (
    <div className="workout-header">

      {/* ACTION MENU */}

      {menuItems?.length > 0 && (
        <ActionMenu
          items={menuItems}
          align="right"
        />
      )}

      {/* WORKOUT NAME */}

      <div className="workout-name">
        {isEditing && isEditable ? (
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

      {/* DURATION DISPLAY */}

      {showDuration && (
        <DurationDisplay
          mode={mode}
          elapsed={elapsed}
          startTime={startTime}
          duration={duration}
          label={durationLabel}
          onChangeDuration={onChangeDuration}
          isEditable={isEditable}
          onClickStartTime={onEditStartTime}
        />
      )}
    </div>
  )
}
