import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkoutEditor } from './hooks/useWorkoutEditor'
import { useWorkoutLogic } from './hooks/useWorkoutLogic'

import BackButton from '../../components/ui/BackButton'
import RestTimer from './components/RestTimer'
import ExerciseItem from './components/editor/ExerciseItem'
import WorkoutHeader from './components/editor/WorkoutHeader'
import WorkoutControls from './components/editor/WorkoutControls'

/**
 *
 * @param root0
 * @param root0.mode
 * @param root0.onSaveTemplate
 */
export default function WorkoutEditor({ mode = 'workout', onSaveTemplate }) {
  const navigate = useNavigate()
  const location = useLocation()

  const initialWorkout = location.state?.workout ?? {
    name: '',
    exercises: [],
    notes: '',
  }

  const {
    workout,
    setWorkout,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    updateName,
    updateNotes,
  } = useWorkoutEditor(initialWorkout)

  const logic = useWorkoutLogic({
    workout,
    setWorkout,
    navigate,
    location,
  })

  const {
    saving,
    success,
    error,
    status,
    elapsed,
    restTime,
    setRestTime,
    restRemaining,
    isResting,
    skipRest,
    handleStartPause,
    adjustRest,
    openLibrary,
    saveWorkout,
  } = logic

  const isWorkout = mode === 'workout'
  const title = workout.name || 'Workout'

  const handleSaveTemplate = async () => {
    if (!onSaveTemplate) return
    await onSaveTemplate(workout)
  }

  const handleSaveAndStart = async () => {
    if (!onSaveTemplate) return
    await onSaveTemplate(workout)

    navigate('/workout/run', {
      state: { workout },
    })
  }

  useEffect(() => {
    const selected = location.state?.selectedExercises
    if (!selected || selected.length === 0) return

    const lastWorkout = JSON.parse(localStorage.getItem('lastWorkout'))

    setWorkout((prev) => {
      const existingIds = prev.exercises.map((e) => e.exerciseId)

      const newExercises = selected
        .filter((ex) => !existingIds.includes(ex.id))
        .map((ex) => {
          const previous = lastWorkout?.exercises?.find(
            (e) => e.exerciseId === ex.id,
          )

          return {
            exerciseId: ex.id,
            name: ex.name,
            image: ex.image,
            sets: previous
              ? previous.sets.map((s) => ({
                reps: s.reps,
                weight: s.weight,
              }))
              : [
                { reps: 8, weight: 0 },
                { reps: 8, weight: 0 },
              ],
          }
        })

      return {
        ...prev,
        exercises: [...prev.exercises, ...newExercises],
      }
    })

    navigate(location.pathname, { replace: true })
  }, [location.state])

  return (
    <div className="card-base card-workout">
      <BackButton />

      <WorkoutHeader
        title={title}
        onChangeName={updateName}
        elapsed={isWorkout ? elapsed : null}
      />

      {isWorkout && (
        <WorkoutControls
          status={status}
          handleStartPause={handleStartPause}
          saveWorkout={saveWorkout}
          saving={saving}
          hasExercises={workout.exercises.length > 0}
        />
      )}

      {isWorkout && (
        <RestTimer
          isResting={isResting}
          restRemaining={restRemaining}
          adjustRest={adjustRest}
          skipRest={skipRest}
        />
      )}

      <button className="btn btn-secondary btn-full" onClick={openLibrary}>
        Add exercise
      </button>

      {workout.exercises.map((ex, i) => (
        <ExerciseItem
          key={ex.exerciseId || i}
          ex={ex}
          i={i}
          mode={mode}
          addSet={addSet}
          updateSet={updateSet}
          removeExercise={removeExercise}
          removeSet={removeSet}
          toggleSetComplete={isWorkout ? logic.toggleSetComplete : undefined}
          status={status}
          handleStartPause={handleStartPause}
          restTime={restTime}
          setRestTime={setRestTime}
        />
      ))}

      <textarea
        className="input-base textarea"
        value={workout.notes}
        placeholder="Notes..."
        onChange={(e) => updateNotes(e.target.value)}
      />

      {mode === 'template' && (
        <>
          <button
            className="btn btn-primary btn-full"
            onClick={handleSaveTemplate}
          >
            Save template
          </button>

          <button
            className="btn btn-secondary btn-full"
            onClick={handleSaveAndStart}
          >
            Save & start
          </button>
        </>
      )}

      {isWorkout && workout.exercises.length > 0 && (
        <WorkoutControls
          status={status}
          handleStartPause={handleStartPause}
          saveWorkout={saveWorkout}
          saving={saving}
          hasExercises
        />
      )}

      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
