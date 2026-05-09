import LoadingButton from '../../../shared/ui/LoadingButton'

export default function WorkoutControls({
  loading,
  saving,
  saveTemplate,
}) {

  return (
    <div className="template-controls">

      <LoadingButton
        className="btn btn-standard btn-primary"
        loading={loading}
        saving={saving}
        loadingText="Saving..."
        onClick={saveTemplate}>
        Save Template
      </LoadingButton>
    </div>
  )
}
