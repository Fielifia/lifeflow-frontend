import Button from '../../../../shared/components/ui/button/Button'

import { formatWeight } from '../../../../shared/utils/format'

/**
 * Workout duration display.
 * @param {object} props - Component props.
 * @param {number} [props.elapsed] - Elapsed workout time in seconds.
 * @param {{
 *   completedSets: number,
 *   totalVolume: number
 * }} [props.liveStats] - Active workout statistics
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

  liveStats,
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

  const endTime =
    startTime && total
      ? new Date(new Date(startTime).getTime() + total * 1000)
      : null

  const end = endTime
    ? endTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '--:--'

  const completedSets = liveStats?.completedSets || 0

  const totalVolume = liveStats?.totalVolume || 0

  return (
    <>
      <div className="duration">
        {label && <p className="muted small close">{label}</p>}

        <div className="duration-time">
          <strong>{formatted}</strong>
        </div>

        {mode !== 'template' && (
          <div
            className={`
      workout-times
      ${startTime ? 'visible' : 'hidden'}
    `}
          >
            {mode === 'run' ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={onClickStartTime}
              >
                <span className="muted small">Started at {start}</span>
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={onClickStartTime}
                >
                  <span className="muted small">Time: {start}</span>
                </Button>

                <span className="muted small">→</span>

                <Button type="button" variant="ghost" size="xs">
                  <span className="muted small">{end}</span>
                </Button>
              </>
            )}
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
    </>
  )
}
