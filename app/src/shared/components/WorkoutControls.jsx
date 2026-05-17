import LoadingButton from './ui/LoadingButton'

/**
 * Workout / template control buttons.
 *
 * Variants:
 * - run: Active workout session
 * - detail: Saved workout/template detail page
 * - editor: Workout/template editor page
 *
 * @param {object} props - Component props
 * @param {'run' | 'detail' | 'editor'} [props.variant] - Controls layout variant
 *
 * @param {'idle' | 'running' | 'paused'} [props.status] - Current workout timer status
 * @param {() => void} [props.handleStartPause] - Starts or pauses workout timer
 *
 * @param {() => void} [props.onStartWorkout] - Starts workout
 * @param {() => void} [props.onFinishWorkout] - Finishes and saves active workout
 * @param {() => void} [props.onDiscardWorkout] - Discards active workout
 * @param {() => void} [props.onDiscardChanges] - Discards current changes in workout
 * @param {() => void} [props.onEdit] - Opens edit page
 * @param {() => void} [props.onSave] - Saves changes
 * @param {() => void} [props.onDelete] - Deletes entity
 * @param {() => void} [props.onDiscard] - Discards editor changes
 * @param {() => void} [props.onSecondaryAction] - Optional secondary action
 * @param {string} [props.editLabel] - Edit button label
 * @param {string} [props.saveLabel] - Save button label
 * @param {string} [props.deleteLabel] - Delete button label
 * @param {string} [props.discardLabel] - Discard button label
 * @param {string} [props.discardChangesLabel] - Discard changes button label
 * @param {() => void} [props.onSecondaryAction] - Optional secondary action
 * @param {string} [props.secondaryActionLabel] - Secondary action button label
 * @param {boolean} [props.saving] - Whether save action is in progress
 * @param {boolean} [props.loading] - Whether delete/load action is in progress
 * @param {boolean} [props.hasExercises] - Whether content contains exercises
 * @returns {import('react').ReactElement} Controls UI
 */
export default function WorkoutControls({
  variant = 'run',

  status,
  handleStartPause,

  onStartWorkout,
  onFinishWorkout,
  onDiscardWorkout,
  onDiscardChanges,
  onDiscardTemplate,

  onEdit,
  onSave,
  onDelete,
  onSecondaryAction,

  editLabel = 'Edit',
  saveLabel = 'Save',
  deleteLabel = 'Delete',
  discardLabel = 'Discard',
  cancelLabel = 'Cancel',
  secondaryActionLabel = '',

  saving = false,
  loading = false,
  hasExercises = false,
}) {
  return (
    <div className="workout-controls">
      {/* =========================
                CARD
      ========================== */}

      {variant === 'card' && (
        <>
          {/* START WORKOUT */}
          {onStartWorkout && (
            <button
              className="btn btn-standard btn-primary btn-full"
              onClick={onStartWorkout}
            >
              Start workout
            </button>
          )}
        </>
      )}

      {/* =========================
            ACTIVE WORKOUT
      ========================== */}

      {variant === 'run' && (
        <>
          {/* START / PAUSE / RESUME */}
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

          {/* FINISH & SAVE */}
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

          {/* DISCARD */}
          {onDiscardWorkout && (
            <button
              className="btn btn-danger btn-full"
              onClick={onDiscardWorkout}
            >
              Discard workout
            </button>
          )}
        </>
      )}

      {/* =========================
              DETAIL PAGE
      ========================== */}

      {variant === 'detail' && (
        <>
          {/* START WORKOUT */}
          {onStartWorkout && (
            <button
              className="btn btn-standard btn-primary btn-full"
              onClick={onStartWorkout}
            >
              Start workout
            </button>
          )}

          {/* EDIT */}
          {onEdit && (
            <button
              className="btn btn-standard btn-secondary btn-full"
              onClick={onEdit}
            >
              {editLabel}
            </button>
          )}

          {/* SECONDARY ACTION */}
          {onSecondaryAction && (
            <button
              className="btn btn-standard btn-secondary btn-full"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}

          {/* DELETE */}
          {onDelete && (
            <LoadingButton
              className="btn btn-standard btn-danger btn-full"
              loading={loading}
              onClick={onDelete}
            >
              {deleteLabel}
            </LoadingButton>
          )}
        </>
      )}

      {/* =========================
              EDITOR PAGE
      ========================== */}

      {variant === 'editor' && (
        <>
          {/* SAVE */}
          {onSave && (
            <LoadingButton
              className="btn btn-standard btn-primary btn-full"
              loading={saving}
              disabled={!hasExercises}
              onClick={onSave}
            >
              {saveLabel}
            </LoadingButton>
          )}

          {/* SECONDARY ACTION */}
          {onSecondaryAction && (
            <button
              className="btn btn-standard btn-secondary btn-full"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}

          {/* DISCARD */}
          {onDiscardTemplate && (
            <button
              className="btn btn-standard btn-danger btn-full"
              onClick={onDiscardTemplate}
            >
              {discardLabel}
            </button>
          )}

          {/* DISCARD */}
          {onDiscardChanges && (
            <button
              className="btn btn-danger btn-full"
              onClick={onDiscardChanges}
            >
              {cancelLabel}
            </button>
          )}
        </>
      )}
    </div>
  )
}
