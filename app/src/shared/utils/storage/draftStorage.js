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

/**
 * Checks whether a workout draft contains meaningful data.
 * @param {object} workout - Workout draft
 * @returns {boolean} True if draft should be persisted
 */
export function hasWorkoutDraftContent(workout) {
  if (!workout) {
    return false
  }

  return (
    workout.exercises?.length > 0
    || workout.notes?.trim()
    || (
      workout.name
      && workout.name !== 'Workout'
    )
  )
}

/**
 * Checks whether a template draft contains meaningful data.
 * @param {object} template - Template draft
 * @returns {boolean} True if draft should be persisted
 */
export function hasTemplateDraftContent(template) {
  if (!template) {
    return false
  }

  return (
    template.exercises?.length > 0
    || template.notes?.trim()
    || (
      template.name
      && template.name !== 'Template'
    )
  )
}
