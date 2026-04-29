import { Pencil } from 'lucide-react'

export default function TemplateHeader({
  name,
  isEditing,
  setIsEditing,
  onChangeName,
}) {
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
    </div>
  )
}
