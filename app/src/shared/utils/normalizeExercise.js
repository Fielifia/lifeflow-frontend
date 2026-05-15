/**
 * Normalizes workout/template exercise data into a consistent
 * frontend exercise shape used throughout the application.
 * Handles:
 * - id/exerciseId normalization
 * - image array normalization
 * - rest/restTime normalization
 * - default fallback values
 * @param {object} ex - Raw exercise object
 * @param {string} [ex.id] - Frontend exercise id
 * @param {string} [ex.exerciseId] - Backend exercise id
 * @param {string[]} [ex.images] - Exercise image array
 * @param {string} [ex.image] - Single exercise image
 * @param {number} [ex.restTime] - Frontend rest time
 * @param {number} [ex.rest] - Backend/API rest time
 * @param {string} [ex.notes] - Exercise notes
 * @param {Array} [ex.sets] - Exercise sets
 * @returns {{
 *  id: string,
 *  images: string[],
 *  restTime: number,
 *  notes: string,
 *  sets: Array
 * }} Normalized frontend exercise
 */
export function normalizeExercise(ex) {
  return {
    ...ex,

    id:
      ex.id || crypto.randomUUID(),

    exerciseId:
      ex.exerciseId || ex.id,

    images:
      ex.images?.length
        ? ex.images
        : ex.image
          ? [ex.image]
          : [],

    restTime: ex.restTime ?? ex.rest ?? 120,

    notes: ex.notes ?? '',

    sets: ex.sets || [],
  }
}
