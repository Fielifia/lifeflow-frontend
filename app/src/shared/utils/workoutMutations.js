/**
 * Pure workout state mutation helpers.
 *
 * Handles immutable workout updates without
 * React state or side effects.
 *
 * Used by:
 * - workout run flow
 * - workout editing
 * - exercise mutations
 */
export const workoutMutation = {
  /**
   * Adds a new set to an exercise.
   * Copies the previous set values when available.
   * @param {object} workout - Workout state
   * @param {number} index - Exercise index
   * @returns {object} Updated workout
   */
  addSet(workout, index) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== index) {
          return ex
        }

        const last = ex.sets.at(-1)

        const newSet = last
          ? { ...last, completed: false }
          : { reps: 8, weight: 0, completed: false }

        return {
          ...ex,
          sets: [...ex.sets, newSet],
        }
      }),
    }
  },

  /**
   * Updates a single set field value.
   * @param {object} workout - Workout state
   * @param {number} exIndex - Exercise index
   * @param {number} setIndex - Set index
   * @param {string} field - Field to update
   * @param {string|number|boolean} value - New field value
   * @returns {object} Updated workout
   */
  updateSet(workout, exIndex, setIndex, field, value) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) {
          return ex
        }

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) {
              return set
            }

            return {
              ...set,
              [field]: value,
            }
          }),
        }
      }),
    }
  },

  /**
   * Removes a set from an exercise.
   * Prevents removing the final remaining set.
   * @param {object} workout - Workout state
   * @param {number} exIndex - Exercise index
   * @param {number} setIndex - Set index
   * @returns {object} Updated workout
   */
  removeSet(workout, exIndex, setIndex) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) {
          return ex
        }

        if (ex.sets.length === 1) {
          return ex
        }

        return {
          ...ex,
          sets: ex.sets.filter((_, j) => j !== setIndex),
        }
      }),
    }
  },

  /**
   * Removes an exercise from the workout.
   * @param {object} workout - Workout state
   * @param {number} index - Exercise index
   * @returns {object} Updated workout
   */
  removeExercise(workout, index) {
    return {
      ...workout,
      exercises: workout.exercises.filter((_, i) => i !== index),
    }
  },

  /**
   * Toggles set completion state.
   * @param {object} workout - Workout state
   * @param {number} exIndex - Exercise index
   * @param {number} setIndex - Set index
   * @param {boolean} checked - Completion state
   * @returns {object} Updated workout
   */
  toggleSetComplete(
    workout,
    exIndex,
    setIndex,
    checked,
  ) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) {
          return ex
        }

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) {
              return set
            }

            return {
              ...set,
              completed: checked,
            }
          }),
        }
      }),
    }
  },

  /**
   * Updates exercise rest timer value.
   * @param {object} workout - Workout state
   * @param {number} index - Exercise index
   * @param {number} value - Rest time in seconds
   * @returns {object} Updated workout
   */
  updateExerciseRest(workout, index, value) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== index) {
          return ex
        }

        return {
          ...ex,
          restTime: value,
        }
      }),
    }
  },

  /**
   * Updates exercise notes.
   * @param {object} workout - Workout state
   * @param {number} index - Exercise index
   * @param {string} notes - Exercise notes
   * @returns {object} Updated workout
   */
  updateExerciseNotes(workout, index, notes) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) =>
        i === index
          ? { ...ex, notes }
          : ex,
      ),
    }
  },
}
