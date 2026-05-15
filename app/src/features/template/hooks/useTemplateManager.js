import {
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

import {
  createTemplateApi,
  getTemplateByIdApi,
  updateTemplateApi,
  deleteTemplateApi,
} from '../../../shared/api/templateApi'

import { useExerciseFlow }
  from '../../../shared/context/ExerciseFlowContext'

import { useExerciseMutations }
  from '../../../shared/hooks/useExerciseMutations'

import { draftTemplateStorage }
  from '../../../shared/utils/storage/draftStorage'

import { appendExercisesToTemplate }
  from '../utils/appendExercisesToTemplate'

import { buildTemplatePayload }
  from '../utils/buildTemplatePayload'

/**
 * Handles template creation and editing logic.
 * @param {(path: string, options?: object) => void} navigate
 * @param {string | undefined} id
 * @returns {object}
 */
export function useTemplateManager(
  navigate,
  id,
) {
  const location = useLocation()

  const isCreate = !id

  // ===== STATE =====

  const [template, setTemplate] =
    useState(() => {
      if (!isCreate) {
        return null
      }

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

    editingTemplate,
    setEditingTemplate,
  } = useExerciseFlow()

  // ===== LOAD TEMPLATE =====

  useEffect(() => {
    if (isCreate) {
      return
    }

    // använd edit-state om det redan finns
    if (
      editingTemplate &&
      editingTemplate._id === id
    ) {
      setTemplate(editingTemplate)
      setLoading(false)
      return
    }

    const fetchTemplate =
      async () => {
        try {
          setLoading(true)

          const data =
            await getTemplateByIdApi(id)

          setTemplate(data)

          // spara EN gång
          setEditingTemplate(data)
        } catch {
          setError(
            'Could not load template',
          )
        } finally {
          setLoading(false)
        }
      }

    fetchTemplate()
  }, [
    id,
    isCreate,
  ])

  // ===== SAVE DRAFT =====

  useEffect(() => {
    if (!isCreate || !template) {
      return
    }

    draftTemplateStorage.set(
      template,
    )
  }, [
    template,
    isCreate,
  ])

  // ===== ADD FROM LIBRARY =====

  useEffect(() => {
    if (
      !selectedExercises?.length
    ) {
      return
    }

    appendExercisesToTemplate({
      exercises:
        selectedExercises,

      setTemplate,
    })

    setSelectedExercises([])
  }, [
    selectedExercises,
    setSelectedExercises,
  ])

  // ===== KEEP EDIT STATE UPDATED =====

  useEffect(() => {
    if (
      isCreate ||
      !template
    ) {
      return
    }

    // undvik loop
    if (
      editingTemplate === template
    ) {
      return
    }

    setEditingTemplate(template)
  }, [
    template,
  ])

  // ===== OPEN LIBRARY =====

  const openLibrary = () => {
    setReturnTo(
      location.pathname,
    )

    navigate(
      '/exercises?select=true',
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

        const payload =
          buildTemplatePayload(
            template,
          )

        if (isCreate) {
          await createTemplateApi(
            payload,
          )

          draftTemplateStorage.clear()
        } else {
          await updateTemplateApi(
            id,
            payload,
          )

          // clear edit cache
          setEditingTemplate(
            null,
          )
        }

        setSuccess(true)
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

  const deleteTemplate =
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

        await deleteTemplateApi(
          id,
        )

        setEditingTemplate(null)

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
    deleteTemplate,
  }
}
