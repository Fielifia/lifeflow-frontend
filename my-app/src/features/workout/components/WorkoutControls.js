/**
 * Workout control buttons for starting/pausing and saving a workout.
 * @param {object} props - Component props
 * @param {'idle' | 'running' | 'paused'} props.status - Current workout status
 * @param {() => void} props.handleStartPause - Toggles start/pause/resume
 * @param {() => void} props.saveWorkout - Saves the workout
 * @param {boolean} props.saving - Indicates if save is in progress
 * @param {boolean} props.hasExercises - Whether workout has at least one exercise
 * @returns {import('react').ReactElement} Workout controls UI
 */
export default function WorkoutControls({
  status,
  handleStartPause,
  saveWorkout,
  onSaveTemplate,
  saving,
  hasExercises,
}) {
  const isStarted = status != 'idle'
  
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
