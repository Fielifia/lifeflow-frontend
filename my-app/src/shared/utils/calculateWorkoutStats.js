/**
 * Calculates summary statistics for a workout.
 * @param {object} workout - Workout object
 * @returns {{
 *   totalSets: number,
 *   totalReps: number,
 *   totalVolume: number,
 *   personalBests: number,
 * }} - Stats
 */
export function calculateWorkoutStats(workout) {
  if (!workout?.exercises) {
    return {
      totalSets: 0,
      totalReps: 0,
      totalVolume: 0,
    }
  }

  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0,
  )

  const totalReps = workout.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.reduce((repSum, set) => repSum + (Number(set.reps) || 0), 0),
    0,
  )

  const totalVolume = workout.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.reduce(
        (setSum, set) =>
          setSum + (Number(set.weight) || 0) * (Number(set.reps) || 0),
        0,
      ),
    0,
  )

  return {
    totalSets,
    totalReps,
    totalVolume,
    personalBests: workout.personalBests || 0,
  }
}
