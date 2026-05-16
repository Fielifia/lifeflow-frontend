import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { EMPTY_TEMPLATE } from '../../../shared/utils/constants'

import {
  createTemplateApi,
  deleteTemplateApi,
  getTemplateByIdApi,
  updateTemplateApi,
} from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { draftTemplateStorage } from '../../../shared/utils/storage/draftStorage'

import { appendExercisesToTemplate } from '../utils/appendExercisesToTemplate'

import { buildTemplatePayload } from '../utils/buildTemplatePayload'

/**
 * Handles template creation, editing,
 * draft persistence and exercise flow logic.
 * @param {(path: string, options?: object) => void} navigate - React Router navigation function
 * @param {string | undefined} id - Template id for edit mode
 * @returns {{
 *  template: object|null,
 *  setTemplate: import('react').Dispatch<
 *    import('react').SetStateAction<object|null>
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
 *  addSet: (index: number) => void,
 *  updateSet: (
 *    exIndex: number,
 *    setIndex: number,
 *    field: string,
 *    value: number | ''
 *  ) => void,
 *  removeSet: (
 *    exIndex: number,
 *    setIndex: number
 *  ) => void,
 *  removeExercise: (index: number) => void,
 *  updateExerciseRest: (
 *    index: number,
 *    value: number
 *  ) => void,
 *  updateExerciseNotes: (
 *    index: number,
 *    notes: string
 *  ) => void,
 *  saveCurrentTemplate: () => Promise<void>,
 *  deleteTemplate: () => Promise<void>
 * }} Template manager state and actions
 */
export function useTemplateManager(navigate, id) {
  const location = useLocation()
  const { setDraftTemplate } = useWorkoutContext()
  const isCreate = !id

  // ===== STATE =====

  const [template, setTemplate] = useState(() => {
    if (!isCreate) {
      return EMPTY_TEMPLATE
    }

    try {
      const stored = draftTemplateStorage.get()

      return {
        name: stored?.name?.trim() || 'Template',

        exercises: stored?.exercises || [],

        notes: stored?.notes || '',
      }
    } catch {
      return EMPTY_TEMPLATE
    }
  })

  const [loading, setLoading] = useState(!isCreate)

  const [saving, setSaving] = useState(false)

  const [success, setSuccess] = useState(false)

  const [error, setError] = useState('')

  const [isEditingName, setIsEditingName] = useState(false)

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

    if (editingTemplate && editingTemplate._id === id) {
      setTemplate(editingTemplate)
      setLoading(false)
      return
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true)

        const data = await getTemplateByIdApi(id)

        setTemplate(data)

        setEditingTemplate(data)

      } catch {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [
    id,
    isCreate,
    editingTemplate,
    setEditingTemplate,
  ])

  // ===== SAVE DRAFT =====

  useEffect(() => {
    if (!isCreate || !template) {
      return
    }

    draftTemplateStorage.set(template)

    if (template?.exercises?.length > 0) {
      draftTemplateStorage.set(template)
      setDraftTemplate(template)
    }
  }, [template, isCreate, setDraftTemplate])

  // ===== ADD FROM LIBRARY =====

  useEffect(() => {
    if (!selectedExercises?.length) {
      return
    }

    appendExercisesToTemplate({
      exercises: selectedExercises,

      setTemplate,
    })

    setSelectedExercises([])
  }, [selectedExercises, setSelectedExercises])

  // ===== KEEP EDIT STATE UPDATED =====

  useEffect(() => {
    if (isCreate || !template) {
      return
    }

    if (editingTemplate === template) {
      return
    }

    setEditingTemplate(template)
  }, [
    template,
    editingTemplate,
    isCreate,
    setEditingTemplate,
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
  } = useExerciseMutations(setTemplate)

  // ===== SAVE =====

  const saveCurrentTemplate = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const payload = buildTemplatePayload(template)

      let saved

      if (isCreate) {
        saved = await createTemplateApi(payload)

        draftTemplateStorage.clear()
        setDraftTemplate(EMPTY_TEMPLATE)

        navigate(`/templates/${saved._id}`)
      } else {
        saved = await updateTemplateApi(id, payload)

        setEditingTemplate(null)

        navigate(`/templates/${id}`)
      }

      setSuccess(true)
    } catch (err) {
      setError(
        err.message || err.response?.data?.error || 'Could not save template',
      )
    } finally {
      setSaving(false)
    }
  }

  // ===== DELETE =====

  const deleteTemplate = async () => {
    const confirmed = window.confirm('Delete this template?')

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteTemplateApi(id)

      setEditingTemplate(null)
      draftTemplateStorage.clear()
      setDraftTemplate(EMPTY_TEMPLATE)

      navigate('/workouts')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete template')
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
