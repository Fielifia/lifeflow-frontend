import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { arrayMove } from '@dnd-kit/sortable'

import {
  createTemplateApi,
  deleteTemplateApi,
  getTemplateByIdApi,
  updateTemplateApi,
} from '../../../shared/api/templateApi'

import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useToast } from '../../../shared/context/ToastContext'


import { useConfirm } from '../../../shared/hooks/useConfirm'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { draftTemplateStorage, hasTemplateDraftContent } from '../../../shared/utils/storage/draftStorage'

import { EMPTY_TEMPLATE } from '../../../shared/utils/constants/constants'

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
 * @param {string | undefined} id Template id for edit mode.
 * @param {(path: string, options?: object) => void} navigate React Router navigation function.
 * @returns {{
 *  template: object | null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object | null>
 *  >,
 *  loading: boolean,
 *  saving: boolean,
 *  error: string | null,
 *
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
 * 
 *    reorderExercises: (
 *      oldIndex: number,
 *      newIndex: number
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

  const [error, setError] =
    useState(null)

  const {
    selectedExercises,
    setSelectedExercises,

    editingTemplate,
    setEditingTemplate,

    setShouldRestoreScroll,
  } = useExerciseFlow()

  const toast = useToast()

  const confirm = useConfirm()

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
          setError(ERROR_MESSAGES.LOAD_TEMPLATE)
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
    setShouldRestoreScroll(false)

    window.scrollTo(0, 0)

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

  // ===== REORDER EXERCISES =====

  /**
   * Reorders exercises in workout state.
   * @param {number} oldIndex - Original exercise index.
   * @param {number} newIndex - Target exercise index.
   */
  const reorderExercises = (oldIndex, newIndex) => {
    setTemplate((prev) => ({
      ...prev,

      exercises: arrayMove(
        prev.exercises,
        oldIndex,
        newIndex,
      ),
    }))
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
    reorderExercises,
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

          toast.success('Template created')

          await delay(300)

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

          toast.success('Template saved')

          await delay(300)

          navigate(
            `/templates/${id}`,
          )
        }
      } catch (err) {
        toast.error(
          isCreate
            ? ERROR_MESSAGES.SAVE_TEMPLATE
            : ERROR_MESSAGES.UPDATE_TEMPLATE,
        )
      } finally {
        setSaving(false)
      }
    }

  // ===== DISCARD TEMPLATE (CREATE) =====

  const discardTemplate = async () => {

    const confirmed = await confirm({
      title: 'Discard template?',
      description: 'Your edits will be lost.',
      confirmText: 'Discard',
    })

    if (!confirmed) {
      return
    }

    setTemplate(EMPTY_TEMPLATE)

    draftTemplateStorage.clear()

    navigate('/workouts')
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

    if (!confirmed) {
      return
    }

    const restored =
      structuredClone(
        originalRef.current,
      )

    setTemplate(restored)

    setEditingTemplate(restored)

    toast.success('Template restored')

  }

  // ===== DELETE =====

  const deleteTemplate =
    async (templateId = id) => {

      const confirmed = await confirm({
        title: 'Delete template?',
        description: 'This cannot be undone.',
        confirmText: 'Delete',
        variant: 'danger',
      })

      if (!confirmed) {
        return false
      }

      try {
        setSaving(true)
        setError(null)

        await deleteTemplateApi(
          templateId,
        )

        setEditingTemplate(null)

        toast.success('Template deleted')

        await delay(300)

        return true
      } catch (err) {
        if (err.response?.status === 404) {
          setError(ERROR_MESSAGES.TEMPLATE_NOT_FOUND)
        } else {
          toast.error(ERROR_MESSAGES.DELETE_TEMPLATE)
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
    error,

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
