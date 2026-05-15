import { normalizeWorkoutExercise }
  from '../../../shared/utils/normalizeWorkoutExercise'

import {
  DEFAULT_REST,
  DEFAULT_SETS,
} from '../constants'

/**
 * Builds a workout-ready exercise object.
 * Adds:
 * - normalized frontend shape
 * - previous set history
 * - historical PB
 * - completed state
 * - default sets/rest values
 * @param {object} ex - Exercise data
 * @param {object|null} prev - Previous workout data
 * @returns {object} Workout exercise
 */
export function buildWorkoutExercise(
  ex,
  prev = null,
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

    historicalBest = prev.bestSet
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
    ...normalizeWorkoutExercise(ex),

    restTime:
      ex.restTime ??
      prev?.restTime ??
      DEFAULT_REST,

    sets,

    historicalBest,
  }
}
