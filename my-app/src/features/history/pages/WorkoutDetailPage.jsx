import { useNavigate, useParams } from 'react-router-dom'

import { useWorkoutDetail } from '../hooks/useWorkoutDetail'

import DataState from '../../../shared/ui/DataState'
import BackButton from '../../../shared/ui/BackButton'
import WorkoutHeader from '../../workout/components/WorkoutHeader'
import ExerciseItem from '../../workout/components/ExerciseItem'
import WorkoutSummary from '../components/WorkoutSummary'

/**
 * Page for displaying detailed information about a single workout.
 *
 * Fetches workout by ID and displays completed workout details.
 * @returns {import('react').ReactElement} Workout detail page UI
 */
export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    workout,
    loading,
    error,
    stats,
  } = useWorkoutDetail(id)

  if (loading || error || !workout) {
    return (
      <div className="card-base card-workout">
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
    <div className="card-base card-workout">
      <BackButton fallback="/history" />

      {/* HEADER */}
      <WorkoutHeader
        name={workout.name}
        mode="history"
        duration={workout.duration}
        isEditable={false}
        showDuration
      />

      {/* SUMMARY */}
      <WorkoutSummary
        exerciseCount={workout.exercises.length}
        totalSets={stats.totalSets}
        totalReps={stats.totalReps}
        totalVolume={stats.totalVolume}
        personalBests={stats.personalBests}
      />

      {/* ACTIONS */}
      <div className="workout-controls">
        <button
          className="btn btn-standard btn-secondary"
          onClick={() =>
            navigate(`/workouts/${workout._id}/edit`)
          }
        >
          Edit workout
        </button>
      </div>

      {/* EXERCISES */}
      {workout.exercises.map((ex, i) => (
        <ExerciseItem
          key={ex.exerciseId || i}
          ex={ex}
          i={i}
          navigate={navigate}
          isEditable={false}
          showCheckbox={false}
        />
      ))}

      {/* NOTES */}
      {workout.notes && (
        <div className="section">
          <h3>Notes</h3>

          <p className="muted">
            {workout.notes}
          </p>
        </div>
      )}
    </div>
  )
}
