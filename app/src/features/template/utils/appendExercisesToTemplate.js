import { buildTemplateExercise }
  from './buildTemplateExercise'

/**
 * Appends exercises to template state.
 * Builds template-ready exercises
 * and prevents duplicates.
 * @param {{
 *  exercises: object[],
 *  previousWorkout: object|null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >
 * }} params - Append exercise dependencies
 */
export async function appendExercisesToTemplate({
  exercises,
  lastWorkout,
  setTemplate,
}) {
  const results = exercises.map((ex) => {
    const previous =
      lastWorkout?.exercises?.find(
        (e) => e.id === ex.id,
      ) || null

    return buildTemplateExercise(
      ex,
      previous,
    )
  })

  setTemplate((prev) => ({
    ...prev,

    exercises: [
      ...prev.exercises,

      ...results.filter(
        (newEx) =>
          !prev.exercises.some(
            (existing) =>
              existing.id === newEx.id,
          ),
      ),
    ],
  }))
}
