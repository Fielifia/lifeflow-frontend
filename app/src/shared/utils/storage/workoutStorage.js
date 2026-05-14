import { safeStorage } from './storage'

/**
 * Storage helper for completed workout history data.
 */
export const workoutStorage = {
  /**
   * Gets latest completed workout.
   * @returns {object|null} Workout data or null
   */
  getLastWorkout() {
    return safeStorage.get('lastWorkout')
  },

  /**
   * Saves latest completed workout.
   * @param {object} workout - Workout data
   */
  setLastWorkout(workout) {
    safeStorage.set('lastWorkout', workout)
  },
}
