import { useNavigate, useLocation } from 'react-router-dom'
import BackButton from '../../../shared/ui/BackButton'

export default function TemplateDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const template = location.state?.template

  if (!template) return <p className="center">No template found</p>

  return (
    <div className="app">
      <BackButton />

      {/* HEADER */}
      <div className="section">
        <h2>{template.name || 'Untitled template'}</h2>
        <p className="muted">{template.exercises?.length || 0} exercises</p>
      </div>

      {/* EXERCISES */}
      <div className="section">
        {template.exercises.map((ex, i) => (
          <div key={i} className="card-base mb">
            <div className="exercise-header">
              <h3>{ex.name}</h3>
              <span className="muted small">{ex.sets?.length || 0} sets</span>
            </div>

            <div className="set-list">
              {ex.sets.map((s, j) => (
                <div key={j} className="set-row compact">
                  <span className="muted small">Set {j + 1}</span>
                  <span>{s.weight} kg</span>
                  <span>{s.reps} reps</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="section">
        <button
          className="btn btn-primary btn-full"
          onClick={() =>
            navigate('/workout/run', {
              state: {
                workout: template,
                from: location.pathname,
              },
            })
          }
        >
          Start workout
        </button>

        <button
          className="btn btn-secondary btn-full"
          onClick={() =>
            navigate('/templates/edit', {
              state: {
                template,
                from: location.pathname,
              },
            })
          }
        >
          Edit template
        </button>
      </div>
    </div>
  )
}
