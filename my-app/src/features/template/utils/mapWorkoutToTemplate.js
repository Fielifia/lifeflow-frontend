/**
 * Maps a workout to template format.
 * @param {object} workout  - Workout object
 * @returns {object} Template exercise object
 */
export const mapWorkoutToTemplate = (workout) => {
  if (!workout) return null

  return {
    name: workout.name?.trim() || 'Template',
    notes: workout.notes || '',
    exercises:
      workout.exercises?.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,

        images: ex.images?.length ? ex.images : ex.image ? [ex.image] : [],

        sets:
          ex.sets?.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })) || [],
      })) || [],
  }
}
