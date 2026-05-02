import { useRef } from 'react'
import { useState } from 'react'
import { Timer, Weight, Trophy } from 'lucide-react'

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
  status,
  handleStartPause,
  updateExerciseNotes,
  showCheckbox = true,
}) {
  const inputRefs = useRef([])

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

    if (checked && status === 'idle') {
      handleStartPause()
    }
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

  return (
    <div className="workout-exercise">
      {/* HEADER */}
      <div className="exercise-header-main">
        <img
          src={ex.image || ex.images?.[0] || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
          onClick={() => navigate(`/exercise/${ex.exerciseId}`)}
        />

        <h2>{ex.name}</h2>

        <button
          className="btn btn-secondary btn-small btn-right"
          onClick={(e) => {
            e.stopPropagation()
            removeExercise(i)
          }}
        >
          Remove
        </button>
      </div>

      <form className="exercise-notes" onSubmit={(e) => e.preventDefault()}>
        <input
          className="input-base input-exercise-notes"
          type="text"
          placeholder="Exercise Notes..."
          value={ex.notes || ''}
          onChange={(e) => addExerciseNotes(e.target.value)}
        />
      </form>

      {/* SET HEADER */}
      <div className="set-header">
        <span>Set</span>
        <span>Previous</span>
        <span>
          <Weight className="icon-small" />
          kg
        </span>
        <span>Reps</span>
        <span>✔</span>
      </div>

      {/* SETS */}
      {ex.sets.map((set, j) => (
        <div
          key={j}
          onMouseDown={(e) => startHold(j, e)}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={(e) => startHold(j, e)}
          onTouchEnd={cancelHold}
          className={`set-row 
  ${set.completed ? 'completed' : ''} 
  ${set.bestIndex ? 'best-set' : ''}
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
          <span className={`set-number ${j === bestIndex ? 'pb' : ''}`}>
            {j === bestIndex ? <Trophy className="icon-small" /> : j + 1}
          </span>

          <span className="previous muted">
            {set.prevWeight && set.prevReps
              ? `${set.prevWeight}×${set.prevReps}`
              : '–'}
          </span>

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
              onClick={() => updateSet(i, j, 'reps', (set.reps || 0) + 1)}
            >
              +
            </button>
          </div>

          {showCheckbox ? (
            <input
              type="checkbox"
              className="checkbox"
              checked={set.completed}
              onChange={(e) => handleCheck(j, e.target.checked)}
            />
          ) : (
            <span className="set-number">{j + 1}</span>
          )}
        </div>
      ))}

      {/* ADD SET */}
      <button className="btn btn-secondary btn-full" onClick={() => addSet(i)}>
        Add set
      </button>

      {/* REST TIME */}
      <div
        className="rest-label"
        onClick={(e) => {
          e.stopPropagation()
          const val = prompt('Rest time (seconds)', restTime)
          if (val !== null && !isNaN(val)) {
            onChangeRestTime(Number(val))
          }
        }}
      >
        <Timer className="icon-small muted" /> Rest Timer: {restTime ?? 60}s
      </div>
    </div>
  )
}
