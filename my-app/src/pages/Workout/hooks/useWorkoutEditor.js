import { useState, useEffect } from 'react'

/**
 *
 * @param initial
 */
export function useWorkoutEditor(initial = {}) {
  const [workout, setWorkout] = useState(() => {
    const saved = localStorage.getItem('draftWorkout')
    if (saved) return JSON.parse(saved)

    return {
      name: initial.name || '',
      exercises: initial.exercises || [],
      notes: initial.notes || '',
    }
  })

  useEffect(() => {
    localStorage.setItem('draftWorkout', JSON.stringify(workout))
  }, [workout])

  const addExercise = (exercise) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }))
  }

  const removeExercise = (index) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }

  const addSet = (exIndex) => {
    setWorkout((prev) => {
      const updated = [...prev.exercises]

      updated[exIndex].sets = updated[exIndex].sets || []
      updated[exIndex].sets.push({ reps: 0, weight: 0, completed: false })

      return { ...prev, exercises: updated }
    })
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    setWorkout((prev) => {
      const updated = [...prev.exercises]
      updated[exIndex].sets[setIndex][field] = value
      return { ...prev, exercises: updated }
    })
  }

  const removeSet = (exIndex, setIndex) => {
    setWorkout((prev) => {
      const updated = [...prev.exercises]
      updated[exIndex].sets = updated[exIndex].sets.filter(
        (_, i) => i !== setIndex,
      )
      return { ...prev, exercises: updated }
    })
  }

  const updateName = (name) => setWorkout((prev) => ({ ...prev, name }))

  const updateNotes = (notes) => setWorkout((prev) => ({ ...prev, notes }))

  return {
    workout,
    setWorkout,
    addExercise,
    removeExercise,
    addSet,
    removeSet,
    updateSet,
    updateName,
    updateNotes,
  }
}
