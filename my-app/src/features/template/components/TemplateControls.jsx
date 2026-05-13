import LoadingButton from '../../../shared/ui/LoadingButton'

/**
 * Template action controls.
 * @param {object} props - Component props
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.saving - Saving state
 * @param {() => void} props.saveTemplate - Save template handler
 * @returns {import('react').ReactElement} Template controls UI
 */
export default function WorkoutControls({
  saving,
  saveTemplate,
}) {

  return (
    <div className="template-controls">

      <LoadingButton
        className="btn btn-standard btn-primary"
        loading={saving}
        loadingText="Saving..."
        onClick={saveTemplate}>
        Save Template
      </LoadingButton>
    </div>
  )
}
