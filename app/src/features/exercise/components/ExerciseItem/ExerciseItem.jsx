import { Clock, Trash2, Weight } from 'lucide-react'

import { useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { formatRestTime } from '../../../../shared/utils/format'

import ExerciseSetRow from '../ExerciseSetRow'

import './ExerciseItem.css'

/**
 * Displays an editable exercise item with sets, notes, rest timer, and personal best tracking.
 * @param {object} props - Component props.
 * @param {{
 *   id: string,
 *   exerciseId?: string,
 *   name: string,
 *   image?: string,
 *   images?: Array<string>,
 *   notes?: string,
 *   restTime?: number,
 *   historicalBest?: {
 *     weight: number,
 *     reps: number
 *   },
 *   sets: Array<object>
 * }} props.ex - Exercise data.
 * @param {number} props.i - Exercise index.
 * @param {(path: string, options?: object) => void} props.navigate - Navigation function.
 * @param {object} props.actions - Exercise action handlers.
 * @param {'run' | 'workout' | 'edit' | 'template'} [props.mode] - Exercise item mode.
 * @param {boolean} [props.isEditable] - Whether the exercise can be edited.
 * @returns {import('react').ReactElement} Exercise item UI.
 */
export default function ExerciseItem({
  ex,
  i,
  navigate,
  actions,
  mode = 'run',
  isEditable = true,
}) {
  const location = useLocation()
  const inputRefs = useRef([])
  const currentRoute = `${location.pathname}${location.search}`

  const isRunMode = mode === 'run'
  const isWorkoutMode = mode === 'workout'

  const {
    addSet,
    updateSet,
    removeSet,
    toggleSetComplete,
    removeExercise,
    updateExerciseNotes,
    updateExerciseRest,
  } = actions || {}

  const setActions = {
    updateSet,
    removeSet,
    toggleSetComplete,
  }

  const gridClass = {
    run: 'set-grid-run',
    workout: 'set-grid-workout',
    edit: 'set-grid-edit',
    template: 'set-grid-template',
  }[mode]

  const addExerciseNotes = (notes) => {
    updateExerciseNotes(i, notes)
  }

  const [editingRest, setEditingRest] = useState(false)

  const safeRest = ex.restTime ?? 120

  const historicalBest = ex.historicalBest || {
    weight: 0,
    reps: 0,
  }

  const bests = ex.sets.reduce((acc, currentSet, index) => {
    const previousBest = acc[index - 1] || historicalBest

    const isPB =
      currentSet.completed &&
      (currentSet.weight > previousBest.weight ||
        (currentSet.weight === previousBest.weight &&
          currentSet.reps > previousBest.reps))

    acc[index] = isPB
      ? {
        weight: currentSet.weight,
        reps: currentSet.reps,
      }
      : previousBest

    return acc
  }, [])

  return (
    <div className={`workout-exercise ${mode}`}>
      {/* EXERCISE ITEM HEADER */}

      <div className="exercise-item-header">
        <div className="exercise-item-title clickable">
          <img
            src={ex.image || ex.images?.[0] || '/placeholder.png'}
            alt=""
            className="exercise-img-small"
            onClick={() => {
              const params = new URLSearchParams(location.search)

              params.set('from', currentRoute)

              navigate(`/exercises/${ex.exerciseId}?${params.toString()}`)
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
            {editingRest && isEditable ? (
              <input
                className="input-clean"
                type="number"
                autoFocus
                value={safeRest}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => {
                  const val = Number(e.target.value)

                  if (!isNaN(val)) {
                    updateExerciseRest(i, val)
                  }

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

                  if (!isNaN(val)) {
                    updateExerciseRest(i, val)
                  }
                }}
              />
            ) : (
              <span className="rest-badge">{formatRestTime(safeRest)}</span>
            )}
            <Clock className="icon-small" />
          </div>

          {/* REMOVE EXERCISE */}

          {isEditable && (
            <button
              className="btn btn-secondary btn-sm"
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

      {/* EXERCISE NOTES */}

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
        <span className="set-header-cell">Set</span>

        {isRunMode && <span className="set-header-cell">Previous</span>}

        <span className="set-header-cell">
          <Weight className="icon-small" />
          kg
        </span>

        <span className="set-header-cell">Reps</span>

        {isRunMode && isEditable && <span className="set-header-cell">✔</span>}

        {isWorkoutMode && <span className="set-header-cell">Pb</span>}
      </div>

      {/* SETS */}

      {ex.sets.map((set, j) => {
        const previousBest = j === 0 ? historicalBest : bests[j - 1]

        const isHistoricalPB =
          (isRunMode || isWorkoutMode) &&
          set.completed &&
          (set.weight > previousBest.weight ||
            (set.weight === previousBest.weight &&
              set.reps > previousBest.reps))

        return (
          <ExerciseSetRow
            key={j}
            set={set}
            i={i}
            j={j}
            actions={setActions}
            isEditable={isEditable}
            isRunMode={isRunMode}
            isWorkoutMode={isWorkoutMode}
            isHistoricalPB={isHistoricalPB}
            gridClass={gridClass}
            inputRefs={inputRefs}
          />
        )
      })}

      {/* ADD SET */}

      {isEditable && (
        <button
          className="btn btn-md btn-secondary btn-full"
          onClick={() => addSet(i)}
        >
          Add set
        </button>
      )}
    </div>
  )
}
