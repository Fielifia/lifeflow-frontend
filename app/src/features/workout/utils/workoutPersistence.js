import API from '../../../shared/api/api'
import { buildTemplatePayload } from '../../template/utils/buildTemplatePayload'
import { cleanWorkoutForSave } from './cleanWorkoutForSave'

/**
 * Saves a completed workout session.
 *
 * Cleans workout data,
 * validates completed sets,
 * builds API payload,
 * and stores workout in backend.
 * @param {{
 *  workout: object,
 *  elapsed: number
 * }} params - Workout save data
 * @returns {Promise<object>} Saved workout
 */
export async function saveWorkoutSession({
  workout,
  elapsed,
}) {
  const cleaned =
    cleanWorkoutForSave(workout)

  if (!cleaned.length) {
    throw new Error(
      'Complete at least one set',
    )
  }

  const payload = {
    ...workout,

    name:
      workout.name?.trim() ||
      'Workout',

    exercises: cleaned,

    duration: elapsed,

    notes: workout.notes,
  }

  const res = await API.post(
    '/workouts',
    payload,
  )

  return res.data
}

/**
 * Saves current workout as template.
 *
 * Converts workout state into
 * template payload format
 * and stores it in backend.
 * @param {{
 *  workout: object
 * }} params - Template save data
 * @returns {Promise<object>} Saved template
 */
export async function saveWorkoutAsTemplate({
  workout,
}) {
  const template =
    buildTemplatePayload(workout)

  const res = await API.post(
    '/templates',
    template,
  )

  return res.data
}
