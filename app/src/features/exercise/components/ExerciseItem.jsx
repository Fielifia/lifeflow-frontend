import { Clock, Trash2, Trophy, Weight } from 'lucide-react'
import { useRef, useState } from 'react'

/**
 * Exercise item in workout.
 * @param {object} props - Component props
 * @param {{ id: string, name: string, image?: string, sets: Array }} props.ex - Exercise data
 * @param {number} props.i - Exercise index
 * @param {(path: string) => void} props.navigate - Navigation function
 * @param {(i: number) => void} props.addSet - Adds a new set
 * @param {(i: number, j: number, field: string, value: number | '') => void} props.updateSet - Updates set values
 * @param {(i: number) => void} props.removeExercise - Removes exercise
 * @param {(i: number, j: number) => void} props.removeSet - Removes a set
 * @param {(i: number, j: number, checked: boolean) => void} props.toggleSetComplete - Toggles set completion
 * @param {(index: number, notes: string) => void} props.updateExerciseNotes - Updates exercise notes
 * @param props.showCheckbox - Whether to show completion checkbox (default: true)
 * @description
 * Displays an exercise with its sets, allowing users to:
 * - View exercise details (name, image)
 * - Add, update, and remove sets (weight and reps)
 * - Mark sets as completed
 * - Set rest time for the exercise
 *
 * Integrates with workout logic to manage state and navigation:
 * - Navigates to Exercise Library for selecting exercises
 * - Updates workout state with exercises and sets
 * @returns {import('react').ReactElement} Exercise item UI
 */
export default function ExerciseItem({
  ex,
  i,
  navigate,
  actions,
  mode = 'run',
  isEditable = true,
}) {
  const inputRefs = useRef([])

  const isRunMode = mode === 'run'
  // const isEditMode = mode === 'edit'
  // const isTemplateMode = mode === 'template'

  const {
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateExerciseNotes,
    updateExerciseRest,
  } = actions || {}

  const gridClass = {
    run: 'set-grid-run',
    edit: 'set-grid-edit',
    template: 'set-grid-template',
  }[mode]

  const handleCheck = (j, checked) => {
    toggleSetComplete(i, j, checked)
  }

  const [holdingSet, setHoldingSet] = useState(null)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  const HOLD_DURATION = 1000

  const startHold = (j, e) => {
    if (['INPUT', 'BUTTON'].includes(e.target.tagName)) return
    setHoldingSet(j)
    setProgress(0)

    const start = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / HOLD_DURATION, 1)

      setProgress(p)

      if (p === 1) {
        clearInterval(timerRef.current)
        removeSet(i, j)
        resetHold()
      }
    }, 16)
  }

  const cancelHold = () => {
    clearInterval(timerRef.current)
    resetHold()
  }

  const resetHold = () => {
    setHoldingSet(null)
    setProgress(0)
  }

  const addExerciseNotes = (notes) => {
    updateExerciseNotes(i, notes)
  }

  const [editingRest, setEditingRest] = useState(false)
  const safeRest = ex.restTime ?? 120

  const historicalBest = ex.historicalBest || {
    weight: 0,
    reps: 0,
  }

  let currentBest = { ...historicalBest }

  return (
    <div className={`workout-exercise ${mode}`}>
      {' '}
      {/* HEADER */}
      <div className="exercise-item-header">
        <div className="exercise-item-title clickable">
          <img
            src={ex.image || ex.images?.[0] || '/placeholder.png'}
            alt=""
            className="exercise-img-small"
            onClick={() => {
              navigate(`/exercises/${ex.exerciseId || ex.id}`, {
                state: {
                  from: window.location.pathname,
                },
              })
            }}
          />

          <h2>{ex.name}</h2>
        </div>

        <div className="exercise-item-header controls">
          {/* REST TIME */}
          <div
            className={`rest-label clickable ${!isEditable ? 'is-static' : ''}`}
            onClick={(e) => {
              if (!isEditable) return

              e.stopPropagation()
              setEditingRest(true)
            }}
          >
            <Clock className="icon-small" />

            {editingRest && isEditable ? (
              <input
                className="input-clean"
                type="number"
                autoFocus
                value={safeRest}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => {
                  const val = Number(e.target.value)
                  if (!isNaN(val)) updateExerciseRest(i, val)
                  setEditingRest(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur()
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  if (!isNaN(val)) updateExerciseRest(i, val)
                }}
              />
            ) : (
              <span className="rest-badge">
                {safeRest >= 60
                  ? safeRest % 60 === 0
                    ? `${safeRest / 60} min`
                    : `${Math.floor(safeRest / 60)}m ${safeRest % 60}s`
                  : `${safeRest}s`}
              </span>
            )}
          </div>

          {isEditable && (
            <button
              className="btn btn-secondary btn-small"
              onClick={(e) => {
                e.stopPropagation()
                removeExercise(i)
              }}
            >
              <Trash2 className="icon-small-trash" />
            </button>
          )}
        </div>
      </div>
      {isEditable ? (
        <form className="exercise-notes" onSubmit={(e) => e.preventDefault()}>
          <input
            className="input-base input-exercise-notes"
            type="text"
            placeholder="Exercise Notes..."
            value={ex.notes || ''}
            onChange={(e) => addExerciseNotes(e.target.value)}
          />
        </form>
      ) : (
        ex.notes && (
          <p className="muted small exercise-notes-static">{ex.notes}</p>
        )
      )}
      {/* SET HEADER */}
      <div className={`set-header ${gridClass}`}>
        <span>Set</span>

        {isRunMode && <span>Previous</span>}

        <span>
          <Weight className="icon-small" />
          kg
        </span>

        <div className="reps-grid">
          <span></span>
          <span>Reps</span>
          <span></span>
        </div>

        {isRunMode && isEditable && <span>✔</span>}
      </div>
      {/* SETS */}
      {ex.sets.map((set, j) => {
        const isHistoricalPB =
          isRunMode &&
          set.completed &&
          (set.weight > currentBest.weight ||
            (set.weight === currentBest.weight && set.reps > currentBest.reps))

        if (isHistoricalPB) {
          currentBest = {
            weight: set.weight,
            reps: set.reps,
          }
        }

        return (
          <div
            key={j}
            onMouseDown={isEditable ? (e) => startHold(j, e) : undefined}
            onMouseUp={isEditable ? cancelHold : undefined}
            onMouseLeave={isEditable ? cancelHold : undefined}
            onTouchStart={isEditable ? (e) => startHold(j, e) : undefined}
            onTouchEnd={isEditable ? cancelHold : undefined}
            className={`set-row ${gridClass}
            ${set.completed ? 'completed' : ''} 
            ${isHistoricalPB ? 'best-set' : ''}
          `}
          >
            {holdingSet === j && (
              <div className="hold-indicator">
                <div
                  className="hold-progress"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            )}
            <span className={`set-number ${isHistoricalPB ? 'pb' : ''}`}>
              {isHistoricalPB ? <Trophy className="icon-small" /> : j + 1}
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
                    e.target.value === '' ? '' : Number(e.target.value),
                  )
                }
              />
            ) : (
              <span>{set.weight ?? '-'}</span>
            )}

            {/* REPS */}
            {isEditable ? (
              <div className="number-input">
                <button
                  className="btn btn-clean"
                  onClick={() =>
                    updateSet(i, j, 'reps', Math.max(0, (set.reps || 0) - 1))
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
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                />

                <button
                  className="btn btn-clean"
                  onClick={() => updateSet(i, j, 'reps', (set.reps || 0) + 1)}
                >
                  +
                </button>
              </div>
            ) : (
              <span>{set.reps ?? '-'}</span>
            )}

            {/* CHECKBOX */}
            {isRunMode && isEditable && (
              <input
                type="checkbox"
                className="checkbox"
                checked={set.completed}
                onChange={(e) => handleCheck(j, e.target.checked)}
              />
            )}
          </div>
        )
      })}
      {/* ADD SET */}
      {isEditable && (
        <button
          className="btn btn-standard btn-secondary btn-full"
          onClick={() => addSet(i)}
        >
          Add set
        </button>
      )}
    </div>
  )
}
