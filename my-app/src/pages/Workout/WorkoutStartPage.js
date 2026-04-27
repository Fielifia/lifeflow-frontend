import { useNavigate } from 'react-router-dom'
import TemplateList from '../Template/TemplateList.js'

/**
 *
 */
export default function WorkoutStart() {
  const navigate = useNavigate()

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
        <h3>Templates</h3>

        <TemplateList />

        <p className="link center" onClick={() => navigate('/templates')}>
          View all templates →
        </p>
      </div>
    </div>
  )
}
