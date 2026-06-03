import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { DndContext, closestCenter } from '@dnd-kit/core'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableExerciseItem from '../../exercise/components/SortableExerciseItem'

import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/button/BackButton'
import Button from '../../../shared/components/ui/button/Button'

import Notes from '../../../shared/components/ui/input/Notes'
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

  // Time
  const [tempStartDate, setTempStartDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState('')

  const [showTimeModal, setShowTimeModal] = useState(false)

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

  // ===== TIME MODAL =====

  // ===== TIME MODAL =====

  const openTimeModal = () => {
    const formatLocalDateTime = (date) => {
      const offset = date.getTimezoneOffset()

      const local = new Date(date.getTime() - offset * 60000)

      return local.toISOString().slice(0, 16)
    }

    const start = new Date(workout.startTime)

    const end = new Date(
      new Date(workout.startTime).getTime() + (workout.duration || 0) * 1000,
    )

    setTempStartDate(formatLocalDateTime(start))
    setTempEndDate(formatLocalDateTime(end))

    setShowTimeModal(true)
  }

  const calculatedMinutes = Math.max(
    0,
    Math.floor((new Date(tempEndDate) - new Date(tempStartDate)) / 60000),
  )

  const handleSaveTimes = () => {
    const start = new Date(tempStartDate)
    const end = new Date(tempEndDate)

    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)

    setWorkout((prev) => ({
      ...prev,
      startTime: start.getTime(),
      duration: Math.max(0, duration),
    }))

    setShowTimeModal(false)
  }

  // ===== ACTION MENU =====

  const workoutMenuItems = [
    {
      label: 'Rename',
      onClick: openRenameModal,
    },

    {
      label: 'Edit Times',
      onClick: openTimeModal,
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
        <Header subtitle="Edit Workout" />
        <BackButton fallback="/workouts" />

        <DataState
          loading={loading}
          error={error}
          data={workout ? [workout] : []}
          variant="card-workout"
          emptyTitle="Workout not found"
          emptyText="It may have been deleted or no longer exists."
          count={1}
        />
      </div>
    )
  }

  return (
    <div className="app">
      {/* HEADER */}

      <Header subtitle="Edit workout" />

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
        onEditStartTime={openTimeModal}
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

      {/* TIME MODAL */}

      {showTimeModal && (
        <EditModal
          title="Edit workout times"
          contentClassName="time-range"
          onClose={() => setShowTimeModal(false)}
          onSave={handleSaveTimes}
        >
          <div className="time-modal">
            <input
              className="input-base"
              type="datetime-local"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
            />

            <input
              className="input-base"
              type="datetime-local"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
            />

            <span className="muted small duration-preview">
              {`Duration: 
              ${calculatedMinutes} min`}
            </span>
          </div>
        </EditModal>
      )}

      {/* CONTROLS */}
      <div className="container">
        <WorkoutControls
          variant="editor"
          saving={saving}
          onSave={saveWorkout}
          onSecondaryAction={saveAsTemplate}
          secondaryActionLabel="Save As Template"
          hasUnsavedChanges={hasUnsavedChanges}
          onDiscardChanges={discardChanges}
          saveLabel="Save Workout"
          discardLabel="Discard"
          hasExercises={workout.exercises.length > 0}
        />

        {/* FEEDBACK */}

        {error && <p className="error center">{error}</p>}

        {/* ADD EXERCISE(S) */}

        <Button variant="action" size="md" fullWidth onClick={openLibrary}>
          Add exercise
        </Button>
      </div>

      {/* EMPTY WORKOUT */}

      <DataState
        data={workout.exercises}
        emptyTitle="No exercises added"
        emptyText="Add an exercise to start building your workout."
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
            <Notes
              value={workout.notes}
              className="input-base textarea"
              onChange={updateWorkoutNotes}
              placeholder="Workout Notes..."
              maxLength={500}
            />
          )}
        </div>
      </DataState>

      {/* BOTTOM ACTIONS */}

      {workout.exercises.length >= 3 && (
        <div className="container">
          {/* ADD EXERCISE */}

          <Button variant="action" size="md" fullWidth onClick={openLibrary}>
            Add exercise
          </Button>

          <WorkoutControls
            variant="editor"
            saving={saving}
            onSave={saveWorkout}
            onSecondaryAction={saveAsTemplate}
            secondaryActionLabel="Save As Template"
            hasUnsavedChanges={hasUnsavedChanges}
            onDiscardChanges={discardChanges}
            saveLabel="Save Workout"
            discardLabel="Discard"
            hasExercises={workout.exercises.length > 0}
          />
        </div>
      )}
    </div>
  )
}
