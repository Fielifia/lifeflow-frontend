import { getPreviousExerciseApi } from '../../../shared/api/workoutApi'
import { buildWorkoutExercise } from './buildWorkoutExercise'

/**
 * Appends exercises to workout state.
 *
 * For each exercise:
 * - fetches previous workout data
 * - builds normalized workout exercise objects
 * - prevents duplicate exercises
 * @param {{
 *  exercises: object[],
 *  setWorkout: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >
 * }} params - Append exercise dependencies
 * @returns {Promise<void>}
 */
export async function appendExercisesToWorkout({ exercises, setWorkout }) {
  const results = await Promise.all(
    exercises.map(async (ex) => {
      const prev = await getPreviousExerciseApi(ex.exerciseId || ex.id)
      return buildWorkoutExercise(ex, prev)
    }),
  )

  setWorkout((prev) => {
    const uniqueExercises = results.filter(
      (newEx) =>
        !prev.exercises.some(
          (existing) => existing.exerciseId === newEx.exerciseId,
        ),
    )

    return {
      ...prev,
      exercises: [...prev.exercises, ...uniqueExercises],
    }
  })
}
