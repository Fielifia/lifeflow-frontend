import { useEffect, useState } from 'react'
import {
  createTemplate,
  getTemplateById,
  updateTemplate,
} from '../../../shared/api/templateApi'
import { draftTemplateStorage } from '../../../shared/utils/storage/draftStorage'
import { workoutStorage } from '../../../shared/utils/storage/workoutStorage'
import { mapExerciseToTemplate } from '../../workout/utils/mapExerciseToWorkout'

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
 * - Receives selected exercises via location.state
 * - Filters by mode to avoid conflicts with workout flow
 * @param {(path: string, options?: object) => void} navigate - Navigation function from react-router
 * @param {{ state?: object, pathname: string }} location - Current route location object
 * @param {string | undefined} id - Template ID (undefined in create mode)
 * @returns {{
 *  template: {
 *    name: string,
 *    exercises: Array<{
 *      exerciseId: string,
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
export function useTemplateLogic(navigate, location, id) {
  const isCreate = !id
  const [loading, setLoading] = useState(!isCreate)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  // ===== INIT TEMPLATE =====
  const [template, setTemplate] = useState(() => {
    let stored = null
    try {
      stored = draftTemplateStorage.get()
    } catch { }

    return {
      name: stored?.name?.trim() || 'My Template',
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
          exercises: data.exercises.map((ex) => ({
            ...ex,
            image: ex.images?.[0] || '',
            images: ex.images || [],
            restTime: ex.rest ?? 120,
            notes: ex.notes ?? '',
          })),
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
    const selected = location.state?.selectedExercises

    if (!selected?.length) return

    const lastWorkout = workoutStorage.getLastWorkout()

    const newExercises = selected.map((ex) => {
      const previous = lastWorkout?.exercises?.find(
        (e) => e.exerciseId === ex.id,
      )

      return mapExerciseToTemplate(ex, previous)
    })

    setTemplate((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        ...newExercises.filter(
          (ex) => !prev.exercises.some((e) => e.exerciseId === ex.exerciseId),
        ),
      ],
    }))

  }, [
    location.state?.selectedExercises,
    location.pathname,
    navigate,
  ])

  // ===== ACTIONS =====
  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        currentExercises: template.exercises,
        returnTo: location.pathname,
      },
    })
  }

  const updateExerciseNotes = (index, notes) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === index ? { ...ex, notes } : ex,
      ),
    }))
  }

  const addSet = (index) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== index) return ex

        const last = ex.sets.at(-1)

        return {
          ...ex,
          sets: [
            ...ex.sets,
            last
              ? { reps: last.reps, weight: last.weight }
              : { reps: 8, weight: 0 },
          ],
        }
      }),
    }))
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set

            return {
              ...set,
              [field]: value,
            }
          }),
        }
      }),
    }))
  }

  const removeExercise = (index) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }

  const removeSet = (exIndex, setIndex) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        if (ex.sets.length === 1) return ex

        return {
          ...ex,
          sets: ex.sets.filter((_, j) => j !== setIndex),
        }
      }),
    }))
  }

  const updateExerciseRest = (index, value) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== index) return ex

        return {
          ...ex,
          restTime: value,
        }
      }),
    }))
  }

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

      const cleaned = template.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        images: ex.images?.length ? ex.images : ex.image ? [ex.image] : [],
        notes: ex.notes || '',
        rest: ex.restTime || 0,
        sets: ex.sets.filter(
          (s) =>
            s.reps !== '' &&
            s.weight !== '' &&
            s.reps != null &&
            s.weight != null,
        ),
      }))

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
        name: 'My Template',
        exercises: [],
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
