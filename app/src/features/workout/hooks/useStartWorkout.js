import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

/**
 * Handles workout session startup flow.
 *
 * Stores selected workout/template
 * in shared workout context and
 * navigates to workout run page.
 * @returns {{
 *  startWorkout: (params: {
 *    workout?: object|null,
 *    template?: object|null
 *  }) => void
 * }} Workout start actions
 */
export function useStartWorkout() {
  const navigate = useNavigate()
  const { setSelectedWorkout, setSelectedTemplate } = useWorkoutContext()

  const startWorkout = ({ workout = null, template = null }) => {
    const workoutId = Date.now()

    if (workout) setSelectedWorkout(workout)
    if (template) setSelectedTemplate(template)

    navigate(`/workouts/${workoutId}/run`)
  }

  return { startWorkout }
}
