import { useNavigate, useParams } from 'react-router-dom'

import { useWorkoutManager } from '../hooks/useWorkoutManager'

import { formatDate } from '../../../shared/utils/format'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

import { useWorkoutDetail } from '../hooks/useWorkoutDetail'

import BackButton from '../../../shared/components/ui/button/BackButton'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import WorkoutHeader from '../../workout/components/WorkoutHeader'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'
import WorkoutSummary from '../components/WorkoutSummary'

/**
 * Page for displaying detailed information about a completed workout.
 *
 * Handles:
 * - Workout loading state
 * - Workout summary statistics
 * - Muscle split calculation
 * - Workout actions (restart, edit, delete)
 * - Exercise list rendering
 * @returns {import('react').ReactElement} Workout detail page UI
 */
export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const { workout, loading, error, stats } = useWorkoutDetail(id)

  const { deleteWorkout } = useWorkoutManager(id, navigate)

  const handleDeleteWorkout = async () => {
    const deleted = await deleteWorkout()

    if (!deleted) {
      return
    }

    navigate('/history')
  }

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

      <Header title={workout.name} subtitle={formatDate(workout.timestamp)} />

      {/* BACK BUTTON */}

      <BackButton fallback="/history" />

      {/* WORKOUT HEADER */}

      <WorkoutHeader
        name={workout.name}
        mode="history"
        startTime={workout.startTime}
        duration={workout.duration}
        isEditable={false}
        showDuration
        durationLabel="Completed in"
      />

      {/* SUMMARY */}

      <WorkoutSummary
        exerciseCount={stats.exerciseCount}
        totalSets={stats.totalSets}
        totalReps={stats.totalReps}
        totalVolume={stats.totalVolume}
        personalBests={stats.personalBests}
        muscleSplit={stats.muscleSplit}
      />

      {/* CONTROLS */}

      <WorkoutControls
        variant="detail"
        onStartWorkout={(e) => {
          e.stopPropagation?.()

          startWorkout({ workout })
        }}
        onEdit={() => {
          navigate(`/workouts/${workout._id}/edit?from=history`)
        }}
        onDelete={handleDeleteWorkout}
        editLabel="Edit Workout"
        deleteLabel="Delete"
      />

      {/* FEEDBACK */}

      {error && <p className="error center">{error}</p>}

      {/* EXERCISES */}
      <div className="section">
        {workout.exercises.map((ex, i) => (
          <ExerciseItem
            mode="workout"
            key={ex.id || i}
            ex={ex}
            i={i}
            navigate={navigate}
            isEditable={false}
            showCheckbox={false}
          />
        ))}
      </div>

      {/* NOTES */}

      {workout.notes && (
        <div className="section">
          <h3>Notes</h3>

          <p className="muted">{workout.notes}</p>
        </div>
      )}
    </div>
  )
}
