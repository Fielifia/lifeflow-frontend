/**
 * Calculates muscle group distribution for a workout.
 *
 * @param {object} workout - Workout object
 * @returns {Array<{ muscle: string, percentage: number, sets: number }>} - Muscle split
 */
export function calculateWorkoutMuscleSplit(workout) {
  if (!workout?.exercises) return []

  const muscleMap = {}

  workout.exercises.forEach((ex) => {
    const muscle = ex.primaryMuscles?.[0] || 'Other'
    const setCount = ex.sets?.length || 0

    muscleMap[muscle] = (muscleMap[muscle] || 0) + setCount
  })

  const totalSets = Object.values(muscleMap).reduce((sum, val) => sum + val, 0)

  return Object.entries(muscleMap).map(([muscle, sets]) => ({
    muscle,
    sets,
    percentage: Math.round((sets / totalSets) * 100),
  }))
}
