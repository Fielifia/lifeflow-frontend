import { useEffect, useState } from 'react'
import API from '../../../shared/api/api'
import { deleteWorkout } from '../../../shared/api/workoutApi'
import { normalizeExercise } from '../../../shared/utils/normalizeExercise'
import { workoutMutation } from '../../../shared/utils/workoutMutations'
import { cleanWorkoutForSave } from '../../workout/utils/cleanWorkoutForSave'
import { saveWorkoutAsTemplate } from '../../workout/utils/workoutPersistence'

/**
 * Custom hook for editing workouts.
 * @param {string} workoutId - Workout ID.
 * @param {(path: string) => void} navigate - React Router navigate function.
 * @returns {object} Workout state and mutation handlers.
 */
export function useEditWorkoutLogic(workoutId, navigate) {
  // ===== STATE =====
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [isEditingName, setIsEditingName] = useState(false)

  // ===== LOAD WORKOUT =====
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true)
        const res = await API.get(`/workouts/${workoutId}`)

        const data = {
          ...res.data,
          exercises:
            res.data.exercises.map(
              normalizeExercise,
            ),
        }

        setWorkout(data)
      } catch (err) {
        setError('Failed to load workout')
      } finally {
        setLoading(false)
      }
    }

    if (workoutId) fetchWorkout()
  }, [workoutId])


  // ===== MUTATION WRAPPERS =====
  const addSet = (index) =>
    setWorkout((prev) => workoutMutation.addSet(prev, index))

  const updateSet = (exIndex, setIndex, field, value) =>
    setWorkout((prev) =>
      workoutMutation.updateSet(prev, exIndex, setIndex, field, value),
    )

  const removeSet = (exIndex, setIndex) =>
    setWorkout((prev) => workoutMutation.removeSet(prev, exIndex, setIndex))

  const removeExercise = (index) =>
    setWorkout((prev) => workoutMutation.removeExercise(prev, index))

  const updateExerciseRest = (index, value) =>
    setWorkout((prev) => workoutMutation.updateExerciseRest(prev, index, value))

  const updateExerciseNotes = (index, notes) =>
    setWorkout((prev) =>
      workoutMutation.updateExerciseNotes(prev, index, notes),
    )

  const toggleSetComplete = (exIndex, setIndex, checked) => {
    setWorkout((prev) => {
      const exercises = prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) =>
            j === setIndex ? { ...set, completed: checked } : set,
          ),
        }
      })

      const updated = { ...prev, exercises }
      return updated
    })
  }

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  // ===== SAVE =====
  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const cleaned = cleanWorkoutForSave(workout)

      if (!cleaned.length) {
        setError('Complete at least one set')
        return
      }

      const payload = {
        name: workout.name?.trim() || 'Workout',
        notes: workout.notes ?? '',
        duration: workout.duration ?? 0,
        exercises: cleaned.map((ex) => ({
          ...ex,
          rest: ex.restTime,
        })),
      }

      const res = await API.put(`/workouts/${workoutId}`, payload)

      setSuccess(true)

      navigate(`/workouts/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update workout')
    } finally {
      setSaving(false)
    }
  }

  // ===== SAVE AS TEMPLATE =====
  const saveAsTemplate = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      await saveWorkoutAsTemplate({
        workout,
      })

      setSuccess(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not save template',
      )
    } finally {
      setSaving(false)
    }
  }

  // ===== DELETE =====
  const deleteCurrentWorkout = async () => {
    const confirmed = window.confirm(
      'Delete this workout?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteWorkout(workoutId)

      navigate('/history')
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not delete workout',
      )
    }
  }

  return {
    workout,
    setWorkout,

    loading,
    saving,
    success,
    error,

    isEditingName,
    setIsEditingName,

    // openLibrary,
    addSet,
    updateSet,
    removeSet,

    removeExercise,
    toggleSetComplete,

    updateExerciseRest,
    updateExerciseNotes,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,

    deleteCurrentWorkout,
  }
}
