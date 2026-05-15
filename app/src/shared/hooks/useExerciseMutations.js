import { workoutMutation } from '../utils/workoutMutations'

/**
 * Shared exercise mutation handlers.
 * @param {Function} setState
 * @param {{
 *  onSetCompleted?: (rest: number) => void
 * }} options
 */
export function useExerciseMutations(
  setState,
  options = {},
) {
  const {
    onSetCompleted,
  } = options

  const addSet = (index) =>
    setState((prev) =>
      workoutMutation.addSet(prev, index),
    )

  const updateSet = (
    exIndex,
    setIndex,
    field,
    value,
  ) =>
    setState((prev) =>
      workoutMutation.updateSet(
        prev,
        exIndex,
        setIndex,
        field,
        value,
      ),
    )

  const removeSet = (exIndex, setIndex) =>
    setState((prev) =>
      workoutMutation.removeSet(
        prev,
        exIndex,
        setIndex,
      ),
    )

  const removeExercise = (index) =>
    setState((prev) =>
      workoutMutation.removeExercise(prev, index),
    )

  const updateExerciseRest = (index, value) =>
    setState((prev) =>
      workoutMutation.updateExerciseRest(
        prev,
        index,
        value,
      ),
    )

  const updateExerciseNotes = (index, notes) =>
    setState((prev) =>
      workoutMutation.updateExerciseNotes(
        prev,
        index,
        notes,
      ),
    )

  const toggleSetComplete = (
    exIndex,
    setIndex,
    checked,
  ) => {
    let rest = 0

    setState((prev) => {
      rest =
        prev.exercises[exIndex]?.restTime || 0

      return workoutMutation.toggleSetComplete(
        prev,
        exIndex,
        setIndex,
        checked,
      )
    })

    if (checked && onSetCompleted) {
      onSetCompleted(rest)
    }
  }

  return {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
    toggleSetComplete,
  }
}
