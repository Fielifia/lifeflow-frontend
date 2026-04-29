import { useNavigate } from 'react-router-dom'

export default function TemplateCard({ template, onClick }) {
  const exercises = template.exercises || []
  const navigate = useNavigate()

  const handleStartWorkout = () => {
    navigate('/workout/run', {
      state: {
        template,
      },
    })
  }

  return (
    <div className="card-base template-card" onClick={onClick}>
      {/* TITLE */}
      <h2>{template.name}</h2>

      {/* PREVIEW */}
      <div className="template-preview">
        {exercises.slice(0, 3).map((ex, i) => (
          <div key={i} className="template-preview-row">
            <span>{ex.name}</span>
            <span>
              {ex.sets?.[0]?.reps || 0} reps • {ex.sets?.length || 0} sets
            </span>
          </div>
        ))}

        {exercises.length > 3 && (
          <p className="muted small">+{exercises.length - 3} more</p>
        )}
      </div>

      {/* ACTION */}
      <button className="btn btn-primary btn-full" onClick={(e) => {
        e.stopPropagation()
        handleStartWorkout()
      }}>
        Start workout
      </button>

    </div>
  )
}
