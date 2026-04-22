/**
 *
 * @param str
 */
export function formatName(str) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 *
 * @param str
 */
export function formatLabel(str) {
  if (!str) return ''

  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
