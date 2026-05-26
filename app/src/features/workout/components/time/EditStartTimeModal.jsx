/**
 * Reusable modal for editing values.
 * @param {object} props - Component props
 * @param {string} props.title - Modal title
 * @param {string} props.tempValue - Temporary input value
 * @param {(value: string) => void} props.setTempValue
 * Updates temporary value
 * @param {() => void} props.onClose - Closes modal
 * @param {() => void} props.onSave - Saves changes
 * @param {'text' | 'time'} [props.inputType]
 * Input type
 * @returns {import('react').ReactElement}
 * Edit modal UI
 */
export default function EditModal({
  title,
  tempValue,
  setTempValue,
  onClose,
  onSave,
  inputType = 'text',
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>

        <div className="modal-card-content">
          <input
            type={inputType}
            className="input-base"
            value={tempValue}
            autoFocus
            onFocus={(e) => e.target.select()}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSave()
              }
            }}
          />

          <button className="btn btn-sm btn-primary" onClick={onSave}>
            Save
          </button>

          <button className="btn btn-sm btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
