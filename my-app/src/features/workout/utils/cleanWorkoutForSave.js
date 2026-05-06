export const cleanWorkoutForSave = (workout) => {
  return workout.exercises
    .map((ex) => ({
      ...ex,
      rest: ex.restTime, // 🔥 FIX
      sets: ex.sets.filter((s) => s.completed),
    }))
    .filter((ex) => ex.sets.length > 0)
}
