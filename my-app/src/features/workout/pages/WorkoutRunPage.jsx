import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useWorkoutLogic } from '../hooks/useWorkoutLogic'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import BackButton from '../../../shared/ui/BackButton'
import ExerciseItem from '../components/ExerciseItem'
import RestTimer from '../components/RestTimer'
import WorkoutControls from '../components/WorkoutControls'
import WorkoutHeader from '../components/WorkoutHeader'

/**
 * Workout page for creating and tracking a workout session.
 *
 * Handles rendering only. All logic is managed in useWorkoutLogic.
 * @returns {import('react').ReactElement} Workout page UI
 */
export default function WorkoutRunPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: workoutId } = useParams()
  const [flash, setFlash] = useState(false)

  const {
    workout,
    saving,
    success,
    error,
    setWorkout,
    pbs,

    status,
    elapsed,

    isEditingName,
    setIsEditingName,

    startTime,
    adjustStartTime,

    handleStartPause,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateExerciseRest,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,
  } = useWorkoutLogic(navigate, location, workoutId)

  const {
    restRemaining,
    isResting,
    adjustRest,
    skipRest,
  } = useWorkoutContext()

  return (
    <div className={`card-base card-workout ${flash ? 'flash' : ''}`}>
      <BackButton fallback="/workouts" />
      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        elapsed={elapsed}
        status={status}
        startTime={startTime}
        adjustStartTime={adjustStartTime}
      />

      {/* TOP CONTROLS */}
      <WorkoutControls
        name={workout.name}
        status={status}
        elapsed={elapsed}
        handleStartPause={handleStartPause}
        saveWorkout={saveWorkout}
        onSaveTemplate={saveAsTemplate}
        saving={saving}
        hasExercises={workout.exercises.length > 0}
      />
      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}


      {/* REST TIMER */
      }
      <RestTimer
        isResting={isResting}
        restRemaining={restRemaining}
        adjustRest={adjustRest}
        skipRest={skipRest}
        setFlash={setFlash}
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
          pb={pbs?.[String(ex.exerciseId)]}
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
    </div>
  )
}
