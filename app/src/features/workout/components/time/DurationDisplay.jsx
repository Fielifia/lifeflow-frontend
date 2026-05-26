import Button from '../../../../shared/components/ui/button/Button'

import { formatWeight } from '../../../../shared/utils/format'

/**
 * Workout duration display.
 * @param {object} props - Component props.
 * @param {number} [props.elapsed] - Elapsed workout time in seconds.
 * @param {number} [props.completedSets]
 * Completed workout sets.
 * @param {number} [props.totalVolume]
 * Completed workout volume.
 * @param {number} [props.startTime] - Workout start timestamp.
 * @param {number} [props.duration] - Workout duration in seconds.
 * @param {string} [props.mode] - Display mode.
 * @param {string} [props.label] - Optional label text.
 * @param {() => void} [props.onClickStartTime] - Callback triggered when clicking the start time button.
 * @returns {import('react').ReactElement} Duration display UI.
 */
export default function DurationDisplay({
  elapsed = 0,
  startTime,
  duration,
  mode = 'run',
  label,
  onClickStartTime,

  completedSets = 0,
  totalVolume = 0,
}) {
  const total = mode === 'run' ? elapsed : duration

  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

  const start = startTime
    ? new Date(startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '--:--'

  return (
    <div className="section">
      <div className="duration">
        {label && <p className="muted small close">{label}</p>}

        <div className="duration-time">
          <strong>{formatted}</strong>
        </div>

        {mode !== 'template' && (
          <div className={`start-time ${startTime ? 'visible' : 'hidden'}`}>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onClickStartTime}
            >
              <span className="muted">
                {startTime ? `Started at ${start}` : ''}
              </span>
            </Button>
          </div>
        )}
      </div>

      {mode === 'run' && (
        <div
          className={`workout-live-stats ${
            completedSets > 0 ? 'visible' : 'hidden'
          }`}
        >
          <div className="workout-stat-badge">{completedSets} sets</div>

          {totalVolume > 0 && (
            <div className="workout-stat-badge">
              {formatWeight(totalVolume)} volume
            </div>
          )}
        </div>
      )}
    </div>
  )
}
