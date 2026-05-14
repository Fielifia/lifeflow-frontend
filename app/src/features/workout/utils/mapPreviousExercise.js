/**
 * Maps previous exercise data from the API
 * into the format used by the workout flow.
 * @param {object} res - Previous exercise response
 * @param {Array<object>} [res.sets] - Previous exercise sets
 * @param {number|string} res.sets[].reps - Number of reps
 * @param {number|string} res.sets[].weight - Weight used
 * @param {object} [res.bestSet] - Best recorded set
 * @returns {{
 *   sets: Array<{
 *     reps: number|string,
 *     weight: number|string,
 *     completed: boolean
 *   }>,
 *   bestSet: object
 * } | null} Mapped previous exercise data or null if no sets exist
 */
export function mapPreviousExercise(res) {
  if (!res?.sets?.length) return null

  return {
    sets: res.sets.map((s) => ({
      reps: s.reps,
      weight: s.weight,
      completed: false,
    })),
    bestSet: res.bestSet,
  }
}
