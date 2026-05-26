import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/button/BackButton'
import Button from '../../../shared/components/ui/button/Button'

import Header from '../../../shared/components/ui/Header'
import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'

import EditModal from '../../workout/components/time/EditModal'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

/**
 * Page for editing a completed workout.
 * @returns {import('react').ReactElement} Workout edit page UI
 */
export default function WorkoutEditPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)

  const from = searchParams.get('from')

  const fallback = from === 'history' ? '/history' : '/workouts'

  const { id } = useParams()

  const [showRenameModal, setShowRenameModal] = useState(false)

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)

  const [tempWorkoutName, setTempWorkoutName] = useState('')

  const [tempStartTime, setTempStartTime] = useState('')

  const {
    workout,
    setWorkout,

    loading,
    saving,
    error,

    exerciseActions,

    openLibrary,

    updateWorkoutNotes,

    hasUnsavedChanges,

    saveWorkout,

    saveAsTemplate,

    discardChanges,
  } = useWorkoutManager(id, navigate)

  // ===== RENAME MODAL =====

  const openRenameModal = () => {
    setTempWorkoutName(workout.name)
    setShowRenameModal(true)
  }

  // ===== START TIME MODAL =====

  const openStartTimeModal = () => {
    const current = new Date(workout.startTime)

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
      label: 'Save As Template',
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
        fallback={fallback}
        warnOnUnsavedChanges
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={discardChanges}
      />

      {/* WORKOUT HEADER */}

      <WorkoutHeader
        name={workout.name}
        startTime={workout.startTime}
        onChangeName={(value) =>
          setWorkout((prev) => ({ ...prev, name: value }))
        }
        mode="edit"
        duration={workout.duration}
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

            const updated = new Date(workout.startTime)

            updated.setHours(Number(hours))
            updated.setMinutes(Number(minutes))
            updated.setSeconds(0)

            const timestamp = updated.getTime()

            const endTime =
              workout.endTime || workout.startTime + workout.duration * 1000

            const duration = Math.max(
              0,
              Math.floor((endTime - timestamp) / 1000),
            )

            setWorkout((prev) => ({
              ...prev,
              startTime: timestamp,
              duration,
              endTime,
            }))

            setShowStartTimeModal(false)
          }}
        />
      )}

      {/* DURATION MODAL

      {showDurationModal && (
        <EditModal
          title="Edit duration"
          inputType="number"
          tempValue={tempDuration}
          setTempValue={setTempDuration}
          onClose={() => setShowDurationModal(false)}
          onSave={() => {
            const duration = Number(tempDuration)

            if (isNaN(duration)) {
              return
            }

            const endTime = workout.startTime + duration * 1000

            setWorkout((prev) => ({
              ...prev,
              duration,
              endTime,
            }))

            setShowDurationModal(false)
          }}
        />
      )} */}

      {/* CONTROLS */}

      <WorkoutControls
        variant="editor"
        saving={saving}
        onSave={saveWorkout}
        onSecondaryAction={saveAsTemplate}
        secondaryActionLabel="Save As Template"
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={discardChanges}
        saveLabel="Save Workout"
        discardLabel="Discard Changes"
        hasExercises={workout.exercises.length > 0}
      />

      {/* FEEDBACK */}

      {error && <p className="error center">{error}</p>}

      <div className="section">
        {/* ADD EXERCISE(S) */}

        <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
          Add exercise
        </Button>
      </div>

      {/* EMPTY WORKOUT */}

      <DataState
        data={workout.exercises}
        emptyText="Add your first exercise to start building your workout."
      >
        <div className="section">
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
      </DataState>

      {/* BOTTOM ACTIONS */}

      {workout.exercises.length >= 3 && (
        <div className="section">
          {/* ADD EXERCISE */}

          <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
            Add exercise
          </Button>

          <WorkoutControls
            variant="editor"
            saving={saving}
            onSave={saveWorkout}
            onDiscardChanges={discardChanges}
            hasUnsavedChanges={hasUnsavedChanges}
            hasExercises={workout.exercises.length > 0}
          />
        </div>
      )}
    </div>
  )
}
