import { workoutMutation } from '../utils/workoutMutations'

/**
 * Shared exercise mutation handlers for
 * workout/template state.
 * @param {Function} setState - State updater
 * @returns {{
 *  addSet: Function,
 *  updateSet: Function,
 *  removeSet: Function,
 *  removeExercise: Function,
 *  updateExerciseRest: Function,
 *  updateExerciseNotes: Function
 * }}
 */
export function useExerciseMutations(setState) {
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

  return {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
  }
}
