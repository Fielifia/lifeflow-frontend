import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { DndContext, closestCenter } from '@dnd-kit/core'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { useProfileSettings } from '../../profile/hooks/useProfileSettings'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useWorkoutLogic } from '../hooks/useWorkoutLogic'

import { getCurrentExerciseObject } from '../../../shared/utils/getCurrentExercise'

import { formatElapsedTime } from '../../../shared/utils/format'

import BackButton from '../../../shared/components/ui/button/BackButton'

import Button from '../../../shared/components/ui/button/Button'

import EditModal from '../components/time/EditModal'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutControls from '../../../shared/components/ui/workout-controls/WorkoutControls'

import SortableExerciseItem from '../../exercise/components/SortableExerciseItem'

import Notes from '../../../shared/components/ui/input/Notes'
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

  const [showStartTimeModal, setShowStartTimeModal] = useState(false)

  const [tempStartTime, setTempStartTime] = useState('')

  const [showDefaultRestModal, setShowDefaultRestModal] = useState(false)

  const [tempDefaultRest, setTempDefaultRest] = useState('')

  const { settings } = useProfileSettings()

  const {
    workout,
    saving,
    error,
    setWorkout,

    elapsed,
    completedSets,
    totalVolume,

    startTime,
    adjustStartTime,

    defaultRestTime,
    updateDefaultRestTime,

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

  const restTimerEnabled = workout.restTimerEnabled ?? true

  const currentExercise = getCurrentExerciseObject(workout?.exercises || [])

  useEffect(() => {
    if (
      settings?.restTimerEnabled != null &&
      workout.restTimerEnabled == null
    ) {
      setWorkout((prev) => ({
        ...prev,
        restTimerEnabled: settings.restTimerEnabled,
      }))
    }
  }, [settings, workout.restTimerEnabled, setWorkout])

  useEffect(() => {
    if (settings?.defaultRestTime != null && workout.defaultRestTime == null) {
      setWorkout((prev) => ({
        ...prev,
        defaultRestTime: settings.defaultRestTime,
      }))
    }
  }, [settings, workout.defaultRestTime, setWorkout])

  useEffect(() => {
    const fromLibrary = location.state?.fromLibrary

    if (!fromLibrary) {
      window.scrollTo(0, 0)
      return
    }

    const saved = sessionStorage.getItem('workout-run-scroll')

    if (!saved) {
      return
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, Number(saved))
    })
  }, [location.state?.fromLibrary])

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

  // ===== DEFAULT REST MODAL =====

  const openDefaultRestModal = () => {
    setTempDefaultRest(String(defaultRestTime))

    setShowDefaultRestModal(true)
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
      onChange: (value) =>
        setWorkout((prev) => ({
          ...prev,
          restTimerEnabled: value,
        })),
      closeOnClick: false,
    },

    {
      label: 'Workout Rest Time: ',
      subtitle: `${defaultRestTime}s`,
      onClick: openDefaultRestModal,
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

  return (
    <div className={`app ${flash ? 'flash' : ''}`}>
      <Header subtitle={`In progress • ${duration}`} />
      <BackButton fallback={fallback} warnOnUnsavedChanges />

      {/* REST TIMER */}
      {restTimerEnabled && (
        <RestTimer
          isResting={isResting}
          restRemaining={restRemaining}
          adjustRest={adjustRest}
          skipRest={skipRest}
          exercises={workout?.exercises}
        />
      )}

      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        startTime={startTime}
        elapsed={elapsed}
        liveStats={{
          completedSets,
          totalVolume,
        }}
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

      {/* REST TIME MODAL */}
      {showDefaultRestModal && (
        <EditModal
          title="Default rest time"
          inputType="number"
          tempValue={tempDefaultRest}
          setTempValue={setTempDefaultRest}
          onClose={() => setShowDefaultRestModal(false)}
          onSave={() => {
            const value = Number(tempDefaultRest)

            if (isNaN(value) || value < 0) {
              return
            }

            updateDefaultRestTime(value)

            setShowDefaultRestModal(false)
          }}
        />
      )}

      {/* TOP CONTROLS */}
      <div className="container">
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

        {/* ADD EXERCISE */}
        <Button variant="action" size="md" fullWidth onClick={openLibrary}>
          Add exercise
        </Button>
      </div>

      <div className="section">
        {/* EXERCISES */}
        <DataState
          data={workout.exercises}
          emptyTitle="No exercises added"
          emptyText="Add an exercise to start building your workout."
        >
          <>
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
                        mode="run"
                        ex={ex}
                        i={i}
                        currentExercise={currentExercise}
                        navigate={navigate}
                        actions={exerciseActions}
                        dragHandleProps={dragHandleProps}
                        restTimerEnabled={restTimerEnabled}
                      />
                    )}
                  </SortableExerciseItem>
                ))}
              </SortableContext>
            </DndContext>
          </>
        </DataState>

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
      {/* BOTTOM ACTIONS */}
      {workout.exercises.length >= 3 && (
        <div className="section">
          {/* ADD EXERCISE */}

          <Button variant="action" size="md" fullWidth onClick={openLibrary}>
            Add exercise
          </Button>

          <WorkoutControls
            variant="run"
            status={status}
            handleStartPause={handleStartPause}
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
