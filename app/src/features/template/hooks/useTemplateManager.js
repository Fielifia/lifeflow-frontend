import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  createTemplateApi,
  deleteTemplateApi,
  getTemplateByIdApi,
  updateTemplateApi,
} from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { appendExercisesToTemplate } from '../utils/appendExercisesToTemplate'

import { draftTemplateStorage } from '../../../shared/utils/storage/draftStorage'

import { buildTemplatePayload } from '../utils/buildTemplatePayload'

const EMPTY_TEMPLATE = {
  name: 'Template',
  exercises: [],
  notes: '',
}

/**
 * Handles template creation, editing,
 * exercise flow and template persistence.
 * @param {(path: string) => void} navigate
 * React Router navigation function.
 * @param {string | undefined} id
 * Template id for edit mode.
 * @returns {{
 *  template: object | null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object | null>
 *  >,
 *  loading: boolean,
 *  saving: boolean,
 *  success: boolean,
 *  error: string,
 *  isEditingName: boolean,
 *  setIsEditingName: import('react').Dispatch<
 *    import('react').SetStateAction<boolean>
 *  >,
 *  openLibrary: () => void,
 *  exerciseActions: object,
 *  updateTemplateNotes: (
 *    notes: string
 *  ) => void,
 *  hasUnsavedChanges: boolean,
 *  saveTemplate: () => Promise<void>,
 *  discardTemplate: () => void,
 *  discardChanges: () => void,
 *  deleteTemplate: () => Promise<void>,
 * }}
 * Template manager state/actions.
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
            stored?.name?.trim()
            || 'Template',

          exercises:
            stored?.exercises || [],

          notes:
            stored?.notes || '',
        }
      } catch {
        return EMPTY_TEMPLATE
      }
    })

  const [
    originalTemplate,
    setOriginalTemplate,
  ] = useState(null)

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

  // ===== INITIAL SNAPSHOT =====

  useEffect(() => {
    if (
      !originalTemplate &&
      template
    ) {
      setOriginalTemplate(
        structuredClone(template),
      )
    }
  }, [
    template,
    originalTemplate,
  ])

  // ===== LOAD TEMPLATE =====

  useEffect(() => {
    if (isCreate) {
      return
    }

    if (
      editingTemplate &&
      editingTemplate._id === id
    ) {
      setTemplate(editingTemplate)

      setOriginalTemplate(
        JSON.parse(JSON.stringify(editingTemplate)),
      )

      setLoading(false)

      return
    }

    const fetchTemplate =
      async () => {
        try {
          setLoading(true)

          const data =
            await getTemplateByIdApi(
              id,
            )

          setTemplate(data)

          setOriginalTemplate(
            structuredClone(data),
          )
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
    editingTemplate,
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

  // ===== KEEP EDIT CACHE UPDATED =====

  useEffect(() => {
    if (
      isCreate ||
      !template
    ) {
      return
    }

    setEditingTemplate(template)
  }, [
    template,
    isCreate,
    setEditingTemplate,
  ])

  // ===== UNSAVED CHANGES =====

  const hasUnsavedChanges =
    !template
    && !originalTemplate
    && JSON.stringify(template)
    !== JSON.stringify(
      originalTemplate,
    )

  // ===== OPEN LIBRARY =====

  const openLibrary = () => {
    setReturnTo(
      location.pathname,
    )

    navigate(
      '/exercises?select=true',
    )
  }

  // ===== EXERCISE MUTATIONS =====

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

  const exerciseActions = {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
  }

  // ===== NOTES =====

  const updateTemplateNotes = (
    notes,
  ) =>
    setTemplate((prev) => ({
      ...prev,
      notes,
    }))

  // ===== SAVE =====

  const saveTemplate =
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
          const created =
            await createTemplateApi(
              payload,
            )

          draftTemplateStorage.clear()

          navigate(
            `/templates/${created._id}`,
          )
        } else {
          await updateTemplateApi(
            id,
            payload,
          )

          setEditingTemplate(null)

          navigate(
            `/templates/${id}`,
          )
        }

        setSuccess(true)
      } catch (err) {
        setError(
          err.message
          || err.response?.data?.error
          || 'Could not save template',
        )
      } finally {
        setSaving(false)
      }
    }

  // ===== DISCARD CREATE =====

  const discardTemplate = () => {
    const confirmed =
      window.confirm(
        'Discard template?',
      )

    if (!confirmed) {
      return
    }

    draftTemplateStorage.clear()

    navigate('/workouts')
  }

  // ===== DISCARD EDIT =====

  const discardChanges = () => {
    if (!originalTemplate) {
      return
    }

    const confirmed =
      window.confirm(
        'Discard all changes?',
      )

    if (!confirmed) {
      return
    }

    setTemplate(
      structuredClone(
        originalTemplate,
      ),
    )

    setIsEditingName(false)
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
          err.response?.data?.error
          || 'Could not delete template',
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

    exerciseActions,

    updateTemplateNotes,

    hasUnsavedChanges,

    saveTemplate,

    discardTemplate,
    discardChanges,

    deleteTemplate,
  }
}
