import { useNavigate } from 'react-router-dom'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import {
  draftWorkoutStorage,
  hasWorkoutDraftContent,
} from '../../../shared/utils/storage/draftStorage'

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
  const {
    setSelectedWorkout,
    setSelectedTemplate,
    start,
    resetTimer,
    resetRest,
  } = useWorkoutContext()

  const startWorkout = ({ workout = null, template = null }) => {
    const activeWorkout = draftWorkoutStorage.get()

    if (hasWorkoutDraftContent(activeWorkout)) {
      const confirmed = window.confirm(
        'Discard current workout and start a new one?',
      )

      if (!confirmed) {
        return
      }

      resetTimer()
      resetRest()
      draftWorkoutStorage.clear()
    }

    if (workout) setSelectedWorkout(workout)
    if (template) setSelectedTemplate(template)

    start()
    navigate('/workouts/current/run')
  }

  return { startWorkout }
}
