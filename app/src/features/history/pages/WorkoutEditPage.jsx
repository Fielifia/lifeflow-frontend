import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { DndContext, closestCenter } from '@dnd-kit/core'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableExerciseItem from '../../exercise/components/SortableExerciseItem'

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

  // ===== STATE =====

  // Rename
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [tempWorkoutName, setTempWorkoutName] = useState('')

  // Start time
  const [showStartTimeModal, setShowStartTimeModal] = useState(false)
  const [tempStartTime, setTempStartTime] = useState('')

  //Duration
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [tempDuration, setTempDuration] = useState('')

  const {
    workout,
    setWorkout,

    loading,
    saving,
    error,

    openLibrary,
    exerciseActions,

    updateWorkoutNotes,

    hasUnsavedChanges,

    saveWorkout,

    saveAsTemplate,

    discardChanges,
  } = useWorkoutManager(id, navigate)

  // ===== REORDER =====

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = workout.exercises.findIndex((ex) => ex.id === active.id)

    const newIndex = workout.exercises.findIndex((ex) => ex.id === over.id)

    exerciseActions.reorderExercises(oldIndex, newIndex)
  }

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

  // ===== DURATION MODAL =====
  const openDurationModal = () => {
    setTempDuration(String(Math.floor((workout.duration || 0) / 60)))

    setShowDurationModal(true)
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
      label: 'Edit Duration',
      onClick: openDurationModal,
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

            const newStartTime = updated.getTime()

            const currentDuration = Number(workout.duration) || 0

            const oldStartTime = new Date(workout.startTime).getTime()

            const oldEndTime = oldStartTime + currentDuration * 1000

            const updatedDuration = Math.floor(
              (oldEndTime - newStartTime) / 1000,
            )

            setWorkout((prev) => ({
              ...prev,

              startTime: newStartTime,

              duration: Math.max(0, updatedDuration),
            }))

            setShowStartTimeModal(false)
          }}
        />
      )}

      {/* DURATION MODAL */}

      {showDurationModal && (
        <EditModal
          title="Edit duration"
          inputType="number"
          tempValue={tempDuration}
          setTempValue={setTempDuration}
          onClose={() => setShowDurationModal(false)}
          onSave={() => {
            const minutes = Number(tempDuration)

            const duration = minutes * 60

            if (isNaN(duration) || duration < 0) {
              return
            }

            setWorkout((prev) => ({
              ...prev,

              duration,
            }))

            setShowDurationModal(false)
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

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={workout.exercises.map((ex) => ex.id)}
              strategy={verticalListSortingStrategy}
            >
              {workout.exercises.map((ex, i) => (
                <SortableExerciseItem key={ex.id} id={ex.id}>
                  {({ dragHandleProps }) => (
                    <ExerciseItem
                      key={ex.id}
                      ex={ex}
                      i={i}
                      navigate={navigate}
                      actions={exerciseActions}
                      dragHandleProps={dragHandleProps}
                    />
                  )}
                </SortableExerciseItem>
              ))}
            </SortableContext>
          </DndContext>

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
