/**
 * Modal for editing workout start time.
 * @param {object} props - Component props
 * @param {number} props.startTime - Current workout start time
 * @param {string} props.tempStartTime - Temporary time input value
 * @param {(value: string) => void} props.setTempStartTime - Updates temporary time value
 * @param {() => void} props.onClose - Closes modal
 * @param {(timestamp: number) => void} props.onSave - Saves updated start time
 * @returns {import('react').ReactElement} Edit start time modal UI
 */
export default function EditStartTimeModal({
  startTime,
  tempStartTime,
  setTempStartTime,
  onClose,
  onSave,
}) {

  // ===== HANDLE SAVE =====

  const handleSave = () => {
    const [hours, minutes] = tempStartTime.split(':')

    const updated = new Date(startTime)

    updated.setHours(Number(hours))
    updated.setMinutes(Number(minutes))
    updated.setSeconds(0)

    onSave(updated.getTime())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>

      {/* MODAL */}

      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}

        <h3>Edit start time</h3>

        {/* CONTENT */}

        <div className="modal-card-content">

          {/* INPUT */}

          <input
            type="time"
            className="input-base"
            value={tempStartTime}
            autoFocus
            onFocus={(e) => e.target.select()}
            onChange={(e) => setTempStartTime(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
          />

          {/* SAVE */}

          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
          >
            Save
          </button>

          {/* CANCEL */}

          <button
            className="btn btn-sm btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
