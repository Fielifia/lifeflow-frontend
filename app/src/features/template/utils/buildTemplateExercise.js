
/**
 * Maps an exercise to a template format.
 * @param {object} ex - Exercise object
 * @param {object} previous - Previous template exercise data (optional)
 * @returns {object} Template exercise object with structure:
 */
export function buildTemplateExercise(ex, previous) {
  return {
    id: ex.id,
    name: ex.name,
    images:
      ex.images?.length
        ? ex.images
        : ex.image
          ? [ex.image]
          : [],
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
