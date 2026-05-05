import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import WorkoutSessionBar from './WorkoutSessionBar'

export default function WorkoutSessionBarWrapper() {
  const {
    activeWorkout,
    isResting,
    restRemaining,
    adjustRest,
    skipRest,
  } = useWorkoutContext()
  
  const location = useLocation()
  const navigate = useNavigate()

  const isWorkoutPage = location.pathname.includes('/run')
  
  if (!activeWorkout || isWorkoutPage) return null

  return (
    <WorkoutSessionBar
      elapsed={activeWorkout.elapsed}
      status={activeWorkout.status}
      workoutName={activeWorkout.name}
      currentExercise={activeWorkout.currentExercise}
      isResting={isResting}
      restRemaining={restRemaining}
      adjustRest={adjustRest}
      skipRest={skipRest}
      onExpand={() => navigate('/workouts/active/run')}
    />
  )
}
