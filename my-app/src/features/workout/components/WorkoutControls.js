/**
 * Workout control buttons.
 * @param {object} props - Component props
 * @param {'idle' | 'running' | 'paused'} props.status - Workout status
 * @param {() => void} props.handleStartPause - Start/pause toggle
 * @param {() => void} props.saveWorkout - Save workout handler
 * @param {() => void} props.onSaveTemplate - Save template handler
 * @param {boolean} props.saving - Saving state
 * @param {boolean} props.hasExercises - If exercises exist
 * @returns {import('react').ReactElement} Controls UI
 */
export default function WorkoutControls({
  status,
  handleStartPause,
  saveWorkout,
  onSaveTemplate,
  saving,
  hasExercises,
}) {
  
  const isStarted = status !== 'idle'

  return (
    <div className="workout-controls">
      <button
        className="btn btn-secondary"
        onClick={handleStartPause}
        disabled={!hasExercises || saving}
      >
        {status === 'running'
          ? 'Pause'
          : status === 'paused'
            ? 'Resume'
            : 'Start'}
      </button>

      <button
        className="btn btn-primary"
        onClick={isStarted ? saveWorkout : onSaveTemplate}
        disabled={saving || !hasExercises}
      >
        {saving
          ? 'Saving...'
          : isStarted
            ? 'Finish & Save'
            : 'Save as Template'}
      </button>
    </div>
  )
}
