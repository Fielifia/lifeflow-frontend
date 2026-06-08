import { useLocation, useNavigate } from 'react-router-dom'
import './WorkoutSessionBar.css'
import { useWorkoutContext } from '../../../../shared/context/WorkoutContext'
import { hasWorkoutDraftContent } from '../../../../shared/utils/storage/draftStorage'
import { draftWorkoutStorage } from '../../../../shared/utils/storage/draftStorage'
import WorkoutSessionBar from './WorkoutSessionBar'

/**
 * Floating workout session bar wrapper.
 * Displays the active workout session bar outside
 * of the workout run page.
 * @returns {import('react').ReactElement|null} Workout session bar UI
 */
export default function WorkoutSessionBarWrapper() {
  const location = useLocation()
  const navigate = useNavigate()

  const { isResting, restRemaining, adjustRest, skipRest } = useWorkoutContext()

  const workout = draftWorkoutStorage.get()

  const isWorkoutPage = location.pathname.includes('/run')

  const hasActiveWorkout = hasWorkoutDraftContent(workout)

  if (!hasActiveWorkout || isWorkoutPage) {
    return null
  }

  return (
    <WorkoutSessionBar
      workout={workout}
      isResting={isResting}
      restRemaining={restRemaining}
      adjustRest={adjustRest}
      skipRest={skipRest}
      onExpand={() => navigate('/workouts/current/run')}
    />
  )
}
