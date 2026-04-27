import { useNavigate, useLocation } from 'react-router-dom'
import BackButton from '../../../shared/ui/BackButton'

export default function TemplateDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const template = location.state?.template

  if (!template) return <p>No template</p>

  return (
    <div className="section">
      <BackButton />
      <div className="card-base">
        <h2>{template.name}</h2>

        {template.exercises.map((ex, i) => (
          <div key={i}>
            <h4>{ex.name}</h4>
            {ex.sets.map((s, j) => (
              <p key={j}>
                Set {j + 1}: {s.reps} reps @ {s.weight}kg
              </p>
            ))}
          </div>
        ))}

        <button
          className="btn btn-secondary btn-full"
          onClick={() =>
            navigate('/templates/edit', {
              state: { workout: template },
            })
          }
        >
          Edit template
        </button>

        <button
          className="btn btn-primary btn-full"
          onClick={() =>
            navigate('/workout/run', {
              state: { workout: template },
            })
          }
        >
          Start workout
        </button>
      </div>
    </div>
  )
}
