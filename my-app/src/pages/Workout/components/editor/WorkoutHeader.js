import { Pencil } from 'lucide-react'
import { useState } from 'react'

/**
 * Header for workout page (title + duration).
 * @param {object} props - 
 * @param {string} props.title - Workout name
 * @param {boolean} props.isEditing - If title is being edited
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {string} props.customName - Custom workout name
 * @param {(value: string) => void} props.setCustomName - Update name
 * @param props.onChangeName
 * @param {number} props.elapsed - Workout duration in seconds
 * @returns {import('react').ReactElement} Workout Header UI
 */
export default function WorkoutHeader({ title, onChangeName, elapsed }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="workout-header">
      {isEditing ? (
        <input
          className="input-base"
          value={title}
          onChange={(e) => onChangeName(e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>{title} <Pencil className="icon-small" /></h2>
      )}

      {elapsed !== null && elapsed !== undefined && (
        <p className="muted">{Math.floor(elapsed / 60)} min</p>
      )}
    </div>
  )
}
