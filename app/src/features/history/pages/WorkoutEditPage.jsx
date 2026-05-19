import {
  useNavigate,
  useParams
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/BackButton'
import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'
import WorkoutControls from '../../../shared/components/WorkoutControls'

import WorkoutHeader from '../../workout/components/WorkoutHeader'

import ExerciseItem from '../../exercise/components/ExerciseItem'

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

    hasUnsavedChanges,

    saveWorkout,

    saveAsTemplate,

    discardChanges,
  } = useWorkoutManager(id, navigate)

  // ===== LOADING / ERROR / EMPTY =====

  if (loading || error || !workout) {
    return (
      <div className="app">
        <Header title="Workout" />
        <BackButton fallback="/workouts" />

        <DataState
          loading={loading}
          error={error}
          data={workout ? [workout] : []}
          variant="card-workout"
          emptyText="No workout found"
          count={1}
        />
      </div>
    )
  }

  return (
    <div className="app">

      {/* HEADER */}

      <Header title={workout.name} subtitle="Edit workout" />

      {/* BACK BUTTON */}

      <BackButton
        fallback={returnTo || '/history'}
        warnOnUnsavedChanges
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={discardChanges}
      />

      {/* WORKOUT HEADER */}
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

      {/* FEEDBACK */}

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

      {workout.exercises.length > 0 && (
        <textarea
          className="input-base textarea"
          value={workout.notes}
          placeholder="Workout Notes..."
          onChange={(e) => updateWorkoutNotes(e.target.value)}
        />
      )}

    </div>
  )
}
