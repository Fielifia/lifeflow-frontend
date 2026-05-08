import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import WorkoutSessionBar from './WorkoutSessionBar'

export default function WorkoutSessionBarWrapper() {
  const {
    activeWorkout,
    elapsed,
    status,
    isResting,
    restRemaining,
    adjustRest,
    skipRest,
  } = useWorkoutContext()
  
  const location = useLocation()
  const navigate = useNavigate()

  const isWorkoutPage = location.pathname.includes('/run')
  
  if (!activeWorkout?.id || isWorkoutPage) return null

  return (
    <WorkoutSessionBar
      elapsed={elapsed}
      status={status}
      workoutName={activeWorkout.name}
      currentExercise={activeWorkout.currentExercise}
      isResting={isResting}
      restRemaining={restRemaining}
      adjustRest={adjustRest}
      skipRest={skipRest}
      onExpand={() => navigate(`/workouts/${activeWorkout.id}/run`)}
    />
  )
}
