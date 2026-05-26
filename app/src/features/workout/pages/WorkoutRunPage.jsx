import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useWorkoutLogic } from '../hooks/useWorkoutLogic'

import { formatElapsedTime } from '../../../shared/utils/format'

import BackButton from '../../../shared/components/ui/button/BackButton'

import Button from '../../../shared/components/ui/button/Button'

import EditModal from '../components/time/EditStartTimeModal'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'

import RestTimer from '../components/time/RestTimer'

import WorkoutHeader from '../components/WorkoutHeader'

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

  const [showRenameModal, setShowRenameModal] = useState(false)

  const [tempWorkoutName, setTempWorkoutName] = useState('')

  const [restTimerEnabled, setRestTimerEnabled] = useState(true)

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)

  const [tempStartTime, setTempStartTime] = useState('')

  const [defaultRestTime] = useState(120)

  const {
    workout,
    saving,
    error,
    setWorkout,

    elapsed,

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

    flash,
  } = useWorkoutContext()

  // ===== TOGGLE REST TIMER =====

  useEffect(() => {
    if (!restTimerEnabled && isResting) {
      skipRest()
    }
  }, [restTimerEnabled, isResting, skipRest])

  // ===== RENAME MODAL =====

  const openRenameModal = () => {
    setTempWorkoutName(workout.name)
    setShowRenameModal(true)
  }

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
      onClick: openRenameModal,
    },

    {
      label: 'Edit Start Time',
      onClick: openStartTimeModal,
    },

    {
      divider: true,
    },

    {
      label: 'Rest Timer ',
      subtitle: restTimerEnabled ? 'On' : 'Off',
      type: 'toggle',
      value: restTimerEnabled,
      onChange: setRestTimerEnabled,
      closeOnClick: false,
    },

    {
      label: 'Default Rest Time: ',
      subtitle: `${defaultRestTime}s`,
      onClick: () => console.log('default rest'),
    },

    {
      divider: true,
    },

    {
      label: 'Save As Template',
      onClick: saveAsTemplate,
    },
  ]
  const duration = formatElapsedTime(elapsed)

  return (
    <div className={`app ${flash ? 'flash' : ''}`}>
      <Header title={workout.name} subtitle={`In progress • ${duration}`} />

      <BackButton fallback={fallback} warnOnUnsavedChanges />

      {/* REST TIMER */}

      <RestTimer
        isResting={isResting}
        restRemaining={restRemaining}
        adjustRest={adjustRest}
        skipRest={skipRest}
        exercises={workout?.exercises}
      />

      {/* HEADER */}

      <WorkoutHeader
        name={workout.name}
        startTime={startTime}
        elapsed={elapsed}
        showDuration={true}
        menuItems={workoutMenuItems}
        onEditName={openRenameModal}
        onEditStartTime={openStartTimeModal}
      />

      {/* RENAME MODAL */}

      {showRenameModal && (
        <EditModal
          title="Edit workout name"
          tempValue={tempWorkoutName}
          setTempValue={setTempWorkoutName}
          onClose={() => setShowRenameModal(false)}
          onSave={() => {
            setWorkout((prev) => ({
              ...prev,
              name: tempWorkoutName.trim() || 'Workout',
            }))

            setShowRenameModal(false)
          }}
        />
      )}

      {/* START TIME MODAL */}

      {showStartTimeModal && (
        <EditModal
          title="Edit start time"
          inputType="time"
          tempValue={tempStartTime}
          setTempValue={setTempStartTime}
          onClose={() => setShowStartTimeModal(false)}
          onSave={() => {
            const [hours, minutes] = tempStartTime.split(':')

            const updated = new Date(startTime)

            updated.setHours(Number(hours))
            updated.setMinutes(Number(minutes))
            updated.setSeconds(0)

            const timestamp = updated.getTime()

            adjustStartTime(timestamp)

            setWorkout((prev) => ({
              ...prev,
              startTime: timestamp,
            }))

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

      <div className="section">
        {/* ADD EXERCISE */}
        <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
          Add exercise
        </Button>
      </div>

      <div className="section">
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

      {/* BOTTOM ACTIONS */}

      {workout.exercises.length >= 3 && (
        <div className="section">
          {/* ADD EXERCISE */}

          <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
            Add exercise
          </Button>

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
