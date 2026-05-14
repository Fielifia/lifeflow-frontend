/**
 * Maps an exercise to a workout format.
 * @param {object} ex - Exercise object
 * @param {object} previous - Previous workout exercise data (optional)
 * @returns {object} Workout exercise object
 */
export function mapExerciseToWorkout(ex, previous) {
  return {
    exerciseId: ex.id,
    name: ex.name,

    images: ex.images?.length
      ? ex.images
      : ex.image
        ? [ex.image]
        : previous?.images?.length
          ? previous.images
          : [],

    restTime: previous?.restTime ?? 60,

    sets: previous
      ? previous.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
        completed: false,
      }))
      : [
        { reps: 8, weight: 0, completed: false },
        { reps: 8, weight: 0, completed: false },
        { reps: 8, weight: 0, completed: false },
      ],

    notes: previous?.notes || '',
  }
}

/**
 * Maps an exercise to a template format.
 * @param {object} ex - Exercise object
 * @param {object} previous - Previous template exercise data (optional)
 * @returns {object} Template exercise object with structure:
 */
export function mapExerciseToTemplate(ex, previous) {
  return {
    exerciseId: ex.id,
    name: ex.name,
    image: ex.image,
    restTime: previous?.restTime ?? 120,
    notes: previous?.notes ?? '',
    sets: previous
      ? previous.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
      }))
      : [
        { reps: 8, weight: 0 },
        { reps: 8, weight: 0 },
      ],
  }
}
