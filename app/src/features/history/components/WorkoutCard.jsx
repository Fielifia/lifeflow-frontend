import { useNavigate, useLocation } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import TemplateControls from '../../template/components/TemplateControls'
import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

/**
 * Displays a summary card for a workout.
 * @param {{ workout: { _id: string, name?: string, createdAt: string, duration: number, exercises: Array } }} props
 * @returns {import('react').ReactElement} Workout card UI
 */
export default function WorkoutCard({ workout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setReturnTo } = useExerciseFlow()
  const { setSelectedWorkout } = useWorkoutContext()
  const { startWorkout } = useStartWorkout()

  const date = new Date(workout.createdAt).toLocaleDateString()
  const exercises = workout.exercises || []

  const handleStartWorkout = (e) => {
    e.stopPropagation()
    setSelectedWorkout(workout)
    startWorkout({ workout })
  }

  return (
    <div
      className="card-base template-card clickable"
      onClick={() => {
        setReturnTo(location.pathname)
        navigate(`/workouts/${workout._id}`)
      }}
    >
      {/* HEADER */}
      <div className="template-header">
        <div>
          <h3>{workout.name || 'Workout'}</h3>
          <p className="muted small">
            {exercises.length} exercises • {Math.round(workout.duration / 60)} min
          </p>
          <p className="muted small">{date}</p>
        </div>

        <button className="btn-clean btn-dots">⋮</button>
      </div>

      {/* EXERCISE PREVIEW */}
      <ul className="template-list">
        {exercises.slice(0, 4).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      {/* ACTION */}
      <TemplateControls onStartWorkout={handleStartWorkout} hasExercises={exercises.length > 0} />
    </div>
  )
}
