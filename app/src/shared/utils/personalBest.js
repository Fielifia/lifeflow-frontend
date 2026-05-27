/**
 * Checks whether a set is a new personal best.
 * @param {object} set - Current set
 * @param {{
 *  weight: number,
 *  reps: number
 * }} previousBest - Previous best set
 * @returns {boolean} True if set is a PB
 */
export function isPersonalBest(
  set,
  previousBest,
) {
  if (!set?.completed) {
    return false
  }

  return (
    set.weight > previousBest.weight ||
    (
      set.weight === previousBest.weight &&
      set.reps > previousBest.reps
    )
  )
}
