export default function EditStartTimeModal({
  startTime,
  tempStartTime,
  setTempStartTime,
  onClose,
  onSave,
}) {

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
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Edit start time</h3>

        <div className="modal-card-content">
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

          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
          >
            Save
          </button>

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
