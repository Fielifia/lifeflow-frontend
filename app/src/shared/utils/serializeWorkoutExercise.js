/**
 * Serializes a frontend workout/template exercise into
 * backend/API format.
 * Handles conversion from:
 * - id -> exerciseId
 * - restTime -> rest
 * @param {object} ex - Frontend exercise object
 * @param {string} ex.id - Frontend exercise id
 * @param {string} ex.name - Exercise name
 * @param {string} [ex.muscle] - Primary muscle group
 * @param {string[]} [ex.images] - Exercise image array
 * @param {string} [ex.notes] - Exercise notes
 * @param {number} [ex.restTime] - Frontend rest time
 * @param {Array} [ex.sets] - Exercise sets
 * @returns {{
 *  exerciseId: string,
 *  name: string,
 *  muscle?: string,
 *  images: string[],
 *  notes: string,
 *  rest: number,
 *  sets: Array
 * }} Serialized backend exercise
 */
export function serializeWorkoutExercise(ex) {
  return {
    exerciseId:
      ex.exerciseId || ex.id,

    name: ex.name,

    muscle: ex.muscle,

    images: ex.images || [],

    notes: ex.notes || '',

    rest: ex.restTime ?? 0,

    sets: ex.sets || [],
  }
}
