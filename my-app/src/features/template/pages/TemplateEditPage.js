import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Timer } from 'lucide-react'

import {
  createTemplate,
  getTemplateById,
  updateTemplate,
} from '../../../shared/api/templateApi'
import BackButton from '../../../shared/ui/BackButton'

export default function TemplateEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const isCreate = !id

  const [template, setTemplate] = useState({
    name: '',
    exercises: [],
  })

  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ===== LOAD TEMPLATE (edit mode) =====
  useEffect(() => {
    if (isCreate) return

    const fetchTemplate = async () => {
      try {
        const data = await getTemplateById(id)
        setTemplate(data)
      } catch (err) {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id, isCreate])

  // ===== ADD EXERCISES FROM LIBRARY =====
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

  // ===== SAVE =====
  const handleSave = async () => {
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
    } catch (err) {
      setError('Could not save template')
    } finally {
      setSaving(false)
    }
  }

  // ===== UI =====
  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/templates" />

      <h2>{isCreate ? 'Create Template' : 'Edit Template'}</h2>

      {/* NAME */}
      <input
        className="input-base"
        value={template.name}
        placeholder="Template name"
        onChange={(e) =>
          setTemplate((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      {/* ADD EXERCISE */}
      <button className="btn btn-secondary btn-full" onClick={openLibrary}>
        Add exercise
      </button>

      {/* EXERCISES */}
      {template.exercises.map((ex, i) => (
        <div key={ex.exerciseId} className="workout-exercise">
          <div className="exercise-header-main">
            <img
              src={ex.image || '/placeholder.png'}
              alt=""
              className="exercise-img-small"
            />
            <h3>{ex.name}</h3>

            <button
              className="btn btn-secondary btn-small btn-right"
              onClick={() => removeExercise(i)}
            >
              Remove
            </button>
          </div>

          {/* SET HEADER */}
          <div className="set-header">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
          </div>

          {/* SETS */}
          {ex.sets.map((set, j) => (
            <div key={j} className="set-row">
              <span>{j + 1}</span>

              <input
                type="number"
                className="input-base"
                value={set.weight}
                onChange={(e) =>
                  updateSet(i, j, 'weight', Number(e.target.value))
                }
              />

              <input
                type="number"
                className="input-base"
                value={set.reps}
                onChange={(e) =>
                  updateSet(i, j, 'reps', Number(e.target.value))
                }
              />

              <button
                className="btn btn-secondary btn-small"
                onClick={() => removeSet(i, j)}
              >
                Delete
              </button>
            </div>
          ))}

          <button
            className="btn btn-primary btn-small"
            onClick={() => addSet(i)}
          >
            Add set
          </button>

          {/* REST */}
          <div
            className="rest-label"
            onClick={() => {
              const val = prompt('Rest time (seconds)', ex.restTime)
              if (val !== null && !isNaN(val)) {
                updateRest(i, Number(val))
              }
            }}
          >
            <Timer className="icon-small" /> Set Rest Timer: {ex.restTime ?? 60}s
          </div>
        </div>
      ))}

      {/* SAVE */}
      <button className="btn btn-primary btn-full" onClick={handleSave}>
        {saving ? 'Saving...' : 'Save Template'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
