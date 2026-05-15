import { buildWorkoutExercise }
  from './buildWorkoutExercise'

import { getPreviousExercise }
  from '../../../shared/api/workoutApi'

/**
 * Appends exercises to workout state.
 * Fetches previous exercise data
 * and converts exercises into
 * workout-ready frontend shape.
 * @param {{
 *  exercises: object[],
 *  setWorkout: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >
 * }} params - Append exercise dependencies
 */
export async function appendExercisesToWorkout({
  exercises,
  setWorkout,
}) {
  const results = await Promise.all(
    exercises.map(async (ex) => {
      const prev =
        await getPreviousExercise(ex.id)

      return buildWorkoutExercise(
        ex,
        prev,
      )
    }),
  )

  setWorkout((prev) => ({
    ...prev,

    exercises: [
      ...prev.exercises,

      ...results.filter(
        (newEx) =>
          !prev.exercises.some(
            (existing) =>
              existing.id === newEx.id,
          ),
      ),
    ],
  }))
}
