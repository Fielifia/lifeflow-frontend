import { formatName } from './format'

/**
 * Normalizes raw exercise data from the API into a consistent structure
 * used throughout the application.
 *
 * @param {Object} e - Raw exercise object from API
 * @param {string} e.id
 * @param {string} e.name
 * @param {string} e.bodyPart
 * @param {string} e.target
 * @param {string} e.equipment
 * @param {string[]} [e.images]
 * @param {string} [e.image]
 * @param {string} [e.gifUrl]
 * @param {string[]} [e.instructions]
 *
 * @returns {Object} Normalized exercise
 * @returns {string} returns.id
 * @returns {string} returns.name
 * @returns {string} returns.bodyPart
 * @returns {string} returns.category
 * @returns {string} returns.muscle
 * @returns {string} returns.equipment
 * @returns {string} returns.image
 * @returns {string[]} returns.images
 * @returns {string[]} returns.instructions
 */
export function normalizeExercise(e) {
  const bodyPart = mapBodyPart(e.bodyPart)

  return {
    id: e.id,
    name: formatName(e.name),
    bodyPart: formatName(bodyPart),
    muscle: formatName(getMuscle(e, bodyPart)),
    category: getCategory(e),
    equipment: formatName(e.equipment),
    image: getImage(e),
    images: e.images || [],
    instructions: e.instructions || [],
  }
}

/**
 * Returns a valid image URL for an exercise, falling back to a placeholder if needed.
 *
 * @param {Object} e - Exercise object
 * @param {string[]} [e.images] - Array of image URLs
 * @param {string} [e.image] - Single image URL
 * @param {string} [e.gifUrl] - GIF URL
 * @returns {string} Valid image URL
 */
function getImage(e) {
  return e.images?.[0] || e.image || e.gifUrl || '/placeholder.png'
}

/**
 * Maps raw API bodyPart values into normalized high-level groups.
 *
 * @param {string} bp - Raw bodyPart string from API
 * @returns {string} Normalized body part category
 */
function mapBodyPart(bp) {
  const val = bp?.toLowerCase()

  if (
    [
      'arms',
      'upper arms',
      'lower arms',
      'forearms',
      'triceps',
      'biceps',
    ].includes(val)
  )
    return 'Arms'

  if (
    [
      'legs',
      'upper legs',
      'lower legs',
      'hamstrings',
      'quadriceps',
      'calves',
      'glutes',
      'abductors',
      'adductors',
    ].includes(val)
  )
    return 'Legs'

  if (['core', 'abdominals'].includes(val)) return 'Core'

  if (['back', 'middle back', 'lower back', 'lats', 'traps'].includes(val))
    return 'Back'

  if (['chest', 'upper chest', 'middle chest', 'lower chest'].includes(val))
    return 'Chest'

  if (['shoulders', 'neck'].includes(val)) return 'Shoulders'

  return 'Other'
}

/**
 * Derives a logical category based on exercise name and equipment.
 *
 * @param {Object} e - Exercise object
 * @param {string} e.name - Exercise name
 * @param {string} e.equipment - Equipment used for the exercise
 * @returns {string} 'Strength', 'Mobility', or 'Bodyweight'
 */
function getCategory(e) {
  const name = e.name?.toLowerCase() || ''
  const equipment = e.equipment?.toLowerCase() || ''
  const muscle = e.target?.toLowerCase() || ''

  const strengthEquipment = [
    'barbell',
    'dumbbell',
    'kettlebell',
    'machine',
    'cable',
  ]

  const mobilityEquipment = ['body only', 'band', 'foam roller']

  const mobilityKeywords = ['stretch', 'mobility', 'foam roll', 'rolling']

  const ambiguousKeywords = ['rotation', 'twist', 'extension', 'flexion']

  const hasMobilityKeyword = mobilityKeywords.some((k) => name.includes(k))

  const hasAmbiguousKeyword = ambiguousKeywords.some((k) => name.includes(k))

  const isStrength = strengthEquipment.some((eq) => equipment.includes(eq))

  const isMobilityEquipment = mobilityEquipment.some((eq) =>
    equipment.includes(eq),
  )

  const isCoreExercise =
    muscle.includes('abdominals') ||
    muscle.includes('core') ||
    name.includes('crunch') ||
    name.includes('sit-up') ||
    name.includes('plank')

  // Mobility
  if (
    (hasMobilityKeyword && !isStrength) ||
    (hasAmbiguousKeyword &&
      isMobilityEquipment &&
      !isStrength &&
      !isCoreExercise)
  ) {
    return 'Mobility'
  }

  // Bodyweight
  if (equipment === 'body only') {
    return 'Bodyweight'
  }

  return 'Strength'
}

function getChestMuscle(e) {
  const name = e.name?.toLowerCase() || ''

  if (name.includes('incline') || name.includes('low')) return 'Upper Chest'
  if (name.includes('decline') || name.includes('pullover')) return 'Lower Chest'

  if (name.includes('upper chest')) return 'Upper Chest'
  if (name.includes('lower chest')) return 'Lower Chest'

  return 'Mid Chest'
}

function getMuscle(e, bodyPart) {
  if (bodyPart === 'Chest') {
    return getChestMuscle(e)
  }

  return e.target
}
