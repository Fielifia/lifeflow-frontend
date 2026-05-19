import {
  Trophy
} from 'lucide-react'

import { useHoldToDelete } from '../hooks/useHoldToDelete'


/**
 * Displays a single editable exercise set row.
 * @param {object} props - Component props
 * @param {object} props.set - Exercise set
 * @param {number} props.i - Exercise index
 * @param {number} props.j - Set index
 * @param {object} props.actions - Exercise mutation handlers
 * @param {boolean} props.isEditable - Whether row is editable
 * @param {boolean} props.isRunMode - Whether run mode is active
 * @param {boolean} props.isWorkoutMode - Whether workout mode is active
 * @param {boolean} props.isHistoricalPB - Whether set is a PB
 * @param {string} props.gridClass - Layout grid class
 * @param {Array} props.inputRefs - Input refs
 * @returns {import('react').ReactElement} Exercise set row UI
 */
export default function ExerciseSetRow({
  set,
  i,
  j,
  actions,
  isEditable,
  isRunMode,
  isWorkoutMode,
  isHistoricalPB,
  gridClass,
  inputRefs,
}) {
  const {
    updateSet,
    removeSet,
    toggleSetComplete,
  } = actions

  const hold = useHoldToDelete(
    () => removeSet(i, j),
  )

  return (
    <div
      onMouseDown={isEditable ? hold.startHold : undefined}
      onMouseUp={isEditable ? hold.cancelHold : undefined}
      onMouseLeave={isEditable ? hold.cancelHold : undefined}
      onTouchStart={isEditable ? hold.startHold : undefined}
      onTouchEnd={isEditable ? hold.cancelHold : undefined}
      className={`set-row ${gridClass}
        ${set.completed ? 'completed' : ''}
        ${isHistoricalPB ? 'best-set' : ''}
      `}
    >
      {hold.holding && (
        <div className="hold-indicator">
          <div
            className="hold-progress"
            style={{ transform: `scaleX(${hold.progress})` }}
          />
        </div>
      )}

      <span className={`set-number ${isHistoricalPB ? 'pb' : ''}`}>
        {isRunMode && isHistoricalPB
          ? <Trophy className="icon-small" />
          : j + 1}
      </span>

      {/* PREVIOUS */}

      {isRunMode && (
        <span className="previous">
          {set.prevWeight != null && set.prevReps != null
            ? `${set.prevWeight}×${set.prevReps}`
            : '–'}
        </span>
      )}

      {/* WEIGHT */}

      {isEditable ? (
        <input
          ref={(el) => (inputRefs.current[j] = el)}
          className="input-base"
          type="number"
          value={set.weight ?? ''}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            updateSet(
              i,
              j,
              'weight',
              e.target.value === ''
                ? ''
                : Number(e.target.value),
            )
          }
        />
      ) : (
        <span>{set.weight ?? '-'}</span>
      )}

      {/* REPS */}

      {isEditable && !isWorkoutMode ? (
        <div className="number-input">
          <button
            type="button"
            className="btn btn-clean"
            onClick={() =>
              updateSet(
                i,
                j,
                'reps',
                Math.max(0, (set.reps || 0) - 1),
              )
            }
          >
            −
          </button>

          <input
            className="input-base"
            type="number"
            value={set.reps ?? ''}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              updateSet(
                i,
                j,
                'reps',
                e.target.value === ''
                  ? ''
                  : Number(e.target.value),
              )
            }
          />

          <button
            type="button"
            className="btn btn-clean"
            onClick={() =>
              updateSet(
                i,
                j,
                'reps',
                (set.reps || 0) + 1,
              )
            }
          >
            +
          </button>
        </div>
      ) : isEditable ? (
        <input
          className="input-base"
          type="number"
          value={set.reps ?? ''}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            updateSet(
              i,
              j,
              'reps',
              e.target.value === ''
                ? ''
                : Number(e.target.value),
            )
          }
        />
      ) : (
        <span>{set.reps ?? '-'}</span>
      )}

      {isWorkoutMode && (
        <span className="set-pb">
          {isHistoricalPB && (
            <Trophy className="icon-small" />
          )}
        </span>
      )}

      {/* CHECKBOX */}

      {isRunMode && isEditable && (
        <input
          type="checkbox"
          className="checkbox"
          checked={set.completed}
          onChange={(e) =>
            toggleSetComplete(i, j, e.target.checked)
          }
        />
      )}
    </div>
  )
}
