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
  elapsed,
  status,
  startTime,
  adjustStartTime,
}) {
  const [editing, setEditing] = useState(false)
  const [time, setTime] = useState('')

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  const formatted = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`

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
    selected.setMilliseconds(0)

    adjustStartTime(selected.getTime())
    setEditing(false)
  }

  return (
    <div className="duration">
      <div>
        <strong>{formatted}</strong> ({status})
      </div>

      <div className="muted small">
        Started at {start}{' '}
        <button className="btn-clean muted small" onClick={() => setEditing((v) => !v)}><ClipboardClock className="icon-small"/></button>
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
