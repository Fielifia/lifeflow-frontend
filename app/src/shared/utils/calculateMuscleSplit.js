/**
 * Calculates muscle group distribution for a workout.
 * @param {object} workout - Workout object
 * @returns {Array<{ muscle: string, percentage: number, sets: number }>} - Muscle group distribution
 */
export function calculateMuscleSplit(workout) {

  // ===== VALIDATION =====

  if (!workout?.exercises) return []

  // ===== MUSCLE AGGREGATION =====

  const muscleMap = {}

  workout.exercises.forEach((ex) => {
    const muscle =
      ex.muscle ||
      ex.primaryMuscles?.[0] ||
      ex.bodyPart ||
      'Other'
    const setCount = ex.sets?.length || 0

    muscleMap[muscle] = (muscleMap[muscle] || 0) + setCount
  })

  // ===== PERCENTAGE CALCULATION =====
  
  const totalSets = Object.values(muscleMap).reduce((sum, val) => sum + val, 0)

  return Object.entries(muscleMap).map(([muscle, sets]) => ({
    muscle,
    sets,
    percentage: Math.round((sets / totalSets) * 100),
  }))
}
