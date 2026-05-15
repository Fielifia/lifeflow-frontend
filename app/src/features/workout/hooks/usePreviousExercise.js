import { getPreviousExercise } from '../../../shared/api/workoutApi'
import { mapPreviousExercise } from '../utils/buildPreviousWorkoutData'

export const usePreviousExercise = () => {
  const getPreviousSets = async (exerciseId) => {
    try {
      const res = await getPreviousExercise(exerciseId)

      return mapPreviousExercise(res)
    } catch {
      return null
    }
  }

  return { getPreviousSets }
}
