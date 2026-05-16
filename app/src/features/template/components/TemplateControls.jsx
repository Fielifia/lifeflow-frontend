import LoadingButton from '../../../shared/components/ui/LoadingButton'

/**
 * Template control buttons.
 * @param {object} props - Component props
 * @param {() => void} [props.onEditTemplate] - Edit template handler
 * @param {() => void} [props.onUseTemplate] - Use template handler
 * @param {() => void} [props.onSaveTemplate] - Save template handler
 * @param {() => void} [props.onDeleteTemplate] - Delete template handler
 * @param {boolean} [props.saving] - Saving state
 * @param {boolean} [props.loading] - Loading state
 * @param {boolean} [props.hasExercises] - If template has exercises
 * @returns {import('react').ReactElement} Template controls UI
 */
export default function TemplateControls({
  onStartWorkout,
  onEditTemplate,
  onSaveTemplate,
  onDeleteTemplate,

  saving = false,
  loading = false,
  hasExercises = false,
}) {
  return (
    <div className="workout-controls">
      {onEditTemplate && (
        <button
          className="btn btn-standard btn-secondary btn-full"
          onClick={onEditTemplate}
        >
          Edit template
        </button>
      )}

      {onStartWorkout && (
        <button
          className="btn btn-standard btn-primary btn-full"
          onClick={onStartWorkout}
        >
          Start workout
        </button>
      )}

      {onSaveTemplate && (
        <LoadingButton
          className="btn btn-standard btn-primary btn-full"
          loading={saving}
          disabled={!hasExercises}
          onClick={onSaveTemplate}
        >
          Save Template
        </LoadingButton>
      )}

      {onDeleteTemplate && (
        <LoadingButton
          className="btn btn-standard btn-danger btn-full"
          loading={loading}
          onClick={onDeleteTemplate}
        >
          Delete template
        </LoadingButton>
      )}
    </div>
  )
}
