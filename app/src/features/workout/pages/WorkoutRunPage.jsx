import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useWorkoutLogic } from '../hooks/useWorkoutLogic'

import BackButton from '../../../shared/components/ui/BackButton'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutControls from '../../../shared/components/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem'

import RestTimer from '../components/time/RestTimer'

import WorkoutHeader from '../components/WorkoutHeader'

import EditStartTimeModal from '../components/time/EditStartTimeModal'

/**
 * Workout page for creating and tracking a workout session.
 *
 * Handles rendering only. All logic is managed in useWorkoutLogic.
 * @returns {import('react').ReactElement} Workout page UI
 */
export default function WorkoutRunPage() {
  const navigate = useNavigate()
  const { returnTo } = useExerciseFlow()

  const { id: workoutId } = useParams()
  const [flash, setFlash] = useState(false)

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)
  const [tempStartTime, setTempStartTime] = useState('')

  const [restTimerEnabled, setRestTimerEnabled] = useState(true)
  const [defaultRestTime] = useState(120)

  const {
    workout,
    saving,
    success,
    error,
    setWorkout,

    elapsed,

    isEditingName,
    setIsEditingName,

    startTime,
    adjustStartTime,

    openLibrary,

    exerciseActions,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,

    discardWorkout,
  } = useWorkoutLogic(navigate, workoutId)

  const {
    status,
    handleStartPause,
    restRemaining,
    isResting,
    adjustRest,
    skipRest,
  } = useWorkoutContext()

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

  return (
    <div className={`app ${flash ? 'flash' : ''}`}>
      <Header title={workout.name} subtitle="In progress" />

      <BackButton fallback={returnTo || '/workouts'} warnOnUnsavedChanges />

      {/* HEADER */}

      <WorkoutHeader
        name={workout.name}
        startTime={startTime}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        elapsed={elapsed}
        showDuration={true}
        menuItems={workoutMenuItems}
      />

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

      {/* TOP CONTROLS */}

      <WorkoutControls
        variant="run"
        status={status}
        handleStartPause={handleStartPause}
        onFinishWorkout={saveWorkout}
        onSaveTemplate={saveAsTemplate}
        onDiscardWorkout={discardWorkout}
        saving={saving}
        hasExercises={workout.exercises.length > 0}
      />

      {success && <p className="muted center">Saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* REST TIMER */}

      <RestTimer
        isResting={isResting}
        restRemaining={restRemaining}
        adjustRest={adjustRest}
        skipRest={skipRest}
        setFlash={setFlash}
      />
      <div className="section">
        {/* ADD EXERCISE */}
        <button
          className="btn btn-md btn-secondary btn-full"
          onClick={openLibrary}
        >
          Add exercise
        </button>
      </div>

      {/* EXERCISES */}
      <DataState
        data={workout.exercises}
        emptyText="Add your first exercise to start building your workout."
      >
        <>
          {workout.exercises.map((ex, i) => (
            <ExerciseItem
              mode="run"
              key={ex.id}
              ex={ex}
              i={i}
              navigate={navigate}
              actions={exerciseActions}
            />
          ))}
        </>
      </DataState>

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
