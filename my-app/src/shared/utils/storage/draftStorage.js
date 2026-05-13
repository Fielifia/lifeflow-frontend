import { safeStorage } from './storage'

/**
 * Storage helper for workout drafts.
 */
export const draftWorkoutStorage = {
  /**
   * Gets saved workout draft.
   * @returns {object|null} Workout draft or null
   */
  get() {
    return safeStorage.get('draftWorkout')
  },

  /**
   * Saves workout draft.
   * @param {object} data - Workout draft data
   */
  set(data) {
    safeStorage.set('draftWorkout', data)
  },

  /**
   * Removes workout draft.
   */
  clear() {
    safeStorage.remove('draftWorkout')
  },
}

/**
 * Storage helper for template drafts.
 */
export const draftTemplateStorage = {
  /**
   * Gets saved template draft.
   * @returns {object|null} Template draft or null
   */
  get() {
    return safeStorage.get('draftTemplate')
  },

  /**
   * Saves template draft.
   * @param {object} data - Template draft data
   */
  set(data) {
    safeStorage.set('draftTemplate', data)
  },

  /**
   * Removes template draft.
   */
  clear() {
    safeStorage.remove('draftTemplate')
  },
}
