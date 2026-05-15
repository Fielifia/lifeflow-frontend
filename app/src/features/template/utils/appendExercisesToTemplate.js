import { buildTemplateExercise }
  from './buildTemplateExercise'

/**
 * Appends exercises to template state.
 *
 * Builds template-ready exercises
 * and appends them to template state.
 * @param {{
 *  exercises: object[],
 *  lastWorkout: object|null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >
 * }} params - Append exercise dependencies
 */
export async function appendExercisesToTemplate({ exercises, lastWorkout, setTemplate }) {
  const results = exercises.map((ex) => {
    const previous =
      lastWorkout?.exercises?.find(
        (e) => e.exerciseId === ex.id
      ) || null

    return buildTemplateExercise(ex, previous)
  })

  setTemplate((prev) => {
    if (!prev) return prev

    const newResults = results.filter(
      (newEx) =>
        !prev.exercises.some(
          (existing) => existing.exerciseId === newEx.exerciseId
        )
    )

    return {
      ...prev,
      exercises: [...prev.exercises, ...newResults],
    }
  })
}
