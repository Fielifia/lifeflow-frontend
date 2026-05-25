/**
 * Gets next incomplete exercise name.
 * @param {Array<object>} exercises - Workout exercises
 * @returns {string} Next exercise name or done text
 */
export function getCurrentExercise(exercises) {
  const nextExercise = exercises.find((ex) => {
    if (!ex.sets?.length) {
      return false
    }

    return !ex.sets.every((set) => set.completed)
  })

  return nextExercise ? nextExercise.name : 'Done ✔'
}
