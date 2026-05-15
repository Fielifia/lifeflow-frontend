import { workoutMutation } from '../utils/workoutMutations'

/**
 * Shared exercise mutation handlers.
 * @param {import('react').Dispatch<
 *  import('react').SetStateAction<object>
 * >} setState - React state setter
 * @param {{
 *  onSetCompleted?: (rest: number) => void
 * }} [options] - Optional mutation callbacks
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
    setState((prev) => {
      const rest =
        prev.exercises[exIndex]?.restTime || 0

      if (checked && onSetCompleted) {
        onSetCompleted(rest)
      }

      return workoutMutation.toggleSetComplete(
        prev,
        exIndex,
        setIndex,
        checked,
      )
    })
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
