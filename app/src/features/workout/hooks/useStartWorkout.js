import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

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
