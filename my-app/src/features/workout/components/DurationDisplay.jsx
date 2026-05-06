import { useState } from 'react'
import { ClipboardClock } from 'lucide-react'

/**
 * Workout duration display
 * @param {object} props - Component props
 * @param {number} props.elapsed - Duration in seconds
 * @param {string} props.status - Workout status
 * @param {} props.startTime - Workout start time
 * @param props.adjustStartTime - Adjust start time
 * @returns {import('react').ReactElement} Duration Display UI
 */
export default function DurationDisplay({
  elapsed = 0,
  startTime,
  adjustStartTime,
  duration,
  onChangeDuration,
  mode = 'run',
}) {
  const [editing, setEditing] = useState(false)
  const [time, setTime] = useState('')

  const total = mode === 'edit' ? duration : elapsed

  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`

  // RUN MODE
  if (mode === 'run') {
    const start = startTime
      ? new Date(startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      : '--:--'

    const handleSave = () => {
      if (!time) return

      const [h, m] = time.split(':').map(Number)

      const selected = new Date()
      selected.setHours(h)
      selected.setMinutes(m)
      selected.setSeconds(0)

      adjustStartTime(selected.getTime())
      setEditing(false)
    }

    return (
      <div className="duration">
        <div className="duration-time">
          <strong>{formatted}</strong>
        </div>

        <div className="edit-duration muted small">
          <button className="btn-clean" onClick={() => setEditing(v => !v)}>
            <ClipboardClock className="icon-small" />
          </button>
          Started at {start}{' '}
        </div>

        {editing && (
          <div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        )}
      </div>
    )
  }

  // EDIT MODE
  const handleSave = () => {
    if (!time) return

    const [m, s] = time.split(':').map(Number)
    const newDuration = m * 60 + (s || 0)

    onChangeDuration?.(newDuration)
    setEditing(false)
  }

  return (
    <div className="duration">
      <div className="duration-time">
        <strong>{formatted}</strong>
        <button
          className="btn-clean muted small"
          onClick={() => setEditing((v) => !v)}
        >
          <ClipboardClock className="icon-small" />
        </button>
      </div>

      {editing && (
        <div>
          <input
            type="text"
            placeholder="mm:ss"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  )
}
