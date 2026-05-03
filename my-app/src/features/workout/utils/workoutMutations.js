/**
 * Pure functions for mutating workout state.
 * No side effects, no React.
 */

export const workoutMutation = {
  addSet(workout, index) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== index) return ex

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

  updateSet(workout, exIndex, setIndex, field, value) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set
            return { ...set, [field]: value }
          }),
        }
      }),
    }
  },

  removeSet(workout, exIndex, setIndex) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) return ex
        if (ex.sets.length === 1) return ex

        return {
          ...ex,
          sets: ex.sets.filter((_, j) => j !== setIndex),
        }
      }),
    }
  },

  removeExercise(workout, index) {
    return {
      ...workout,
      exercises: workout.exercises.filter((_, i) => i !== index),
    }
  },

  toggleSetComplete(workout, exIndex, setIndex, checked) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set
            return { ...set, completed: checked }
          }),
        }
      }),
    }
  },

  updateExerciseRest(workout, index, value) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, i) => {
        if (i !== index) return ex
        return { ...ex, restTime: value }
      }),
    }
  },
}
