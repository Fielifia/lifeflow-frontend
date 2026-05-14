export function mapPreviousExercise(res) {
  if (!res?.sets?.length) return null

  return {
    sets: res.sets.map((s) => ({
      reps: s.reps,
      weight: s.weight,
      completed: false,
    })),
    bestSet: res.bestSet,
  }
}
