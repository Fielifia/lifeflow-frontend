import {
  useEffect,
  useState
} from 'react'
import { createTemplateApi } from '../../../shared/api/templateApi'
import {
  deleteWorkoutApi,
  getWorkoutByIdApi,
  updateWorkoutApi
} from '../../../shared/api/workoutApi'
import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'
import { buildWorkoutPayload } from '../../workout/utils/buildWorkoutPayload'
import { buildTemplatePayload } from '../../template/utils/buildTemplatePayload'

/**
 * Custom hook for editing workouts.
 * @param {string} workoutId - Workout ID.
 * @param {(path: string) => void} navigate - React Router navigate function.
 * @returns {object} Workout state and mutation handlers.
 */
export function useWorkoutManager(workoutId, navigate) {
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


        const data = await getWorkoutByIdApi(workoutId)

        setWorkout(data)
      } catch (err) {
        setError(err.response?.data?.error ||
          'CFailed to load workout',)
      } finally {
        setLoading(false)
      }
    }

    if (workoutId) fetchWorkout()
  }, [workoutId])


  // ===== MUTATION WRAPPERS =====
  const {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
    toggleSetComplete,
  } = useExerciseMutations(
    setWorkout,
  )


  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  // ===== SAVE =====
  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const payload =
        buildWorkoutPayload(
          workout,
          workout.duration,
        )

      const updated =
        await updateWorkoutApi(
          workoutId,
          payload,
        )

      setSuccess(true)

      navigate(`/workouts/${updated._id}`)
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

      const payload =
        buildTemplatePayload(workout)

      await createTemplateApi(payload)

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
  const deleteWorkout = async () => {
    const confirmed = window.confirm(
      'Delete this workout?',
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteWorkoutApi(workoutId)

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

    deleteWorkout,
  }
}
