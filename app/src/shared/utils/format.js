/**
 * Shared formatting utilities for workout,
 * exercise and statistics UI.
 */

/**
 * Capitalizes each word in a string.
 * Returns an empty string if input is missing.
 * @param {string} str - Input string
 * @returns {string} Formatted string
 */
export function formatName(str) {
  if (!str) {
    return ''
  }

  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats a label string by capitalizing each word.
 * @param {string} str - Label string
 * @returns {string} Formatted label
 */
export function formatLabel(str) {
  return formatName(str)
}

/**
 * Formats workout duration.
 * Shows minutes under 2 hours,
 * otherwise hours + minutes.
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

/**
 * Formats numbers using locale separators.
 * @param {number} value - Numeric value
 * @returns {string} Formatted number
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value || 0)
}

/**
 * Formats weight values using compact units.
 * @param {number} kg - Weight value in kilograms
 * @returns {string} Formatted weight
 */
export function formatWeight(kg) {
  if (!kg) {
    return '0 kg'
  }

  if (kg >= 1000000000) {
    return `${(kg / 1000000000).toFixed(1)}B kg`
  }

  if (kg >= 1000000) {
    return `${(kg / 1000000).toFixed(1)}M kg`
  }

  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}k kg`
  }

  return `${kg} kg`
}

/**
 * Formats workout date into relative text.
 * @param {string|Date} date - Workout date
 * @returns {string} Formatted relative date
 */
export function formatDate(date) {
  if (!date) {
    return ''
  }

  const workoutDate = new Date(date)

  const today = new Date()
  const yesterday = new Date()

  yesterday.setDate(today.getDate() - 1)

  const isToday =
    workoutDate.toDateString() === today.toDateString()

  const isYesterday =
    workoutDate.toDateString() === yesterday.toDateString()

  if (isToday) {
    return 'Today'
  }

  if (isYesterday) {
    return 'Yesterday'
  }

  const diffTime =
    today.getTime() - workoutDate.getTime()

  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 1) {
    return '1 day ago'
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  return workoutDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
