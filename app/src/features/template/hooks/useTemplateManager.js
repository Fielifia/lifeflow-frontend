import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  deleteTemplate,
  getTemplateById,
} from '../../../shared/api/templateApi'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'
import { normalizeExercise } from '../../../shared/utils/normalizeExercise'
import { draftTemplateStorage } from '../../../shared/utils/storage/draftStorage'
import { workoutStorage } from '../../../shared/utils/storage/workoutStorage'
import { appendExercisesToTemplate } from '../utils/appendExercisesToTemplate'
import {
  saveTemplate,
  updateSavedTemplate,
} from '../utils/templatePersistence'

/**
 * Handles template creation and editing logic.
 *
 * Supports:
 * - create mode
 * - edit mode
 * - draft persistence
 * - adding exercises from library
 * - exercise mutations
 * - save/update/delete actions
 * @param {(path: string, options?: object) => void} navigate
 * Navigation function
 * @param {string | undefined} id
 * Template id in edit mode
 * @returns {{
 *  template: object,
 *  setTemplate: (
 *    updater: (prev: object) => object
 *  ) => void,
 *  loading: boolean,
 *  saving: boolean,
 *  success: boolean,
 *  error: string
 * }} Template manager state and actions
 */
export function useTemplateManager(
  navigate,
  id,
) {
  const location = useLocation()

  const isCreate = !id

  // ===== STATE =====
  const [loading, setLoading] =
    useState(!isCreate)

  const [saving, setSaving] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [error, setError] =
    useState('')

  const [
    isEditingName,
    setIsEditingName,
  ] = useState(false)

  const {
    selectedExercises,
    setSelectedExercises,
    setReturnTo,
  } = useExerciseFlow()

  // ===== INIT =====
  const [template, setTemplate] =
    useState(() => {
      try {
        const stored =
          draftTemplateStorage.get()

        return {
          name:
            stored?.name?.trim() ||
            'Template',

          exercises:
            stored?.exercises || [],

          notes:
            stored?.notes || '',
        }
      } catch {
        return {
          name: 'Template',
          exercises: [],
          notes: '',
        }
      }
    })

  // ===== SAVE DRAFT =====
  useEffect(() => {
    if (!isCreate) {
      return
    }

    draftTemplateStorage.set(template)
  }, [template, isCreate])

  // ===== LOAD TEMPLATE =====
  useEffect(() => {
    if (isCreate) {
      return
    }

    if (template.exercises.length > 0) {
      setLoading(false)
      return
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true)

        const data =
          await getTemplateById(id)

        setTemplate({
          ...data,

          exercises:
            data.exercises.map(
              normalizeExercise,
            ),
        })
      } catch {
        setError(
          'Could not load template',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isCreate])

  // ===== ADD FROM LIBRARY =====
  useEffect(() => {
    if (!selectedExercises?.length) {
      return
    }

    const lastWorkout =
      workoutStorage.getLastWorkout()

    appendExercisesToTemplate({
      exercises: selectedExercises,
      lastWorkout,
      setTemplate,
    })

    setSelectedExercises([])
  }, [
    selectedExercises,
    setSelectedExercises,
  ])

  // ===== OPEN LIBRARY =====
  const openLibrary = () => {
    setReturnTo(location.pathname)

    navigate('/exercises?select=true')
  }

  // ===== MUTATIONS =====
  const {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
  } = useExerciseMutations(
    setTemplate,
  )

  // ===== SAVE =====
  const saveCurrentTemplate =
    async () => {
      try {
        setSaving(true)
        setError('')
        setSuccess(false)

        if (isCreate) {
          await saveTemplate({
            template,
          })
        } else {
          await updateSavedTemplate({
            id,
            template,
          })
        }

        setSuccess(true)

        draftTemplateStorage.clear()

        navigate('/workouts')
      } catch (err) {
        setError(
          err.message ||
          err.response?.data?.error ||
          'Could not save template',
        )
      } finally {
        setSaving(false)
      }
    }

  // ===== DELETE =====
  const deleteCurrentTemplate =
    async () => {
      const confirmed =
        window.confirm(
          'Delete this template?',
        )

      if (!confirmed) {
        return
      }

      try {
        setError('')

        await deleteTemplate(id)

        navigate('/workouts')
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Could not delete template',
        )
      }
    }

  return {
    template,
    setTemplate,

    loading,
    saving,
    success,
    error,

    isEditingName,
    setIsEditingName,

    openLibrary,

    addSet,
    updateSet,
    removeSet,
    removeExercise,

    updateExerciseRest,
    updateExerciseNotes,

    saveCurrentTemplate,
    deleteCurrentTemplate,
  }
}
