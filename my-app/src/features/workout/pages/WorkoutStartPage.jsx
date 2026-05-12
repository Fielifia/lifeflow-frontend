import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTemplates } from '../../../shared/api/templateApi'
import Header from '../../../shared/ui/Header'
import TemplateList from '../../template/components/TemplateList'
import DataState from '../../../shared/ui/DataState'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStart() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])

  const [draftTemplate, setDraftTemplate] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('draftTemplate'))
      if (stored?.exercises?.length > 0) {
        setDraftTemplate(stored)
      }
    } catch {
      setDraftTemplate(null)
    }
  }, [])

  const hasTemplateDraft = draftTemplate?.exercises?.length > 0

  const [draftWorkout, setDraftWorkout] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('draftWorkout'))
      if (stored?.exercises?.length > 0) {
        setDraftWorkout(stored)
      }
    } catch {
      setDraftWorkout(null)
    }
  }, [])

  const hasWorkoutDraft = draftWorkout?.exercises?.length > 0

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getTemplates({ limit: 5 })
        setTemplates(data.results || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  return (
    <div className="app">
      <Header
        title="Start Workout"
        subtitle="Build your next session"
      />
      <div className="page-section">
        <div className="hero-actions">
          <button
            className="hero-btn hero-btn-primary"
            onClick={() =>
              navigate(`/workouts/${Date.now()}/run`, {
                state: {
                  workout: hasWorkoutDraft
                    ? {
                      ...draftWorkout,
                      exercises: draftWorkout.exercises.map((ex) => ({
                        ...ex,
                        sets: ex.sets.map((s) => ({
                          ...s,
                          completed: false,
                        })),
                      })),
                    }
                    : {
                      name: '',
                      exercises: [],
                      notes: '',
                    },
                },
              })
            }
          >
            <span className="hero-icon">▷</span>
            <span>
              {hasWorkoutDraft
                ? `Continue ${draftWorkout.name || 'Workout'}`
                : 'Start Empty Workout'}
            </span>
          </button>

          <button
            className="hero-btn hero-btn-secondary"
            onClick={() =>
              navigate('/templates/create', {
                state: hasTemplateDraft ? { draft: draftTemplate } : undefined,
              })
            }
          >
            <span className="hero-icon">+</span>
            <span>
              {hasTemplateDraft
                ? `Continue ${draftTemplate.name || 'Template'}`
                : 'New Workout Template'}
            </span>
          </button>
        </div>

        <div className="section template">
          <DataState
            loading={loading}
            error={error}
            data={templates}
            variant="card-template"
            emptyText="No templates found"
            count={4}
          >
            <TemplateList templates={templates.slice(0, 3)} />
          </DataState>
        </div>
      </div>
    </div>
  )
}
