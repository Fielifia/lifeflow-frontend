import { getPreviousExercise } from '../../../shared/api/workoutApi'

export const usePreviousExercise = () => {
  const getPreviousSets = async (exerciseId) => {
    try {
      const res = await getPreviousExercise(exerciseId)

      if (!res?.sets?.length) return null

      return res.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
        completed: false,
      }))
    } catch {
      return null
    }
  }

  return { getPreviousSets }
}
