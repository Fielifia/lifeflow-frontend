import {
  useEffect,
  useRef,
  useState,
} from 'react'


import { createTemplateApi } from '../../../shared/api/templateApi'
import {
  deleteWorkoutApi,
  getWorkoutByIdApi,
  updateWorkoutApi,
} from '../../../shared/api/workoutApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { hasMeaningfulContent } from '../../../shared/utils/editorUtils'

import { appendExercisesToWorkout } from '../../workout/utils/appendExercisesToWorkout'

import { buildTemplatePayload } from '../../template/utils/buildTemplatePayload'

import { buildWorkoutPayload } from '../../workout/utils/buildWorkoutPayload'

/**
 * Handles workout editing,
 * persistence and exercise management.
 *
 * Responsibilities:
 * - loading existing workouts
 * - managing workout editor state
 * - handling exercise mutations
 * - temporary exercise library flow state
 * - save/discard/delete actions
 * - unsaved changes detection
 * @param {string} id
 * Workout id.
 * @param {(path: string, options?: object) => void} navigate
 * React Router navigation function.
 * @returns {{
 *  workout: object | null,
 *  setWorkout: import('react').Dispatch<
 *    import('react').SetStateAction<object | null>
 *  >,
 *
 *  loading: boolean,
 *  saving: boolean,
 *  success: boolean,
 *  error: string | null,
 *
 *  isEditingName: boolean,
 *  setIsEditingName: import('react').Dispatch<
 *    import('react').SetStateAction<boolean>
 *  >,
 *
 *  openLibrary: () => void,
 *
 *  exerciseActions: {
 *    addSet: (
 *      index: number
 *    ) => void,
 *
 *    updateSet: (
 *      exIndex: number,
 *      setIndex: number,
 *      field: string,
 *      value: string | number | boolean
 *    ) => void,
 *
 *    removeSet: (
 *      exIndex: number,
 *      setIndex: number
 *    ) => void,
 *
 *    removeExercise: (
 *      index: number
 *    ) => void,
 *
 *    updateExerciseRest: (
 *      index: number,
 *      value: number
 *    ) => void,
 *
 *    updateExerciseNotes: (
 *      index: number,
 *      notes: string
 *    ) => void,
 *  },
 *
 *  updateWorkoutNotes: (
 *    notes: string
 *  ) => void,
 *
 *  hasUnsavedChanges: boolean,
 *
 *  saveWorkout: () => Promise<void>,
 *
 *  discardChanges: () => void,
 *
 *  deleteWorkout: (
 *    workoutId?: string
 *  ) => Promise<boolean>,
 * }}
 * Workout manager state and actions.
 */
export function useWorkoutManager(
  id,
  navigate,
) {

  // ===== STATE =====

  const [workout, setWorkout] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState(null)

  const [success, setSuccess] =
    useState(false)

  const [
    isEditingName,
    setIsEditingName,
  ] = useState(false)

  const {
    selectedExercises,
    setSelectedExercises,

    editingWorkout,
    setEditingWorkout,
  } = useExerciseFlow()

  // ===== ORIGINAL SNAPSHOT =====

  const originalRef = useRef(null)

  // ===== CREATE SNAPSHOT =====

  useEffect(() => {
    if (
      workout &&
      !originalRef.current
    ) {
      originalRef.current =
        structuredClone(workout)
    }
  }, [
    workout,
  ])

  // ===== LOAD WORKOUT =====

  useEffect(() => {
    if (
      editingWorkout &&
      editingWorkout._id === id
    ) {
      setWorkout(editingWorkout)

      originalRef.current =
        structuredClone(editingWorkout)

      setLoading(false)

      return
    }

    const fetchWorkout = async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getWorkoutByIdApi(
            id,
          )

        setWorkout(data)

        originalRef.current =
          structuredClone(data)

        setEditingWorkout(data)
      } catch (err) {
        setError('Failed to load workout')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchWorkout()
    }
  }, [
    id,
    editingWorkout,
    setEditingWorkout,
  ])

  // ===== ADD FROM LIBRARY =====

  useEffect(() => {
    if (!selectedExercises?.length) {
      return
    }

    appendExercisesToWorkout({
      exercises: selectedExercises,
      setWorkout,
    })

    setSelectedExercises([])
  }, [
    selectedExercises,
    setSelectedExercises,
  ])

  // ===== UNSAVED CHANGES =====

  const hasUnsavedChanges =
    Boolean(
      workout &&
      originalRef.current &&
      hasMeaningfulContent(
        workout,
        'Workout',
      ) &&
      JSON.stringify(workout)
      !== JSON.stringify(
        originalRef.current,
      )
    )

  // ===== OPEN LIBRARY FLOW =====

  const openLibrary = () => {
    setEditingWorkout(workout)

    setSelectedExercises([])

    navigate(
      `/exercises?select=true&flow=workout-edit&id=${id}`
    )
  }

  // ===== MUTATIONS =====

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

  const exerciseActions = {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    toggleSetComplete,
    updateExerciseRest,
    updateExerciseNotes,
  }

  // ===== NOTES =====

  const updateWorkoutNotes = (
    notes,
  ) =>
    setWorkout((prev) => ({
      ...prev,
      notes,
    }))

  // ===== SAVE WORKOUT =====

  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      const payload =
        buildWorkoutPayload(
          workout,
          workout.duration,
          workout.startTime,
        )

      const updated =
        await updateWorkoutApi(
          id,
          payload,
        )

      setEditingWorkout(null)

      setSuccess(true)

      navigate(
        `/workouts/${updated._id}`,
      )
    } catch (err) {
      setError('Could not update workout')
    } finally {
      setSaving(false)
    }
  }

  // ===== SAVE WORKOUT AS TEMPLATE =====

  const saveAsTemplate =
    async () => {
      try {
        setSaving(true)
        setError(null)
        setSuccess(false)

        await createTemplateApi(
          buildTemplatePayload(
            workout,
          )
        )

        setSuccess(true)
      } catch (err) {
        setError('Could not save template')
      } finally {
        setSaving(false)
      }
    }


  // ===== DISCARD CHANGES & RESTORE STATE (EDIT) =====

  const discardChanges = () => {

    if (!originalRef.current) {
      return
    }

    const confirmed = window.confirm(
      'Discard all changes?',
    )

    if (!confirmed) {
      return
    }

    const restored =
      structuredClone(originalRef.current)

    setWorkout(restored)
    setEditingWorkout(restored)
    setIsEditingName(false)

  }

  // ===== DELETE =====

  const deleteWorkout =
    async (workoutId = id) => {
      const confirmed =
        window.confirm(
          'Delete this workout?',
        )

      if (!confirmed) {
        return false
      }

      try {
        setError(null)
        setSaving(true)

        await deleteWorkoutApi(
          workoutId,
        )

        setEditingWorkout(null)

        return true
      } catch (err) {
        setError('Could not delete workout')
        return false
      } finally {
        setSaving(false)
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

    openLibrary,

    exerciseActions,

    updateWorkoutNotes,

    hasUnsavedChanges,

    saveWorkout,
    saveAsTemplate,

    discardChanges,
    deleteWorkout,
  }
}
