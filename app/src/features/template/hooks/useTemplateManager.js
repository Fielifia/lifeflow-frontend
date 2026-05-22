import {
  useEffect,
  useRef,
  useState,
} from 'react'


import {
  createTemplateApi,
  deleteTemplateApi,
  getTemplateByIdApi,
  updateTemplateApi,
} from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { draftTemplateStorage, hasTemplateDraftContent } from '../../../shared/utils/storage/draftStorage'

import { EMPTY_TEMPLATE } from '../../../shared/utils/constants'

import { hasMeaningfulContent } from '../../../shared/utils/editorUtils'

import { appendExercisesToTemplate } from '../utils/appendExercisesToTemplate'

import { buildTemplatePayload } from '../utils/buildTemplatePayload'


/**
 * Handles template creation, editing,
 * exercise flow and template persistence.
 *
 * Responsibilities:
 * - loading existing templates
 * - managing local editor state
 * - handling add/remove/update exercise actions
 * - draft persistence for create flow
 * - temporary cross-page workflow state
 * - save/discard/delete actions
 * - unsaved changes detection
 * @param {string | undefined} id
 * Template id for edit mode.
 * @param {(path: string, options?: object) => void} navigate
 * React Router navigation function.
 * @returns {{
 *  template: object | null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object | null>
 *  >,
 *  loading: boolean,
 *  saving: boolean,
 *  success: boolean,
 *  error: string | null,
 *
 *  isEditingName: boolean,
 *  setIsEditingName: import('react').Dispatch<
 *    import('react').SetStateAction<boolean>
 *  >,
 *  openLibrary: () => void,
 *  exerciseActions: {
 *    addSet: (
 *      index: number
 *    ) => void,
 *    updateSet: (
 *      exIndex: number,
 *      setIndex: number,
 *      field: string,
 *      value: string | number | boolean
 *    ) => void,
 *    removeSet: (
 *      exIndex: number,
 *      setIndex: number
 *    ) => void,
 *    removeExercise: (
 *      index: number
 *    ) => void,
 *    updateExerciseRest: (
 *      index: number,
 *      value: number
 *    ) => void,
 *    updateExerciseNotes: (
 *      index: number,
 *      notes: string
 *    ) => void,
 *  },
 *  updateTemplateNotes: (
 *    notes: string
 *  ) => void,
 *  hasUnsavedChanges: boolean,
 *  saveTemplate: () => Promise<void>,
 *  discardTemplate: () => void,
 *  discardChanges: () => void,
 *  deleteTemplate: () => Promise<void>,
 * }}
 * Template manager state and actions.
 */
export function useTemplateManager(
  id,
  navigate,
) {

  const isCreate = !id

  // ===== STATE =====

  const [template, setTemplate] =
    useState(() => {
      if (!isCreate) {
        return null
      }

      return (
        draftTemplateStorage.get()
        || EMPTY_TEMPLATE
      )
    })

  const [loading, setLoading] =
    useState(!isCreate)

  const [saving, setSaving] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [error, setError] =
    useState(null)

  const [
    isEditingName,
    setIsEditingName,
  ] = useState(false)

  const {
    selectedExercises,
    setSelectedExercises,

    editingTemplate,
    setEditingTemplate,
  } = useExerciseFlow()

  // ===== ORIGINAL SNAPSHOT =====

  const originalRef = useRef(null)

  // ===== HELPERS =====

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    )

  // ===== CREATE SNAPSHOT =====

  useEffect(() => {
    if (
      isCreate &&
      template &&
      !originalRef.current
    ) {
      originalRef.current =
        structuredClone(template)
    }
  }, [
    isCreate,
    template,
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

      originalRef.current =
        structuredClone(editingTemplate)

      setLoading(false)

      return
    }

    const fetchTemplate =
      async () => {
        try {
          setLoading(true)
          setError(null)

          const data =
            await getTemplateByIdApi(
              id,
            )

          const normalized =
            structuredClone(data)

          setTemplate(normalized)

          originalRef.current =
            structuredClone(normalized)

        } catch {
          setError('Failed to load template')
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

    if (hasTemplateDraftContent(template)) {
      draftTemplateStorage.set(template)
    }
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

  // ===== UNSAVED CHANGES =====

  const hasUnsavedChanges =
    Boolean(
      template &&
      originalRef.current &&
      hasMeaningfulContent(
        template,
        'Template',
      ) &&
      JSON.stringify(template)
      !== JSON.stringify(
        originalRef.current,
      )
    )

  // ===== OPEN LIBRARY FLOW =====

  const openLibrary = () => {
    setEditingTemplate(template)

    if (isCreate) {
      navigate(
        '/exercises?select=true&flow=template-create'
      )

      return
    }

    navigate(
      `/exercises?select=true&flow=template-edit&id=${id}`
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
        setError(null)
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

          originalRef.current =
            structuredClone(template)

          setSuccess(true)

          await delay(700)

          navigate(
            `/templates/${created._id}`,
          )
        } else {
          await updateTemplateApi(
            id,
            payload,
          )

          originalRef.current =
            structuredClone(template)

          setEditingTemplate(null)

          setSuccess(true)

          await delay(700)

          navigate(
            `/templates/${id}`,
          )
        }
      } catch (err) {
        setError(
          isCreate
            ? 'Could not save template'
            : 'Could not update template',
        )
      } finally {
        setSaving(false)
      }
    }

  // ===== DISCARD TEMPLATE (CREATE) =====

  const discardTemplate = () => {

    const confirmed =
      window.confirm(
        'Discard template?',
      )

    if (!confirmed) {
      return
    }

    setTemplate(EMPTY_TEMPLATE)

    setIsEditingName(false)

    draftTemplateStorage.clear()

    navigate('/workouts')
  }

  // ===== DISCARD CHANGES & RESTORE STATE (EDIT) =====

  const discardChanges = () => {

    if (!originalRef.current) {
      return
    }

    const confirmed =
      window.confirm(
        'Discard all changes?',
      )

    if (!confirmed) {
      return
    }

    const restored =
      structuredClone(
        originalRef.current,
      )

    setTemplate(restored)
    setEditingTemplate(restored)
    setIsEditingName(false)

  }

  // ===== DELETE =====

  const deleteTemplate =
    async (templateId = id) => {
      const confirmed =
        window.confirm(
          'Delete this template?',
        )

      if (!confirmed) {
        return false
      }

      try {
        setError(null)

        await deleteTemplateApi(
          templateId,
        )

        setEditingTemplate(null)

        return true
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Template no longer exists')
        } else {
          setError('Could not delete template')
        }

        return false
      } finally {
        setSaving(false)
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
