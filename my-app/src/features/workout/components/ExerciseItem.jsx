import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Clock, Weight, Trash2, Trophy } from 'lucide-react'

/**
 * Exercise item in workout.
 * @param {object} props - Component props
 * @param {{ exerciseId: string, name: string, image?: string, sets: Array }} props.ex - Exercise data
 * @param {number} props.i - Exercise index
 * @param props.pb - Personal best
 * @param {(path: string) => void} props.navigate - Navigation function
 * @param {(i: number) => void} props.addSet - Adds a new set
 * @param {(i: number, j: number, field: string, value: number | '') => void} props.updateSet - Updates set values
 * @param {(i: number) => void} props.removeExercise - Removes exercise
 * @param {(i: number, j: number) => void} props.removeSet - Removes a set
 * @param {(i: number, j: number, checked: boolean) => void} props.toggleSetComplete - Toggles set completion
 * @param {number} props.restTime - Rest time in seconds
 * @param {(value: number) => void} props.onChangeRestTime - Updates rest time
 * @param {'idle' | 'running' | 'paused'} props.status - Workout status
 * @param {() => void} props.handleStartPause - Starts or pauses workout
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
  pb,
  navigate,
  addSet,
  updateSet,
  removeExercise,
  removeSet,
  toggleSetComplete,
  restTime,
  onChangeRestTime,
  updateExerciseNotes,
  showCheckbox = true,
  isEditable = true,
}) {
  const inputRefs = useRef([])

  const gridClass =
    showCheckbox && isEditable
      ? 'set-grid-with-checkbox'
      : 'set-grid-no-checkbox'

  const getBestSetIndex = () => {
    if (!pb?.bestSet) return -1

    return ex.sets.findIndex(
      (s) =>
        Number(s.weight) === pb.bestSet.weight &&
        Number(s.reps) === pb.bestSet.reps,
    )
  }

  const bestIndex = getBestSetIndex()

  const handleCheck = (j, checked) => {
    toggleSetComplete(i, j, checked)
  }

  const [holdingSet, setHoldingSet] = useState(null)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  const HOLD_DURATION = 600

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

  {/* REST TIME */ }
  const [editingRest, setEditingRest] = useState(false)
  const safeRest = restTime ?? 120

  const location = useLocation()

  return (
    <div className="workout-exercise">
      {/* HEADER */}
      <div className="exercise-header-main">
        <img
          src={ex.image || ex.images?.[0] || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
          onClick={() => navigate(`/exercises/${ex.exerciseId}`, {
            state: {
              returnTo: location.pathname,
              mode: 'workout',
            },
          })
          }
        />

        <h2>{ex.name}</h2>

        <div className="exercise-header-main controls">
          {/* REST TIME */}
          <div
            className="rest-label"
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
                onBlur={(e) => {
                  const val = Number(e.target.value)
                  if (!isNaN(val)) onChangeRestTime(val)
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
                  if (!isNaN(val)) onChangeRestTime(val)
                }}
              />
            ) : (
              <span className="rest-badge">
                {restTime >= 60
                  ? `${Math.floor(restTime / 60)} min`
                  : `${safeRest}s`}
              </span>
            )}
          </div>

          {isEditable && (
            <button
              className="btn-secondary btn-small"
              onClick={(e) => {
                e.stopPropagation()
                removeExercise(i)
              }}
            >
              <Trash2 />
            </button>
          )}
        </div>
      </div>

      {isEditable ? (
        <form
          className="exercise-notes"
          onSubmit={(e) => e.preventDefault()}
        >
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
          <p className="muted small exercise-notes-static">
            {ex.notes}
          </p>
        )
      )}

      {/* SET HEADER */}
      <div className={`set-header ${gridClass}`}>
        <span>Set</span>

        {isEditable && <span>Previous</span>}

        <span>
          <Weight className="icon-small" />
          kg
        </span>

        <div className="reps-grid">
          <span></span>
          <span>Reps</span>
          <span></span>
        </div>

        {showCheckbox && isEditable && <span>✔</span>}
      </div>

      {/* SETS */}
      {ex.sets.map((set, j) => (
        <div
          key={j}
          onMouseDown={isEditable ? (e) => startHold(j, e) : undefined}
          onMouseUp={isEditable ? cancelHold : undefined}
          onMouseLeave={isEditable ? cancelHold : undefined}
          onTouchStart={isEditable ? (e) => startHold(j, e) : undefined}
          onTouchEnd={isEditable ? cancelHold : undefined}
          className={`set-row
            ${set.completed ? 'completed' : ''} 
            ${(set.personalBest || j === bestIndex) ? 'best-set' : ''}
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
          <span
            className={`set-number ${set.personalBest || j === bestIndex ? 'pb' : ''
            }`}
          >
            {set.personalBest || j === bestIndex
              ? <Trophy className="icon-small" />
              : j + 1}
          </span>

          {/* PREVIOUS */}
          {isEditable && (
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
                className="btn-clean"
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
                className="btn-clean"
                onClick={() =>
                  updateSet(i, j, 'reps', (set.reps || 0) + 1)
                }
              >
                +
              </button>
            </div>
          ) : (
            <span>{set.reps ?? '-'}</span>
          )}

          {/* CHECKBOX */}
          {showCheckbox && isEditable && (
            <input
              type="checkbox"
              className="checkbox"
              checked={set.completed}
              onChange={(e) => handleCheck(j, e.target.checked)}
            />
          )}
        </div>
      ))}

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
