import { buildWorkoutExercise } from './buildWorkoutExercise'

/**
 * @param {{
 *  exercises: object[],
 *  getPreviousSets: (id: string) => Promise<object|null>,
 *  setWorkout: import('react').Dispatch<import('react').SetStateAction<object>>
 * }} params - Append exercise dependencies
 */
export async function appendExercisesToWorkout({
  exercises,
  getPreviousSets,
  setWorkout,
}) {
  const results = await Promise.all(
    exercises.map(async (ex) => {
      const prev = await getPreviousSets(ex.id)

      return buildWorkoutExercise(ex, prev)
    }),
  )

  setWorkout((prev) => ({
    ...prev,

    exercises: [
      ...prev.exercises,

      ...results.filter(
        (newEx) =>
          !prev.exercises.some(
            (existing) => existing.id === newEx.id,
          ),
      ),
    ],
  }))
}
