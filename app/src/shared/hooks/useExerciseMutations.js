import { workoutMutation } from '../utils/workoutMutations'

/**
 * Shared exercise mutation handlers.
 * @param {import('react').Dispatch<
 *  import('react').SetStateAction<object>
 * >} setState - React state setter
 * @param {{
 *  onSetCompleted?: (rest: number) => void
 * }} [options] - Optional mutation callbacks
 * @returns {{
 *  addSet: (index: number) => void,
 *  updateSet: (
 *    exIndex: number,
 *    setIndex: number,
 *    field: string,
 *    value: number | ''
 *  ) => void,
 *  removeSet: (
 *    exIndex: number,
 *    setIndex: number
 *  ) => void,
 *  removeExercise: (index: number) => void,
 *  updateExerciseRest: (
 *    index: number,
 *    value: number
 *  ) => void,
 *  updateExerciseNotes: (
 *    index: number,
 *    notes: string
 *  ) => void,
 *  toggleSetComplete: (
 *    exIndex: number,
 *    setIndex: number,
 *    checked: boolean
 *  ) => void
 * }} Exercise mutation handlers
 */
export function useExerciseMutations(
  setState,
  options = {},
) {
  const {
    onSetCompleted,
  } = options

  // ===== MUTATIONS =====

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

  // ===== TOGGLE SET COMPLETION =====

  const toggleSetComplete = (
    exIndex,
    setIndex,
    checked,
  ) => {
    setState((prev) => {
      const rest =
        prev.exercises[exIndex]?.restTime || 0

      if (checked && onSetCompleted) {
        setTimeout(() => {
          onSetCompleted(rest)
        }, 0)
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
