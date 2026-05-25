import './ConfirmDialog.css'

/**
 * Confirmation dialog modal.
 * @param {object} props - Component props
 * @param {boolean} props.open - Open state
 * @param {object|null} props.options - Confirm options
 * @param {(result:boolean) => void} props.onClose - Close handler
 * @returns {import('react').ReactElement|null} Confirm dialog modal
 */
export default function ConfirmDialog({ open, options, onClose }) {
  if (!open || !options) {
    return null
  }

  const {
    title,
    description,

    confirmText = 'Confirm',
    cancelText = 'Cancel',

    variant = 'default',
  } = options

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <h3>{title}</h3>

        {/* DESCRIPTION */}

        {description && <p className="muted center">{description}</p>}

        {/* ACTIONS */}

        <div className="confirm-actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onClose(false)}
          >
            {cancelText}
          </button>

          <button
            className={`
              btn
              btn-sm
              ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}
            `}
            onClick={() => onClose(true)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
