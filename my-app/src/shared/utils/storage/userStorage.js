import { safeStorage } from './storage'

/**
 * Storage helper for authenticated user data.
 */
export const userStorage = {
  /**
   * Gets stored user session.
   * @returns {object|null} User data or null
   */
  get() {
    return safeStorage.get('user')
  },

  /**
   * Saves user session.
   * @param {object} user - User data
   */
  set(user) {
    safeStorage.set('user', user)
  },

  /**
   * Clears stored user session.
   */
  clear() {
    safeStorage.remove('user')
  },
}
