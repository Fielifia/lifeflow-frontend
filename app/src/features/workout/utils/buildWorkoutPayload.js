import { serializeWorkoutExercise }
  from '../../../shared/utils/serializeWorkoutExercise'

/**
 * Builds workout API payload.

 * Removes incomplete exercises
 * and converts frontend workout
 * state into backend format.
 * @param {{
 *  name?: string,
 *  notes?: string,
 *  exercises?: Array,
 * }} workout
 * @param {number} elapsed
 * @returns {object} Workout payload
 */
export function buildWorkoutPayload(
  workout,
  elapsed,
) {
  const exercises =
    workout.exercises
      ?.map((ex) => ({
        ...serializeWorkoutExercise(ex),

        sets:
          ex.sets?.filter(
            (set) => set.completed,
          ) || [],
      }))
      .filter((ex) => ex.sets.length > 0) || []

  return {
    name:
      workout.name?.trim() ||
      'Workout',

    notes:
      workout.notes || '',

    duration: elapsed,

    exercises,
  }
}
