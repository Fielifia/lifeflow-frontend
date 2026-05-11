import LoadingButton from '../../../shared/ui/LoadingButton'
/**
 * Workout control buttons.
 * @param {object} props - Component props
 * @param {'idle' | 'running' | 'paused'} props.status - Workout status
 * @param {() => void} props.handleStartPause - Start/pause toggle
 * @param {() => void} props.saveWorkout - Save workout handler
 * @param {() => void} props.onSaveTemplate - Save template handler
 * @param {boolean} props.saving - Saving state
 * @param props.loading - Loading state
 * @param {boolean} props.hasExercises - If exercises exist
 * @returns {import('react').ReactElement} Controls UI
 */
export default function WorkoutControls({
  status,
  handleStartPause,
  saveWorkout,
  onSaveTemplate,
  saving,
  loading,
  hasExercises,
  discardWorkout,
}) {

  const isStarted = status !== 'idle'

  return (
    <div className="workout-controls">
      <button
        className="btn btn-standard btn-secondary workout-toggle-btn"
        onClick={handleStartPause}
        disabled={saving}
      >
        {status === 'running'
          ? '❚❚ Pause'
          : status === 'paused'
            ? '▶ Resume'
            : '▶ Start'}
      </button>

      <LoadingButton
        className="btn btn-standard btn-primary"
        loading={loading}
        saving={saving}
        disabled={!hasExercises}
        onClick={isStarted ? saveWorkout : onSaveTemplate}
      >
        {isStarted ? 'Finish & Save' : 'Save as Template'}
      </LoadingButton>

      <button
        className="btn btn-danger btn-full"
        onClick={discardWorkout}
      >
        Discard workout
      </button>

    </div>
  )
}
