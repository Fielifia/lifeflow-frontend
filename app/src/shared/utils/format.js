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

const MUSCLE_LABELS = {
  abdominals: 'Abs',
  quadriceps: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  lats: 'Lats',
  traps: 'Traps',
  calves: 'Calves',
  shoulders: 'Shoulders',
  triceps: 'Triceps',
  biceps: 'Biceps',
  chest: 'Chest',
  forearms: 'Forearms',
  'upper arms': 'Upper Arms',
  'lower back': 'Lower Back',
}

/**
 * Formats muscle group names for UI display.
 * @param {string} muscle - Muscle group name
 * @returns {string} Formatted muscle label
 */
export function formatMuscle(muscle) {
  if (!muscle) {
    return 'Unknown'
  }

  const normalized = muscle.toLowerCase()

  return (
    MUSCLE_LABELS[normalized] ||
    formatName(muscle)
  )
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
 * Formats elapsed time in seconds.
 * @param {number} seconds - Elapsed seconds
 * @returns {string} Formatted time
 */
export function formatElapsedTime(seconds) {
  if (!seconds && seconds !== 0) {
    return '00:00'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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
 * Formats a timestamp into relative workout date text.
 * @param {string|Date} timestamp - Workout timestamp
 * @returns {string} Formatted relative date
 */
export function formatDate(timestamp) {
  if (!timestamp) {
    return ''
  }

  // ===== DATE REFERENCES =====

  const workoutDate = new Date(timestamp)

  const today = new Date()
  const yesterday = new Date()

  yesterday.setDate(today.getDate() - 1)

  // ===== RELATIVE DATES =====

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

  // ===== FALLBACK FORMAT =====

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

/**
 * Formats rest duration in seconds.
 * @param {number} seconds - Rest duration in seconds
 * @returns {string} Formatted rest duration
 */
export function formatRestTime(seconds) {
  if (!seconds && seconds !== 0) {
    return '0s'
  }

  if (seconds >= 60) {
    return seconds % 60 === 0
      ? `${seconds / 60} m`
      : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  return `${seconds}s`
}
