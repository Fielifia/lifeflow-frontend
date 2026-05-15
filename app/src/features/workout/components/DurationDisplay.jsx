import { ClipboardClock } from 'lucide-react'
import { useState } from 'react'

/**
 * Workout duration display.
 * @param {object} props - Component props
 * @param {number} props.elapsed - Elapsed workout time in seconds
 * @param {number} props.startTime - Workout start timestamp
 * @param {(time: number) => void} props.adjustStartTime - Updates workout start time
 * @param {number} props.duration - Workout duration in seconds
 * @param {(duration: number) => void} props.onChangeDuration - Updates workout duration
 * @param {string} props.mode - Display mode
 * @param {boolean} props.isEditable - Whether duration can be edited
 * @returns {import('react').ReactElement} Duration display UI
 */
export default function DurationDisplay({
  elapsed = 0,
  startTime,
  adjustStartTime,
  duration,
  onChangeDuration,
  mode = 'run',
  isEditable = true,
}) {
  const [editing, setEditing] = useState(false)
  const [time, setTime] = useState('')

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

  const handleSave = () => {
    if (!time) return

    if (mode === 'run') {
      const [h, m] = time.split(':').map(Number)

      const selected = new Date()

      selected.setHours(h)
      selected.setMinutes(m)
      selected.setSeconds(0)

      adjustStartTime(selected.getTime())
    } else {
      const [m, s] = time.split(':').map(Number)

      const newDuration = m * 60 + (s || 0)

      onChangeDuration?.(newDuration)
    }

    setEditing(false)
  }

  return (
    <div className="duration">
      <div className="duration-time">
        <strong>{formatted}</strong>
      </div>

      {mode === 'run' && (
        <div className="edit-duration muted small">
          <span>Started at {start}</span>

          {editing ? (
            <input
              className="input-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              onBlur={() => {
                handleSave()
                setEditing(false)
              }}
              autoFocus
            />
          ) : (
            isEditable && (
              <button
                className="btn-clean muted small"
                onClick={() => setEditing(true)}
              >
                <ClipboardClock className="icon-small" />
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
