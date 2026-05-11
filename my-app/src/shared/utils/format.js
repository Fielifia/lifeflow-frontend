/**
 * Capitalizes each word in a string.
 * @param {string} str - The input string to format
 * @returns {string} The formatted string with capitalized words
 */
export function formatName(str) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats a label string by capitalizing each word.
 * Returns an empty string if input is undefined or empty.
 * @param {string} str - The label to format
 * @returns {string} The formatted label
 */
export function formatLabel(str) {
  if (!str) return ''

  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats workout duration.
 * Shows minutes under 2 hours,
 * otherwise hours + minutes.
 *
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export function formatDuration(minutes) {
  if (!minutes && minutes !== 0) {
    return '0 min'
  }

  if (minutes < 120) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return mins > 0
    ? `${hours}h ${mins}m`
    : `${hours}h`
}
