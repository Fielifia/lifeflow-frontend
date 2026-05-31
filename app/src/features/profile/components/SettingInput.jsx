import { useEffect, useState } from 'react'

/**
 * Reusable component for editing numeric settings in the profile page.
 * @param {object} props - Component props.
 * @param {number} props.value - Current value.
 * @param {string} props.label - Setting label.
 * @param {string} [props.suffix] - Optional suffix to display after the value.
 * @param {number} [props.min] - Minimum allowed value.
 * @param {(value:number)=>void} props.onSave
 * Save handler.
 * @returns {import('react').ReactElement} Setting input UI.
 */
export default function SettingInput({
  label,
  value,
  suffix,
  min = 0,
  onSave,
}) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSave = () => {
    const normalizedValue = Number.isNaN(inputValue) ? 0 : inputValue

    if (normalizedValue !== value) {
      onSave(normalizedValue)
    }

    setEditing(false)
  }

  return (
    <div className="settings-row">
      <span>{label}</span>

      {editing ? (
        <div className="profile-field">
          <input
            type="number"
            className="profile-input-field"
            min={min}
            autoFocus
            value={inputValue}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setInputValue(Number(e.target.value))}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur()
              }
            }}
          />

          {suffix && <span className="muted small"> {suffix}</span>}
        </div>
      ) : (
        <button
          type="button"
          className="btn-settings"
          onClick={() => setEditing(true)}
        >
          {value}
          {suffix ? ` ${suffix}` : ''}
        </button>
      )}
    </div>
  )
}
