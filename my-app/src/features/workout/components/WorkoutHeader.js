import { Pencil } from 'lucide-react'

/**
 * Header for workout page (title + duration).
 * @param {object} props - 
 * @param {string} props.name - Workout name
 * @param {boolean} props.isEditing - If name is being edited
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {string} props.customName - Custom workout name
 * @param {(value: string) => void} props.setCustomName - Update name
 * @param props.onChangeName
 * @param {number} props.elapsed - Workout duration in seconds
 * @returns {import('react').ReactElement} Workout Header UI
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
