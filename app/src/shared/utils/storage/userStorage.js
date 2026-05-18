import { STORAGE_KEYS } from '../constants'
import { safeStorage } from './safeStorage'

/**
 * Storage helper for authenticated user data.
 */
export const userStorage = {
  /**
   * Gets stored user session.
   * @returns {object|null} User data or null
   */
  get() {
    return safeStorage.get(STORAGE_KEYS.USER)
  },

  /**
   * Saves user session.
   * @param {object} user - User data
   */
  set(user) {
    safeStorage.set(STORAGE_KEYS.USER, user)
  },

  /**
   * Clears stored user session.
   */
  clear() {
    safeStorage.remove(STORAGE_KEYS.USER)
  },
}
