import { useNavigate, useLocation } from 'react-router-dom'

import { useWorkoutLogic } from '../hooks/useWorkoutLogic'
import { workoutToTemplate } from '../../template/utils/templateAdapter'
import { createTemplate } from '../../../shared/api/templateApi'

import WorkoutHeader from '../components/WorkoutHeader'
import WorkoutControls from '../components/WorkoutControls'
import RestTimer from '../components/RestTimer'
import ExerciseItem from '../components/ExerciseItem'
import BackButton from '../../../shared/ui/BackButton'

/**
 * Workout page for creating and tracking a workout session.
 *
 * Handles rendering only. All logic is managed in useWorkoutLogic.
 * @returns {import('react').ReactElement} Workout page UI
 */
export default function WorkoutRunPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    workout,
    saving,
    success,
    error,
    setWorkout,

    status,
    elapsed,

    restRemaining,
    isResting,
    skipRest,

    isEditingName,
    setIsEditingName,

    handleStartPause,
    adjustRest,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateExerciseRest,
    updateWorkoutNotes,

    saveWorkout,
  } = useWorkoutLogic(navigate, location)

  const handleSaveTemplate = async () => {
    try {
      const template = workoutToTemplate(workout)
      await createTemplate(template)
      alert('Template saved!')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/workout" />
      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        elapsed={elapsed}
      />

      {/* TOP CONTROLS */}
      <WorkoutControls
        status={status}
        handleStartPause={handleStartPause}
        saveWorkout={saveWorkout}
        onSaveTemplate={handleSaveTemplate}
        saving={saving}
        hasExercises={workout.exercises.length > 0}
      />

      {/* REST TIMER */}
      <RestTimer
        isResting={isResting}
        restRemaining={restRemaining}
        adjustRest={adjustRest}
        skipRest={skipRest}
      />

      {/* ADD EXERCISE */}
      <button className="btn btn-secondary btn-full" onClick={openLibrary}>
        Add exercise
      </button>

      {/* EXERCISES */}
      {workout.exercises.map((ex, i) => (
        <ExerciseItem
          showCheckbox
          key={ex.exerciseId}
          ex={ex}
          i={i}
          navigate={navigate}
          addSet={addSet}
          updateSet={updateSet}
          removeExercise={removeExercise}
          removeSet={removeSet}
          toggleSetComplete={toggleSetComplete}
          restTime={ex.restTime}
          onChangeRestTime={(value) => updateExerciseRest(i, value)}
        />
      ))}

      {/* NOTES */}
      <textarea
        className="input-base textarea"
        value={workout.notes}
        placeholder="Notes..."
        onChange={(e) => updateWorkoutNotes(e.target.value)}
      />

      {/* BOTTOM CONTROLS */}
      {workout.exercises.length > 0 && (
        <WorkoutControls
          status={status}
          handleStartPause={handleStartPause}
          saveWorkout={saveWorkout}
          onSaveTemplate={handleSaveTemplate}
          saving={saving}
          hasExercises={workout.exercises.length > 0}
        />
      )}

      {/* FEEDBACK */}
      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
