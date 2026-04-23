import { Pencil } from 'lucide-react'

/**
 *
 * @param root0
 * @param root0.title
 * @param root0.isEditing
 * @param root0.setIsEditing
 * @param root0.customName
 * @param root0.setCustomName
 * @param root0.elapsed
 */
export default function WorkoutHeader({
  title,
  isEditing,
  setIsEditing,
  customName,
  setCustomName,
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
          value={customName}
          autoFocus
          onChange={(e) => setCustomName(e.target.value)}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <h2 onClick={() => setIsEditing(true)}>
          {title} <Pencil className="icon-small" />
        </h2>
      )}

      <span>Duration: {formatTime(elapsed)}</span>
    </div>
  )
}
