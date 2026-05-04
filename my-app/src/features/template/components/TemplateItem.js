import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Template preview card.
 * @param {{
 *  template: {
 *    _id: string,
 *    name?: string,
 *    exercises?: Array<{
 *      name: string,
 *      image?: string,
 *      sets?: Array<{ reps: number, weight: number }>
 *    }>
 *  }
 * }} props - Template data
 * @returns {import('react').ReactElement} Template card UI
 */
export default function TemplateItem({ template, ex }) {
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
      {/* <div className="exercise-header-main">
        <img
          src={firstExercise?.image || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
        />

        <div>
          <h3>{template.name || 'Untitled template'}</h3>
          <p className="muted small">{exercises.length} exercises</p>
        </div>
      </div> */}

      <div className="exercise-header-main">
        <img
          src={firstExercise?.image || '/placeholder.png'}
          alt=""
          className="exercise-img-small"
          onClick={() => navigate(`/exercises/${ex.exerciseId}`)}
        />

        <h2>{template.name}</h2>
        <p className="muted small">{exercises.length} exercises</p>
      </div>

      {/* PREVIEW */}
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
