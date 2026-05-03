/**
 * Detects session personal bests (within current workout only)
 * @param {object} workout - Workout object
 * @returns {object} PB data per exercise
 */
export function detectPersonalBest(workout) {
  if (!workout?.exercises?.length) return {}

  const result = {}

  workout.exercises.forEach((ex) => {
    const completedSets = ex.sets?.filter((s) => s.completed)
    if (!completedSets.length) return

    let bestSet = null
    let maxWeight = 0
    let totalVolume = 0

    // reps per weight (för rep-PB inom passet)
    const repsByWeight = {}

    completedSets.forEach((s) => {
      // ===== MAX WEIGHT =====
      if (s.weight > maxWeight) {
        maxWeight = s.weight
      }

      // ===== BEST SET =====
      if (
        !bestSet ||
        s.weight > bestSet.weight ||
        (s.weight === bestSet.weight && s.reps > bestSet.reps)
      ) {
        bestSet = s
      }

      // ===== VOLUME =====
      totalVolume += s.weight * s.reps

      // ===== REPS PER WEIGHT =====
      if (!repsByWeight[s.weight]) {
        repsByWeight[s.weight] = 0
      }
      repsByWeight[s.weight] += s.reps
    })

    result[ex.exerciseId] = {
      bestSet,
      maxWeight,
      totalVolume,
      repsByWeight,
    }
  })

  return result
}
