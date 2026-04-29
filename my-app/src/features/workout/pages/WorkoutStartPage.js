import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTemplates } from '../../../shared/api/templateApi'
import TemplateList from '../../template/components/TemplateList'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStart() {
  const navigate = useNavigate()

  const [templates, setTemplates] = useState([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates({ limit: 5 }) // t.ex bara några
        setTemplates(data.results || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchTemplates()
  }, [])

  return (
    <div className="card-base">
      <h2>Start Workout</h2>

      {/* ACTIONS */}
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

      {/* TEMPLATES */}
      <div className="section">
        <TemplateList templates={templates.slice(0, 3)} />

        <p className="link center" onClick={() => navigate('/templates')}>
          View all templates →
        </p>
      </div>
    </div>
  )
}
