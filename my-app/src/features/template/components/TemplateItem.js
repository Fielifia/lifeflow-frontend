import { useNavigate, useLocation } from 'react-router-dom'

export default function TemplateItem({ template }) {
  const navigate = useNavigate()
  const location = useLocation()

  const exercises = template.exercises || []
  const firstExercise = exercises[0]

  return (
    <div
      className="card-base clickable template-card"
      onClick={() =>
        navigate(`/templates/${template._id}`, {
          state: {
            template,
            from: location.pathname,
          },
        })
      }
    >
      {/* HEADER */}
      <div className="exercise-header-main">
        <img
          src={firstExercise?.image || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
        />

        <div>
          <h3>{template.name || 'Untitled template'}</h3>
          <p className="muted small">{exercises.length} exercises</p>
        </div>
      </div>

      {/* PREVIEW (max 2 övningar) */}
      <div className="template-preview">
        {exercises.slice(0, 2).map((ex, i) => (
          <div key={i} className="template-preview-row">
            <span className="muted small">{ex.name}</span>

            <span className="muted small">{ex.sets?.length || 0} sets</span>
          </div>
        ))}

        {exercises.length > 2 && (
          <p className="muted small">+{exercises.length - 2} more</p>
        )}
      </div>
    </div>
  )
}
