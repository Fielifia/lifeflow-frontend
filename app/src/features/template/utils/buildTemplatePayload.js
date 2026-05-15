import { serializeWorkoutExercise }
  from '../../../shared/utils/serializeWorkoutExercise'

/**
 * Builds template API payload.
 *
 * Converts frontend template/workout
 * state into backend template format.
 *
 * Removes empty exercises
 * and strips workout-only fields.
 * @param {{
 *  name?: string,
 *  notes?: string,
 *  exercises?: Array,
 * }} template - Template state object
 * @returns {{
 *  name: string,
 *  notes: string,
 *  exercises: Array
 * }} Template payload
 */
export function buildTemplatePayload(
  template,
) {
  const exercises =
    template.exercises
      ?.map((ex) => ({
        ...serializeWorkoutExercise(ex),

        sets:
          ex.sets?.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })) || [],
      }))
      .filter((ex) => ex.sets.length > 0) || []

  return {
    name:
      template.name?.trim() ||
      'Template',

    notes:
      template.notes || '',

    exercises,
  }
}
