import { useEffect, useState } from 'react'
import { getTemplateById, updateTemplate } from '../../../shared/api/templateApi'
import { workoutMutation } from '../../workout/utils/workoutMutations'

/**
 * Hook for editing templates.
 * @param {string} templateId - Template ID.
 * @param {(path: string, options?: object) => void} navigate - React Router navigate function.
 * @param {{ state?: object, pathname: string }} location - Current route location object.
 * @returns {object} Template state and mutation handlers.
 */
export function useEditTemplateLogic(
  navigate,
  location,
  id,
) {
  // ===== STATE =====
  const [template, setTemplate] = useState(null)


  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [isEditingName, setIsEditingName] = useState(false)

  // ===== LOAD TEMPLATE =====
  useEffect(() => {

    const fetchTemplate = async () => {
      try {
        setLoading(true)

        const data = await getTemplateById(id)

        setTemplate(data)
      } catch (err) {
        setError('Failed to load template')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTemplate()
  }, [id])


  // ===== ADD FROM LIBRARY =====
  useEffect(() => {
    const selected = location.state?.selectedExercises
    const mode = location.state?.mode

    if (!selected?.length || mode !== 'template') {
      return
    }

    setTemplate((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        exercises: selected.map((ex) => ({
          ...ex,
          exerciseId: ex.exerciseId || ex.id,
          image: ex.images?.[0] || ex.image || '',
          images: ex.images || [],
          restTime: ex.restTime ?? ex.rest ?? 120,
          notes: ex.notes ?? '',
          sets:
            ex.sets?.length > 0
              ? ex.sets
              : [{ reps: 8, weight: 0 }],
        })),
      }
    })
  }, [
    location.state?.selectedExercises,
    location.state?.mode,
  ])

  // ===== ACTIONS =====

  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        selectedExercises: template.exercises,
        currentExercises: template.exercises,
        returnTo: location.pathname,
        mode: 'template',
      },
    })
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

  // ===== SAVE =====

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

      const cleanedExercises = template.exercises.map((ex) => ({
        exerciseId:
          ex.exerciseId || ex.id || ex._id,

        name: ex.name,

        images: ex.images?.length
          ? ex.images
          : ex.image
            ? [ex.image]
            : [],

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

      const validExercises = cleanedExercises.filter(
        (ex) => ex.sets.length > 0,
      )

      if (!validExercises.length) {
        setError('Each exercise needs at least one set')
        return
      }

      await updateTemplate(id, {
        ...template,
        name: template.name.trim(),
        exercises: validExercises,
      })

      setSuccess(true)

      navigate('/workouts')
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not update template',
      )
    } finally {
      setSaving(false)
    }
  }

  return {
    template,
    // setTemplate,

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
    // updateTemplateNotes,

    saveTemplate,
  }
}
