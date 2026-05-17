import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTemplatesApi } from '../../../shared/api/templateApi'
import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import TemplateList from '../../template/components/TemplateList'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStartPage() {
  const navigate = useNavigate()

  const {
    start,

    activeWorkout,

    draftTemplate,
  } = useWorkoutContext()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])

  const hasWorkoutDraft = activeWorkout?.exercises?.length > 0

  const hasTemplateDraft = draftTemplate?.exercises?.length > 0

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getTemplatesApi({ limit: 5 })

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
      <Header title="Start Workout" subtitle="Build your next session" />

      <div className="section">
        <div className="hero-actions">
          {/* START / CONTINUE WORKOUT */}
          <button
            className="btn hero-btn hero-btn-primary"
            onClick={() => {
              start()

              navigate(`/workouts/${Date.now()}/run`)
            }}
          >
            <span className="hero-icon">▷</span>

            <span>
              {hasWorkoutDraft
                ? `Continue ${activeWorkout.name || 'Workout'}`
                : 'Start Empty Workout'}
            </span>
          </button>

          {/* TEMPLATE */}
          <button
            className="btn hero-btn hero-btn-secondary"
            onClick={() => navigate('/templates/create')}
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
