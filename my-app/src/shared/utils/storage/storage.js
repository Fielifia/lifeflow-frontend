/**
 * Safe wrapper around localStorage operations.
 * Handles JSON parsing and serialization.
 */
export const safeStorage = {
  /**
   * Retrieves and parses a value from localStorage.
   * @param {string} key - Storage key
   * @returns {unknown} Parsed value or null if missing/invalid
   */
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch {
      return null
    }
  },

  /**
   * Stores a serialized value in localStorage.
   * @param {string} key - Storage key
   * @param {unknown} value - Value to store
   */
  set(key, value) {
    localStorage.setItem(
      key,
      JSON.stringify(value),
    )
  },

  /**
   * Removes a value from localStorage.
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key)
  },
}
