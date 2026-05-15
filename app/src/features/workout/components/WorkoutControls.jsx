import LoadingButton from '../../../shared/ui/LoadingButton'
/**
 * Workout control buttons.
 * @param {object} props - Component props
 * @param {'idle' | 'running' | 'paused'} [props.status] - Current workout timer status
 * @param {() => void} [props.handleStartPause] - Starts or pauses workout timer
 * @param {() => void} [props.onEditWorkout] - Opens workout edit page
 * @param {() => void} [props.onFinishWorkout] - Finishes and saves active workout session
 * @param {() => void} [props.onSaveWorkout] - Saves workout changes
 * @param {() => void} [props.onSaveAsTemplate] - Saves workout as template
 * @param {() => void} [props.discardWorkout] - Discards active workout session
 * @param {() => void} [props.deleteCurrentWorkout] - Deletes workout permanently
 * @param {boolean} [props.saving] - Whether a save action is in progress
 * @param {boolean} [props.loading] - Whether a delete/load action is in progress
 * @param {boolean} [props.hasExercises] - Whether workout contains exercises
 * @returns {import('react').ReactElement} Controls UI
 */
export default function WorkoutControls({
  status,
  handleStartPause,

  onEditWorkout,

  onFinishWorkout,
  onSaveWorkout,
  onSaveAsTemplate,

  discardWorkout,
  deleteCurrentWorkout,

  saving,
  loading,
  hasExercises,
}) {

  return (
    <div className="workout-controls">
      {/* DURATION TIMER CONTROL */}
      {handleStartPause && (
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
      )}

      {/* FINISH & SAVE WORKOUT */}
      {onFinishWorkout && (
        <LoadingButton
          className="btn btn-standard btn-primary"
          loading={saving}
          disabled={!hasExercises}
          onClick={onFinishWorkout}
        >
          Finish & Save
        </LoadingButton>
      )}

      {/* DISCARD WORKOUT */}
      {discardWorkout && (
        <button
          className="btn btn-danger btn-full"
          onClick={discardWorkout}
        >
          Discard workout
        </button>
      )}

      {/* EDIT WORKOUT */}
      {onEditWorkout && (
        <button
          className="btn btn-standard btn-secondary btn-full"
          onClick={onEditWorkout}
        >
          Edit workout
        </button>
      )}

      {/* SAVE EDITED WORKOUT */}
      {onSaveWorkout && (
        <LoadingButton
          className="btn btn-standard btn-primary btn-full"
          loading={saving}
          onClick={onSaveWorkout}
        >
          Save Workout
        </LoadingButton>
      )}

      {/* SAVE WORKOUT AS TEMPLATE */}
      {onSaveAsTemplate && (
        <button
          className="btn btn-standard btn-secondary"
          onClick={onSaveAsTemplate}
        >
          Save as Template
        </button>
      )}

      {/* DELETE SAVED WORKOUT */}
      {deleteCurrentWorkout && (
        <LoadingButton
          className="btn btn-standard btn-danger"
          loading={loading}
          onClick={deleteCurrentWorkout}
        >
          Delete workout
        </LoadingButton>
      )}

    </div>
  )
}
