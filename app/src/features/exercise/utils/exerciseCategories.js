/**
 * Available exercise categories grouped by type.
 * @type {{
 *  BASE: Array<string>,
 *  SPECIAL: Array<string>,
 * }}
 */
export const CATEGORIES = {
  BASE: ['Chest', 'Core', 'Back', 'Arms', 'Legs', 'Shoulders'],
  SPECIAL: ['Mobility'],
}

/**
 * Display order for exercise categories.
 * @type {Array<string>}
 */
export const CATEGORY_ORDER = [
  'Arms',
  'Back',
  'Chest',
  'Core',
  'Legs',
  'Shoulders',
  'Mobility',
]

/**
 * Supported exercise equipment options.
 * @type {Array<string>}
 */
export const equipmentList = [
  'Bands',
  'Body Weight',
  'Barbell',
  'Dumbbell',
  'Machine',
  'Other',
]
