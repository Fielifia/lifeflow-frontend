import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useWorkoutLogic } from '../hooks/useWorkoutLogic'

import { formatElapsedTime } from '../../../shared/utils/format'

import BackButton from '../../../shared/components/ui/button/BackButton'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'

import RestTimer from '../components/time/RestTimer'

import WorkoutHeader from '../components/WorkoutHeader'

import EditStartTimeModal from '../components/time/EditStartTimeModal'

import '../Workout.css'

/**
 * Workout page for creating and tracking a workout session.
 *
 * Handles rendering only. All logic is managed in useWorkoutLogic.
 * @returns {import('react').ReactElement} Workout page UI
 */
export default function WorkoutRunPage() {
  const navigate = useNavigate()

  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)

  const flow = searchParams.get('flow')

  const fallback = flow === 'template-detail' ? '/templates' : '/workouts'

  const { id: workoutId } = useParams()
  const [flash, setFlash] = useState(false)

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)

  const [tempStartTime, setTempStartTime] = useState('')

  const [restTimerEnabled, setRestTimerEnabled] = useState(true)
  const [defaultRestTime] = useState(120)

  const {
    workout,
    saving,
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
  } = useWorkoutLogic(workoutId, navigate)

  const {
    status,
    handleStartPause,
    restRemaining,
    isResting,
    adjustRest,
    skipRest,
  } = useWorkoutContext()

  // ===== START TIME MODAL =====

  const openStartTimeModal = () => {
    const current = new Date(startTime)

    const hours = String(current.getHours()).padStart(2, '0')

    const minutes = String(current.getMinutes()).padStart(2, '0')

    setTempStartTime(`${hours}:${minutes}`)

    setShowStartTimeModal(true)
  }

  // ===== ACTION MENU =====

  const workoutMenuItems = [
    {
      label: 'Rename',
      onClick: () => setIsEditingName(true),
    },

    {
      label: 'Edit start time',
      onClick: openStartTimeModal,
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
  const duration = formatElapsedTime(elapsed)

  return (
    <div className={`app ${flash ? 'flash' : ''}`}>
      <Header title={workout.name} subtitle={`In progress • ${duration}`} />

      <BackButton fallback={fallback} warnOnUnsavedChanges />

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
        onEditStartTime={openStartTimeModal}
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

      {/* BOTTOM ACTIONS */}

      {workout.exercises.length >= 3 && (
        <div className="section section-with-bottom-action">
          <WorkoutControls
            variant="run"
            onFinishWorkout={saveWorkout}
            onDiscardWorkout={discardWorkout}
            saving={saving}
            hasExercises={workout.exercises.length > 0}
          />
        </div>
      )}
    </div>
  )
}
