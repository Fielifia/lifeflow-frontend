import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTemplates } from '../../../shared/api/templateApi'
import TemplateList from '../../template/components/TemplateList'
import DataState from '../../../shared/ui/DataState'
import BackButton from '../../../shared/ui/BackButton'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStart() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])

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
    <div className="card-base">
      <BackButton fallback="/home" />
      <h2>Start Workout</h2>

      <button
        className="btn btn-primary btn-full"
        onClick={() =>
          navigate('/workout/run', {
            state: {
              workout: {
                name: '',
                exercises: [],
                notes: '',
              },
            },
          })
        }
      >
        Start new workout
      </button>

      <button
        className="btn btn-secondary btn-full"
        onClick={() => navigate('/templates/create')}
      >
        Create template
      </button>

      <button
        className="btn btn-secondary btn-full"
        onClick={() => navigate('/history')}
      >
        Repeat previous
      </button>

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

        <p className="link center" onClick={() => navigate('/templates')}>
          View all templates →
        </p>
      </div>
    </div>
  )
}
