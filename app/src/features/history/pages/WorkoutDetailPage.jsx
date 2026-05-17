import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { formatDate } from '../../../shared/utils/format'
import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import { useWorkoutDetail } from '../hooks/useWorkoutDetail'
import { useWorkoutManager } from '../hooks/useWorkoutManager'

import BackButton from '../../../shared/components/ui/BackButton'
import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'
import WorkoutControls from '../../../shared/components/WorkoutControls'
import ExerciseItem from '../../exercise/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'
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
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const { startWorkout } = useStartWorkout()

  const { workout, loading, error, stats } = useWorkoutDetail(id)

  const { success, deleteWorkout } = useWorkoutManager(id, navigate)

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
      <Header title={workout.name} subtitle={formatDate(workout.date)} />
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

      {/* CONTROLS */}
      <WorkoutControls
        variant="detail"
        onStartWorkout={(e) => {
          e.stopPropagation?.()

          startWorkout({ workout })
        }}
        onEdit={() => {
          setReturnTo(location.pathname)

          navigate(`/workouts/${workout._id}/edit`)
        }}
        onDelete={deleteWorkout}
        editLabel="Edit workout"
        deleteLabel="Delete workout"
      />
      {success && <p className="muted center">Workout saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* EXERCISES */}
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
