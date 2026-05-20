/**
 * Workout duration display.
 * @param {object} props - Component props
 * @param {number} props.elapsed - Elapsed workout time in seconds
 * @param {number} props.startTime - Workout start timestamp
 * @param {number} props.duration - Workout duration in seconds
 * @param {string} props.mode - Display mode
 * @returns {import('react').ReactElement} Duration display UI
 */
export default function DurationDisplay({
  elapsed = 0,
  startTime,
  duration,
  mode = 'run',
  label,
}) {

  const total =
    mode === 'run'
      ? elapsed
      : duration

  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`

  const start = startTime
    ? new Date(startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    : '--:--'


  return (
    <div className="duration">

      {label && (
        <p className="muted small close">
          {label}
        </p>
      )}

      <div className="duration-time">
        <strong>{formatted}</strong>
      </div>

      {mode === 'run' && (
        <div className={`start-time ${startTime ? 'visible' : 'hidden'}`}>
          <span className="muted">
            {startTime ? `Started at ${start}` : ''}
          </span>
        </div>
      )}
    </div>
  )
}
