import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import WorkoutSessionBar from './WorkoutSessionBar'

export default function WorkoutSessionBarWrapper() {
  const { activeWorkout } = useWorkoutContext()
  const navigate = useNavigate()

  if (!activeWorkout) return null

  return (
    <WorkoutSessionBar
      elapsed={activeWorkout.elapsed}
      status={activeWorkout.status}
      workoutName={activeWorkout.name}
      currentExercise={activeWorkout.currentExercise}
      onExpand={() => navigate('/workouts/active/run')}
    />
  )
}
