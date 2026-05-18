import { useNavigate, useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/BackButton'
import Header from '../../../shared/components/ui/Header'

import ExerciseItem from '../../exercise/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

import WorkoutControls from '../../../shared/components/WorkoutControls'
/**
 * Page for editing a completed workout.
 * @returns {import('react').ReactElement} Workout edit page UI
 */
export default function WorkoutEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { returnTo } = useExerciseFlow()

  const {
    workout,
    setWorkout,

    loading,
    saving,
    success,
    error,

    isEditingName,
    setIsEditingName,

    exerciseActions,

    startTime,
    adjustStartTime,
    openLibrary,

    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,
    discardChanges,
  } = useWorkoutManager(id, navigate)

  if (loading) return <p className="center">Loading...</p>
  if (!workout) return <p className="center">Workout not found</p>

  return (
    <div className="app">
      <Header title={workout.name} subtitle="Edit workout" />
      <BackButton fallback={returnTo || '/history'} />

      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        mode="edit"
        startTime={startTime}
        adjustStartTime={adjustStartTime}
        duration={workout.duration}
        onChangeDuration={(value) =>
          setWorkout((prev) => ({ ...prev, duration: value }))
        }
      />

      {/* CONTROLS */}
      <WorkoutControls
        variant="editor"
        saving={saving}
        onSave={saveWorkout}
        onSecondaryAction={saveAsTemplate}
        secondaryActionLabel="Save as template"
        onDiscardChanges={discardChanges}
        saveLabel="Save workout"
        discardLabel="Cancel"
        hasExercises={workout.exercises.length > 0}
      />

      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* ADD EXERCISE */}
      <button
        className="btn btn-standard btn-secondary btn-full"
        onClick={openLibrary}
      >
        Add exercise
      </button>

      {/* EXERCISES */}
      {workout.exercises.map((ex, i) => (
        <ExerciseItem
          key={ex.id}
          ex={ex}
          i={i}
          navigate={navigate}
          actions={exerciseActions}
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
