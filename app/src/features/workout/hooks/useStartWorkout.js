import { useNavigate } from 'react-router-dom'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useConfirm } from '../../../shared/hooks/useConfirm'

import { buildWorkoutExercise } from '../utils/buildWorkoutExercise'

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
    start,
    resetTimer,
    resetRest,
  } = useWorkoutContext()

  const confirm = useConfirm()

  const startWorkout = async ({
    workout = null,
    template = null,
  }) => {
    const activeWorkout =
      draftWorkoutStorage.get()

    if (
      hasWorkoutDraftContent(activeWorkout)
    ) {
      const confirmed = await confirm({
        title: 'Discard current workout?',
        description: 'Your active workout will be lost.',
        confirmText: 'Discard',
        variant: 'danger',
      })

      if (!confirmed) {
        return
      }

      resetTimer()
      resetRest()

      draftWorkoutStorage.clear()
    }

    let preparedWorkout = null

    // ===== FROM TEMPLATE =====

    if (template) {
      preparedWorkout = {
        name: template.name,
        notes: '',
        exercises:
          template.exercises.map((ex) =>
            buildWorkoutExercise(ex, null, {
              resetCompleted: true,
            }),
          ),
      }
    }

    // ===== FROM WORKOUT =====

    if (workout) {
      preparedWorkout = {
        name: workout.name,
        notes: '',
        exercises:
          workout.exercises.map((ex) =>
            buildWorkoutExercise(ex, null, {
              resetCompleted: true,
            }),
          ),
      }
    }

    if (preparedWorkout) {
      draftWorkoutStorage.set(
        preparedWorkout,
      )
    }

    start()

    navigate('/workouts/current/run')
  }

  return { startWorkout }
}
