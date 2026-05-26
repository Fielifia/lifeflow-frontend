import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { arrayMove } from '@dnd-kit/sortable'

import { createTemplateApi } from '../../../shared/api/templateApi'

import {
  deleteWorkoutApi,
  getWorkoutByIdApi,
  updateWorkoutApi,
} from '../../../shared/api/workoutApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useToast } from '../../../shared/context/ToastContext'

import { useConfirm } from '../../../shared/hooks/useConfirm'

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
 *  error: string | null,
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
 * 
 *    toggleSetComplete: (
 *      exIndex: number,
 *      setIndex: number,
 *      checked: boolean
 *    ) => void,
 * 
 *    reorderExercises: (
 *      oldIndex: number,
 *      newIndex: number
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
 *  saveAsTemplate: () => Promise<void>,
 *
 *  discardChanges: () => Promise<void>,
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

  const {
    selectedExercises,
    setSelectedExercises,

    editingWorkout,
    setEditingWorkout,

    setShouldRestoreScroll,
  } = useExerciseFlow()

  const toast = useToast()

  const confirm = useConfirm()

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

  // ===== HELPERS =====

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    )

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
    setShouldRestoreScroll(false)

    window.scrollTo(0, 0)

    setEditingWorkout(workout)

    setSelectedExercises([])

    navigate(
      `/exercises?select=true&flow=workout-edit&id=${id}`
    )
  }

  // ===== REORDER EXERCISES =====

  /**
   * Reorders exercises in workout state.
   * @param {number} oldIndex - Original exercise index.
   * @param {number} newIndex - Target exercise index.
   */
  const reorderExercises = (oldIndex, newIndex) => {
    setWorkout((prev) => ({
      ...prev,

      exercises: arrayMove(
        prev.exercises,
        oldIndex,
        newIndex,
      ),
    }))
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
    reorderExercises,
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

      toast.success('Workout saved')

      await delay(300)

      navigate(`/workouts/${updated._id}`)
    } catch (err) {
      setError('Could not update workout')
    } finally {
      setSaving(false)
    }
  }

  // ===== SAVE WORKOUT AS TEMPLATE =====

  const saveAsTemplate = async () => {
    try {
      setSaving(true)
      setError(null)

      await createTemplateApi(
        buildTemplatePayload(workout),
      )

      toast.success('Template created')

      await delay(300)

    } catch (err) {
      setError('Could not save template')
    } finally {
      setSaving(false)
    }
  }

  // ===== DISCARD CHANGES & RESTORE STATE (EDIT) =====

  const discardChanges = async () => {

    if (!originalRef.current) {
      return
    }

    const confirmed = await confirm({
      title: 'Discard changes?',
      description: 'Your edits will be lost.',
      confirmText: 'Discard',
    })

    if (!confirmed) {
      return
    }

    const restored =
      structuredClone(originalRef.current)

    setWorkout(restored)

    setEditingWorkout(restored)

    toast.success('Workout restored')

  }

  // ===== DELETE =====

  const deleteWorkout =
    async (workoutId = id) => {

      const confirmed = await confirm({
        title: 'Delete workout?',
        description: 'This cannot be undone.',
        confirmText: 'Delete',
        variant: 'danger',
      })

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

        toast.success('Workout deleted')

        await delay(300)

        return true
      } catch (err) {
        setError(err?.message || 'Could not delete workout')
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
    error,

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
