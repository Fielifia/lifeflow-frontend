import { STORAGE_KEYS } from '../constants'
import { safeStorage } from './safeStorage'

/**
 * Storage helper for workout drafts.
 */
export const draftWorkoutStorage = {
  /**
   * Gets saved workout draft.
   * @returns {object|null} Workout draft or null
   */
  get() {
    return safeStorage.get(STORAGE_KEYS.DRAFT_WORKOUT)
  },

  /**
   * Saves workout draft.
   * @param {object} data - Workout draft data
   */
  set(data) {
    safeStorage.set(STORAGE_KEYS.DRAFT_WORKOUT, data)
  },

  /**
   * Removes workout draft.
   */
  clear() {
    safeStorage.remove(STORAGE_KEYS.DRAFT_WORKOUT)
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
    return safeStorage.get(STORAGE_KEYS.DRAFT_TEMPLATE)
  },

  /**
   * Saves template draft.
   * @param {object} data - Template draft data
   */
  set(data) {
    safeStorage.set(STORAGE_KEYS.DRAFT_TEMPLATE, data)
  },

  /**
   * Removes template draft.
   */
  clear() {
    safeStorage.remove(STORAGE_KEYS.DRAFT_TEMPLATE)
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
    workout.exercises?.length > 0 ||
    workout.notes?.trim() ||
    workout.name &&
    workout.name !== 'Workout'
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
    template.exercises?.length > 0 ||
    template.notes?.trim() ||
      template.name &&
      template.name !== 'Template'
  )
}
