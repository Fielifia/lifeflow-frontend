import { useNavigate, useParams } from 'react-router-dom'
import { useEditWorkoutLogic } from '../hooks/useEditWorkoutLogic'

import BackButton from '../../../shared/ui/BackButton'
import ExerciseItem from '../../workout/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

export default function WorkoutEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    workout,
    loading,
    saving,
    error,

    setWorkout,

    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateExerciseRest,
    updateExerciseNotes,
    updateWorkoutNotes,
    updateWorkoutName,

    saveWorkout,
  } = useEditWorkoutLogic(id, navigate)

  if (loading) return <p>Loading...</p>
  if (!workout) return <p>Workout not found</p>

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/workouts/history" />

      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        isEditing={true}
        setIsEditing={() => { }}
        onChangeName={updateWorkoutName}

        mode="edit"
        duration={workout.duration}
        onChangeDuration={(value) =>
          setWorkout((prev) => ({ ...prev, duration: value }))
        }
      />

      {/* SAVE */}
      <button
        className="btn btn-standard btn-primary btn-full"
        onClick={saveWorkout}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save changes'}
      </button>

      {error && <p className="error center">{error}</p>}

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
          updateExerciseNotes={updateExerciseNotes}
          restTime={ex.restTime}
          onChangeRestTime={(value) => updateExerciseRest(i, value)}
        />
      ))}

      {/* NOTES */}
      <textarea
        className="input-base textarea"
        value={workout.notes}
        placeholder="Workout Notes..."
        onChange={(e) => updateWorkoutNotes(e.target.value)}
      />
    </div>
  )
}
