import { useNavigate } from 'react-router-dom'

/**
 * Displays a preview card for a template.
 * @param {object} props - Component props
 * @param {object} props.template - Template data
 * @param {() => void} props.onClick - Click handler for opening template
 * @returns {import('react').ReactElement} Template card UI
 */
export default function TemplateCard({ template, onClick }) {
  const exercises = template.exercises || []
  const navigate = useNavigate()

  const handleStartWorkout = (e) => {
    e.stopPropagation()
    const workoutId = Date.now()

    navigate(`/workout/${workoutId}`, {
      state: { template },
    })
  }

  return (
    <div className="card-base template-card clickable" onClick={onClick}>
      {/* HEADER */}
      <div className="template-header">
        <div>
          <h3>{template.name}</h3>
          <p className="muted small">
            {exercises.length} exercises • Last: 2 days ago
          </p>
        </div>

        <button className="btn-clean btn-dots">⋮</button>
      </div>

      {/* PREVIEW */}
      <ul className="template-list">
        {exercises.slice(0, 4).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      {/* ACTION */}
      <button
        className="btn btn-primary btn-full"
        onClick={handleStartWorkout}
      >
        ▶ Start Workout
      </button>
    </div>
  )
}
