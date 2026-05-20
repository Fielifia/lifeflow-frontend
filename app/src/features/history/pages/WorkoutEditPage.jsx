import { useState } from 'react'
import {
  useNavigate,
  useParams
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/BackButton'
import Header from '../../../shared/components/ui/Header'
import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem'

import WorkoutHeader from '../../workout/components/WorkoutHeader'
import EditStartTimeModal from '../../workout/components/time/EditStartTimeModal'


/**
 * Page for editing a completed workout.
 * @returns {import('react').ReactElement} Workout edit page UI
 */
export default function WorkoutEditPage() {
  const navigate = useNavigate()

  const { id } = useParams()

  const { returnTo } = useExerciseFlow()

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)

  const [tempStartTime, setTempStartTime] = useState('')

  const [restTimerEnabled, setRestTimerEnabled] = useState(true)
  const [defaultRestTime] = useState(120)

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

  const workoutMenuItems = [
    {
      label: 'Rename',
      onClick: () => setIsEditingName(true),
    },

    {
      label: 'Edit start time',
      onClick: () => {
        const current = new Date(startTime)

        const hours = String(current.getHours()).padStart(2, '0')

        const minutes = String(current.getMinutes()).padStart(2, '0')

        setTempStartTime(`${hours}:${minutes}`)

        setShowStartTimeModal(true)
      },
    },

    {
      divider: true,
    },

    {
      label: 'Rest timer',
      type: 'toggle',
      value: restTimerEnabled,
      onChange: setRestTimerEnabled,
      closeOnClick: false,
    },

    {
      label: 'Default rest time',
      subtitle: `${defaultRestTime}s`,
      onClick: () => console.log('default rest'),
    },

    {
      divider: true,
    },

    {
      label: 'Save as template',
      onClick: saveAsTemplate,
    },
  ]

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
        startTime={workout.startTime}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        mode="edit"
        duration={workout.duration}
        showDuration={true}
        menuItems={workoutMenuItems}
      />

      {/* START TIME MODAL */}

      {showStartTimeModal && (
        <EditStartTimeModal
          startTime={startTime}
          tempStartTime={tempStartTime}
          setTempStartTime={setTempStartTime}
          onClose={() => setShowStartTimeModal(false)}
          onSave={(updatedTime) => {
            adjustStartTime(updatedTime)
            setShowStartTimeModal(false)
          }}
        />
      )}

      {/* CONTROLS */}

      <WorkoutControls
        variant="editor"
        saving={saving}
        onSave={saveWorkout}
        onSecondaryAction={saveAsTemplate}
        secondaryActionLabel="Save As Template"
        onDiscardChanges={discardChanges}
        saveLabel="Save Workout"
        discardLabel="Cancel"
        hasExercises={workout.exercises.length > 0}
      />

      {/* FEEDBACK */}

      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* ADD EXERCISE */}

      <button
        className="btn btn-md btn-secondary btn-full"
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
