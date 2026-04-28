import { useEffect, useState } from 'react'
import {
  createTemplate,
  updateTemplate,
  getTemplate,
} from '../../../shared/api/templateApi'

export function useTemplateLogic(navigate, location, id) {
  const isCreate = !id

  const [template, setTemplate] = useState({
    name: '',
    exercises: [],
  })

  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ===== LOAD (edit) =====
  useEffect(() => {
    if (isCreate) return

    const fetch = async () => {
      try {
        const data = await getTemplate(id)
        setTemplate(data)
      } catch {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id, isCreate])

  // ===== ADD FROM LIBRARY =====
  useEffect(() => {
    const selected = location.state?.selectedExercises
    const mode = location.state?.mode

    if (!selected?.length || mode !== 'template') return

    const newExercises = selected.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      image: ex.image,
      restTime: 60,
      sets: [
        { reps: 8, weight: 0 },
        { reps: 8, weight: 0 },
      ],
    }))

    setTemplate((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        ...newExercises.filter(
          (ex) => !prev.exercises.some((e) => e.exerciseId === ex.exerciseId),
        ),
      ],
    }))

    window.history.replaceState({}, '')
  }, [location.state])

  // ===== ACTIONS =====
  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        currentExercises: template.exercises,
        from: location.pathname,
        mode: 'template',
      },
    })
  }

  const updateExercise = (index, updater) => {
    setTemplate((prev) => {
      const updated = [...prev.exercises]
      updated[index] = updater(updated[index])
      return { ...prev, exercises: updated }
    })
  }

  const addSet = (i) => {
    updateExercise(i, (ex) => ({
      ...ex,
      sets: [...ex.sets, { reps: 8, weight: 0 }],
    }))
  }

  const updateSet = (i, j, field, value) => {
    updateExercise(i, (ex) => {
      const sets = [...ex.sets]
      sets[j] = { ...sets[j], [field]: value }
      return { ...ex, sets }
    })
  }

  const removeExercise = (i) => {
    setTemplate((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== i),
    }))
  }

  const removeSet = (i, j) => {
    updateExercise(i, (ex) => ({
      ...ex,
      sets: ex.sets.filter((_, idx) => idx !== j),
    }))
  }

  const updateRest = (i, value) => {
    updateExercise(i, (ex) => ({
      ...ex,
      restTime: value,
    }))
  }

  const save = async () => {
    try {
      setSaving(true)
      setError('')

      if (!template.name.trim()) {
        setError('Template needs a name')
        return
      }

      if (!template.exercises.length) {
        setError('Add at least one exercise')
        return
      }

      if (isCreate) {
        await createTemplate(template)
      } else {
        await updateTemplate(id, template)
      }

      navigate('/templates')
    } catch {
      setError('Could not save template')
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
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    updateRest,

    save,
  }
}
