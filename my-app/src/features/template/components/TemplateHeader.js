import { Pencil } from 'lucide-react'

/**
 * Editable header for a template name.
 * @param {object} props - Component props
 * @param {string} props.name - Template name
 * @param {boolean} props.isEditing - Whether name is being edited
 * @param {(value: boolean) => void} props.setIsEditing - Toggle edit mode
 * @param {(value: string) => void} props.onChangeName - Update name handler
 * @returns {import('react').ReactElement} Template header UI
 */
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
