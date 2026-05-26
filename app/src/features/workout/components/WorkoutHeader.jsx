import DurationDisplay from './time/DurationDisplay'
import ActionMenu from '../../../shared/components/ui/action-menu/ActionMenu'

/**
 * Header for workout page.
 * @param {object} props - Component props.
 * @param {string} props.name - Workout name.
 * @param {number} props.elapsed - Duration in seconds.
 * @param {number} [props.completedSets]
 * Completed workout sets.
 * @param {number} [props.totalVolume]
 * Completed workout volume.
 * @param {Date | null} props.startTime - Workout start time.
 * @param {'run' | 'history'} [props.mode] - Duration display mode.
 * @param {number} props.duration - Workout duration in seconds.
 * @param {string} [props.durationLabel] - Duration label text.
 * @param {(duration: number) => void} props.onChangeDuration - Updates workout duration.
 * @param {boolean} [props.isEditable] - Whether workout can be edited.
 * @param {boolean} [props.showDuration] - Whether duration should be displayed.
 * @param {Array<object>} props.menuItems - Contextual action menu items.
 * @param {() => void} [props.onEditName]
* Callback triggered when clicking workout name.
 * @param {() => void} [props.onEditStartTime] - Callback triggered when editing workout start time.
 * @returns {import('react').ReactElement} Header UI.
 */
export default function WorkoutHeader({
  name,
  elapsed,

  completedSets,
  totalVolume,
  
  startTime,
  mode = 'run',

  duration,
  durationLabel,
  onChangeDuration,
  isEditable = true,
  showDuration = true,
  menuItems,

  onEditName,
  onEditStartTime,
}) {

  return (
    <div className="workout-header">
      {/* ACTION MENU */}

      {menuItems?.length > 0 && <ActionMenu items={menuItems} align="right" />}

      {/* WORKOUT NAME */}

      <div className="workout-name">
        <h2
          className={isEditable ? 'close clickable' : 'close'}
          onClick={() => {
            if (isEditable && onEditName) {
              onEditName()
            }
          }}
        >
          {name}
        </h2>
      </div>

      {/* DURATION DISPLAY */}

      {showDuration && (
        <DurationDisplay
          mode={mode}
          elapsed={elapsed}
          completedSets={completedSets}
          totalVolume={totalVolume}
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
