import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  createTemplate,
  getTemplateById,
  updateTemplate,
} from '../../../shared/api/templateApi'
import { normalizeWorkoutExercise } from '../../../shared/utils/normalizeWorkoutExercise'
import { serializeWorkoutExercise } from '../../../shared/utils/serializeWorkoutExercise'
import { draftTemplateStorage } from '../../../shared/utils/storage/draftStorage'
import { workoutStorage } from '../../../shared/utils/storage/workoutStorage'
import { mapExerciseToTemplate } from '../../workout/utils/mapExerciseToWorkout'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { workoutMutation } from '../../workout/utils/workoutMutations'

/**
 * Hook for managing template creation and editing logic.
 *
 * Handles:
 * - Loading existing template (edit mode)
 * - Creating new template (create mode)
 * - Adding exercises from Exercise Library (via navigation state)
 * - Managing exercises, sets, and rest times
 * - Saving template (create or update)
 *
 * Supports navigation flow:
 * - Opens Exercise Library in select mode
 * - Receives selected exercises from ExerciseFlowContext
 * - Shares temporary flow state across pages
 * @param {(path: string, options?: object) => void} navigate - Navigation function from react-router
 * @param {string | undefined} id - Template ID (undefined in create mode)
 * @returns {{
 *  template: {
 *    name: string,
 *    exercises: Array<{
 *      id: string,
 *      name: string,
 *      images: string[],
 *      restTime: number,
 *      sets: Array<{ reps: number, weight: number }>
 *    }>
 *  },
 *  setTemplate: (updater: (prev: object) => object) => void,
 *  loading: boolean,
 *  saving: boolean,
 *  error: string,
 *  openLibrary: () => void,
 *  addSet: (index: number) => void,
 *  updateSet: (exIndex: number, setIndex: number, field: string, value: number) => void,
 *  removeExercise: (index: number) => void,
 *  removeSet: (exIndex: number, setIndex: number) => void,
 *  updateRest: (index: number, value: number) => void,
 *  save: () => Promise<void>
 * }} Template state and actions
 */
export function useTemplateLogic(navigate, id) {
  const location = useLocation()

  const isCreate = !id
  const [loading, setLoading] = useState(!isCreate)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const {
    selectedExercises,
    setSelectedExercises,

    setReturnTo,
  } = useExerciseFlow()

  // ===== INIT TEMPLATE =====
  const [template, setTemplate] = useState(() => {
    let stored = null
    try {
      stored = draftTemplateStorage.get()
    } catch { }

    return {
      name: stored?.name?.trim() || 'Template',
      exercises: stored?.exercises || [],
      notes: stored?.notes || '',
    }
  })

  // ===== SAVE DRAFT =====
  useEffect(() => {
    if (!isCreate) return
    draftTemplateStorage.set(template)
  }, [template, isCreate])

  // ===== LOAD (edit) =====
  useEffect(() => {
    if (isCreate) return

    if (template.exercises.length > 0) {
      setLoading(false)
      return
    }

    const fetch = async () => {
      try {
        const data = await getTemplateById(id)

        const normalized = {
          ...data,
          exercises: data.exercises.map(normalizeWorkoutExercise),
        }

        setTemplate(normalized)
      } catch {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isCreate])

  // ===== ADD FROM LIBRARY =====
  useEffect(() => {
    if (!selectedExercises?.length) {
      return
    }

    const lastWorkout = workoutStorage.getLastWorkout()

    const newExercises = selectedExercises.map((ex) => {
      const previous = lastWorkout?.exercises?.find(
        (e) => e.id === ex.id,
      )

      return mapExerciseToTemplate(ex, previous)
    })

    setTemplate((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        ...newExercises.filter(
          (ex) => !prev.exercises.some((e) => e.id === ex.id),
        ),
      ],
    }))

    setSelectedExercises([])
  }, [selectedExercises, setSelectedExercises])

  // ===== ACTIONS =====
  const openLibrary = () => {
    setReturnTo(location.pathname)

    navigate('/exercises?select=true')
  }

  const addSet = (index) =>
    setTemplate((prev) =>
      workoutMutation.addSet(prev, index),
    )

  const updateSet = (exIndex, setIndex, field, value) =>
    setTemplate((prev) =>
      workoutMutation.updateSet(
        prev,
        exIndex,
        setIndex,
        field,
        value,
      ),
    )

  const removeSet = (exIndex, setIndex) =>
    setTemplate((prev) =>
      workoutMutation.removeSet(prev, exIndex, setIndex),
    )

  const removeExercise = (index) =>
    setTemplate((prev) =>
      workoutMutation.removeExercise(prev, index),
    )

  const updateExerciseRest = (index, value) =>
    setTemplate((prev) =>
      workoutMutation.updateExerciseRest(prev, index, value),
    )

  const updateExerciseNotes = (index, notes) =>
    setTemplate((prev) =>
      workoutMutation.updateExerciseNotes(prev, index, notes),
    )

  const saveTemplate = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      if (!template.name.trim()) {
        setError('Template needs a name')
        return
      }

      if (!template.exercises.length) {
        setError('Add at least one exercise')
        return
      }

      const cleaned = template.exercises.map(serializeWorkoutExercise)

      const validExercises = cleaned.filter((ex) => ex.sets.length > 0)

      if (!validExercises.length) {
        setError('Each exercise needs at least one set')
        return
      }

      if (isCreate) {
        await createTemplate({
          ...template,
          name: template.name.trim(),
          exercises: validExercises,
        })
      } else {
        await updateTemplate(id, {
          ...template,
          name: template.name.trim(),
          exercises: validExercises,
        })
      }

      setSuccess(true)
      setError('')

      setTemplate({
        name: 'Template',
        exercises: [],
        notes: '',
      })

      setIsEditingName(false)

      draftTemplateStorage.clear()

      navigate('/workouts')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save template')
    } finally {
      setSaving(false)
    }
  }

  return {
    template,
    setTemplate,
    loading,
    saving,
    error,
    success,

    isEditingName,
    setIsEditingName,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    updateExerciseRest,
    updateExerciseNotes,
    saveTemplate,
  }
}
