/**
 * Helper to cache data
 */
export const cache = {
  get(key) {
    const value = localStorage.getItem(key)

    return value
      ? JSON.parse(value)
      : null
  },

  set(key, data) {
    localStorage.setItem(
      key,
      JSON.stringify({
        updatedAt: Date.now(),
        data,
      }),
    )
  },
}
