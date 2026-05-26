import Button from '../../../../shared/components/ui/button/Button'

/**
 * Reusable modal for editing values.
 * @param {object} props - Component props
 * @param {string} props.title - Modal title
 * @param {string} props.tempValue - Temporary input value
 * @param {(value: string) => void} props.setTempValue - Set temporary value
 * @param {'text' | 'time'} [props.inputType]
 * Input type
 * Updates temporary value
 * @param {() => void} props.onClose - Closes modal
 * @param {() => void} props.onSave - Saves changes
 * @param {import('react').ReactNode} props.children - Modal content
 * @param {string} props.contentClassName - Modal classname
 * @param {string} props.saveLabel - Save label
 * @param {string} props.cancelLabel - Cancel label
 * @returns {import('react').ReactElement}
 * Edit modal UI
 */
export default function EditModal({
  title,

  tempValue,
  setTempValue,

  inputType = 'text',

  onClose,
  onSave,

  children,

  contentClassName = '',

  saveLabel = 'Save',
  cancelLabel = 'Cancel',
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div
          className={`
    modal-card-content
    ${contentClassName || ''}
  `}
        >
          {children || (
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
          )}

          <div className="modal-actions">
            <Button variant="primary" size="lg" fullWidth onClick={onSave}>
              {saveLabel}
            </Button>

            <Button variant="secondary" size="lg" onClick={onClose}>
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
