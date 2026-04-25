import { useRef } from 'react'
import { Timer } from 'lucide-react'

/**
 * Exercise item in workout.
 * @param {object} props - Component props
 * @param {{ exerciseId: string, name: string, image?: string, sets: Array }} props.ex - Exercise data
 * @param {number} props.i - Exercise index
 * @param {(path: string) => void} props.navigate - Navigate to detail
 * @param {(i: number) => void} props.addSet - Add new set
 * @param {(i: number, j: number, field: string, value: number | '') => void} props.updateSet - Update set values
 * @param {(i: number) => void} props.removeExercise - Remove exercise
 * @param {(i: number, j: number) => void} props.removeSet - Remove set
 * @param {(i: number, j: number, checked: boolean) => void} props.toggleSetComplete - Toggle set completion
 * @param {number} props.restTime - Current rest time
 * @param {(value: number) => void} props.setRestTime - Update rest time
 * @param {string} props.status - Workout status (idle/running/paused)
 * @param {() => void} props.handleStartPause - Start or pause workout
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
  setRestTime,
  status,
  handleStartPause,
}) {
  const inputRefs = useRef([])

  const handleCheck = (j, checked) => {
    toggleSetComplete(i, j, checked)

    if (checked && status === 'idle') {
      handleStartPause()
    }
  }

  return (
    <div className="workout-exercise">
      {/* HEADER */}
      <div className="exercise-header-main">
        <img
          src={ex.image || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
          onClick={() => navigate(`/exercise/${ex.exerciseId}`)}
        />

        <h2>{ex.name}</h2>

        <button
          className="btn btn-secondary btn-small"
          onClick={(e) => {
            e.stopPropagation()
            removeExercise(i)
          }}
        >
          Remove
        </button>
      </div>

      {/* SET HEADER */}
      <div className="set-header">
        <span>Set</span>
        <span>Weight (kg)</span>
        <span>Reps</span>
      </div>

      {/* SETS */}
      {ex.sets.map((set, j) => (
        <div key={j} className={`set-row ${set.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            className="checkbox"
            checked={set.completed}
            onChange={(e) => handleCheck(j, e.target.checked)}
          />

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
      <button
        className="btn btn-secondary btn-small-full"
        onClick={() => addSet(i)}
      >
        Add set
      </button>

      {/* REST TIME */}
      <div
        className="rest-label"
        onClick={(e) => {
          e.stopPropagation()
          const val = prompt('Rest time (seconds)', restTime)
          if (val !== null && !isNaN(val)) {
            setRestTime(Number(val))
          }
        }}
      >
        <Timer className="icon-small"/> Set Rest Timer: {restTime}s
      </div>
    </div>
  )
}
