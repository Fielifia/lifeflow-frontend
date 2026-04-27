export const workoutToTemplate = (workout) => {
  return {
    name: workout.name?.trim() || 'Template',
    notes: workout.notes || '',
    exercises: (workout.exercises || []).map((ex) => ({
      exerciseId: ex.exerciseId,
      name: ex.name,
      image: ex.image,
      sets: (ex.sets || []).map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
    })),
  }
}
