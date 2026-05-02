import { Pencil } from 'lucide-react'

/**
 * Header for workout page.
 * @param {object} props - Component props
 * @param {string} props.name - Workout name
 * @param {boolean} props.isEditing - Edit mode state
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {(value: string) => void} props.onChangeName - Update name
 * @param {number} props.elapsed - Duration in seconds
 * @returns {import('react').ReactElement} Header UI
 */
export default function WorkoutHeader({
  name,
  isEditing,
  setIsEditing,
  onChangeName,
  elapsed,
}) {
  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="workout-header">
      {isEditing ? (
        <input
          className="input-base"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          autoFocus
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.target.blur()
            }
          }}
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>
          {name} <Pencil className="icon-small" />
        </h2>
      )}

      <span>Duration: {formatTime(elapsed)}</span>
    </div>
  )
}
