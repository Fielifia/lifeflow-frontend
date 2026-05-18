import { useLocation, useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import { hasWorkoutDraftContent } from '../../../../shared/utils/storage/draftStorage'
import WorkoutSessionBar from './WorkoutSessionBar'

/**
 * Floating workout session bar wrapper.
 * Displays the active workout session bar outside
 * of the workout run page.
 * @returns {import('react').ReactElement|null} Workout session bar UI
 */
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

  const hasActiveWorkout = hasWorkoutDraftContent(activeWorkout)
  
  if (!hasActiveWorkout || isWorkoutPage) {
    return null
  }

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
