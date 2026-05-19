/**
 * Checks whether a workout/template
 * contains meaningful user changes.
 * @param {{
 *  name?: string,
 *  notes?: string,
 *  exercises?: Array
 * }} item
 * Workout or template object
 * @param {string} defaultName
 * Default fallback name
 * @returns {boolean}
 * True if object contains meaningful content
 */
export function hasMeaningfulContent(
  item,
  defaultName,
) {
  return (
    item?.name !== defaultName
    || item?.notes?.trim()
    || item?.exercises?.length > 0
  )
}
