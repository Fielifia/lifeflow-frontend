import { normalizeExercise } from '../../../shared/utils/normalizeExercise'

import {
  DEFAULT_REST,
  DEFAULT_SETS,
} from '../../../shared/utils/constants'

/**
 * Builds a normalized workout exercise object.
 *
 * Adds:
 * - normalized frontend shape
 * - previous set history
 * - historical PB
 * - completed state
 * - default sets/rest values
 * @param {object} ex - Exercise data
 * @param {object|null} prev - Previous workout data
 * @param {number} [defaultRestTime] - Default exercise rest time in seconds.
 * @param {{
 *  resetCompleted?: boolean
 * }} [options] - Build options
 * @returns {object} Normalized workout exercise
 */
export function buildWorkoutExercise(
  ex,
  prev = null,
  defaultRestTime,
  options = {},
) {
  const {
    resetCompleted = false,
  } = options

  let sets = DEFAULT_SETS.map((s) => ({ ...s }))

  let historicalBest = {
    weight: 0,
    reps: 0,
  }

  if (prev) {
    sets = prev.sets.map((s) => ({
      reps: s.reps,
      weight: s.weight,
      completed: false,
      prevReps: s.reps,
      prevWeight: s.weight,
    }))

    historicalBest = prev.bestSet || {
      weight: 0,
      reps: 0,
    }

  } else if (ex.sets?.length) {
    sets = ex.sets.map((s) => ({
      ...s,
      completed:
        resetCompleted
          ? false
          : (s.completed ?? false),
    }))
  }


  return {
    ...normalizeExercise(ex),

    restTime:
      defaultRestTime ??
      prev?.restTime ??
      ex.restTime ??
      DEFAULT_REST,

    sets,

    historicalBest,
  }
}
