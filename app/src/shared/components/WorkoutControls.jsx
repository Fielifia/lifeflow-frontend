import Button from './ui/button/Button'

/**
 * Workout / template control buttons.
 *
 * Variants:
 * - run: Active workout session
 * - detail: Saved workout/template detail page
 * - editor: Workout/template editor page
 * @param {object} props - Component props
 * @param {'card' | 'run' | 'detail' | 'editor'} [props.variant] - Controls layout variant
 * @param {'idle' | 'running' | 'paused'} [props.status] - Current workout timer status
 * @param {() => void} [props.handleStartPause] - Starts or pauses workout timer
 * @param {() => void} [props.onStartWorkout] - Starts workout
 * @param {() => void} [props.onFinishWorkout] - Finishes and saves active workout
 * @param {() => void} [props.onDiscardWorkout] - Discards active workout
 * @param {() => void} [props.onDiscardTemplate] - Discards template in create mode
 * @param {() => void} [props.onDiscardChanges] - Discards current changes in workout/template edit
 * @param {() => void} [props.onEdit] - Opens edit page
 * @param {() => void} [props.onSave] - Saves changes
 * @param {() => void} [props.onDelete] - Deletes entity
 * @param {() => void} [props.onSecondaryAction] - Optional secondary action
 * @param {string} [props.editLabel] - Edit button label
 * @param {string} [props.saveLabel] - Save button label
 * @param {string} [props.deleteLabel] - Delete button label
 * @param {string} [props.discardLabel] - Discard button label
 * @param {string} [props.cancelLabel] - Discard changes button label
 * @param {string} [props.secondaryActionLabel] - Secondary action button label
 * @param {boolean} [props.saving] - Whether save action is in progress
 * @param {boolean} [props.deleting] - Whether delete action is in progress
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
  onDiscardTemplate,
  onDiscardChanges,

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
  deleting = false,
  hasExercises = false,
}) {
  return (
    <div className={`workout-controls-${variant}`}>
      {/* =========================
                CARD
      ========================== */}

      {variant === 'card' && (
        <>
          {/* START WORKOUT */}
          {onStartWorkout && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onStartWorkout}
            >
              Start workout
            </Button>
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
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartPause}
              disabled={saving}
            >
              <span className="toggle-symbol">
                {status === 'running' ? '❚❚' : '▶'}
              </span>

              <span>
                {status === 'running'
                  ? 'Pause'
                  : status === 'paused'
                    ? 'Resume'
                    : 'Start'}
              </span>
            </Button>
          )}

          {/* FINISH & SAVE */}

          {onFinishWorkout && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={saving}
              disabled={!hasExercises}
              onClick={onFinishWorkout}
            >
              Finish & Save
            </Button>
          )}

          {/* DISCARD */}

          {onDiscardWorkout && (
            <Button variant="danger" size="lg" onClick={onDiscardWorkout}>
              Discard
            </Button>
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
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onStartWorkout}
            >
              Start workout
            </Button>
          )}

          {/* EDIT */}

          {onEdit && (
            <Button variant="secondary" size="lg" fullWidth onClick={onEdit}>
              {editLabel}
            </Button>
          )}

          {/* SECONDARY ACTION */}

          {onSecondaryAction && (
            <Button variant="secondary" size="lg" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}

          {/* DELETE */}

          {onDelete && (
            <Button
              variant="danger"
              size="lg"
              loading={deleting}
              onClick={onDelete}
            >
              {deleteLabel}
            </Button>
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
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={saving}
              disabled={!hasExercises}
              onClick={onSave}
            >
              {saveLabel}
            </Button>
          )}

          {/* SECONDARY ACTION */}
          {onSecondaryAction && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}

          {/* DISCARD */}
          {onDiscardTemplate && (
            <Button variant="danger" size="lg" onClick={onDiscardTemplate}>
              {discardLabel}
            </Button>
          )}

          {/* DISCARD */}
          {onDiscardChanges && (
            <Button variant="danger" size="lg" onClick={onDiscardChanges}>
              {cancelLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
