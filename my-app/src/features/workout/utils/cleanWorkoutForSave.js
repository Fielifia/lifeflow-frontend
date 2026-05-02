export const cleanWorkoutForSave = (workout) => {
  return workout.exercises
    .map((ex) => ({
      ...ex,
      sets: ex.sets.filter((s) => s.completed),
    }))
    .filter((ex) => ex.sets.length > 0)
}
