import { useRef } from 'react'
import { Timer } from 'lucide-react'

/**
 * Exercise item in workout.
 * @param {object} props - Component props
 * @param {{ exerciseId: string, name: string, image?: string, sets: Array }} props.ex - Exercise data
 * @param {number} props.i - Exercise index
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

  const handleCheck = (j, checked) => {
    toggleSetComplete(i, j, checked)

    if (checked && status === 'idle') {
      handleStartPause()
    }
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

      <span>Notes:</span>
      <form className="exercise-notes" onSubmit={(e) => e.preventDefault()}>
        <input
          className="input-base input-exercise-notes"
          type="text"
          placeholder="Notes..."
          value={ex.notes || ''}
          onChange={(e) => addExerciseNotes(e.target.value)}
        />
      </form>

      {/* SET HEADER */}
      <div className="set-header">
        <span>Set</span>
        <span>Weight (kg)</span>
        <span>Reps</span>
      </div>

      {/* SETS */}
      {ex.sets.map((set, j) => (
        <div key={j} className={`set-row ${set.completed ? 'completed' : ''}`}>
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
              onClick={() =>
                updateSet(i, j, 'reps', Math.max(0, (set.reps || 0) - 1))
              }
            >
              -
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
              onClick={() => updateSet(i, j, 'reps', (set.reps || 0) + 1)}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-secondary btn-small"
            onClick={() => removeSet(i, j)}
          >
            Delete
          </button>
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
        <Timer className="icon-small" /> Set Rest Timer: {restTime ?? 60}s
      </div>
    </div>
  )
}
