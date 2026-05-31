import { normalizeExercise } from '../../../shared/utils/normalizeExercise'

import {
  DEFAULT_REST,
  DEFAULT_SETS,
} from '../../../shared/utils/constants/constants'

/**
 * Builds a template-ready exercise object.
 *
 * Adds:
 * - normalized frontend shape
 * - default rest time
 * - default template sets
 * - optional previous set values
 * @param {object} ex
 * Exercise data
 * @param {object|null} prev
 * Previous exercise data
 * @returns {object}
 * Template exercise
 */
export function buildTemplateExercise(
  ex,
  prev = null,
) {
  let sets =
    DEFAULT_SETS.map((set) => ({
      reps: set.reps,
      weight: set.weight,
    }))

  if (prev?.sets?.length) {
    sets = prev.sets.map((set) => ({
      reps: set.reps,
      weight: set.weight,
    }))
  } else if (ex.sets?.length) {
    sets = ex.sets.map((set) => ({
      reps: set.reps,
      weight: set.weight,
    }))
  }

  return {
    ...normalizeExercise(ex),

    restTime:
      ex.restTime ??
      prev?.restTime ??
      DEFAULT_REST,

    notes:
      ex.notes ??
      prev?.notes ??
      '',

    sets,
  }
}
