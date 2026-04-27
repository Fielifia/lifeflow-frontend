import { useNavigate } from 'react-router-dom'

/**
 *
 * @param root0
 * @param root0.template
 */
export default function TemplateItem({ template }) {
  const navigate = useNavigate()

  const exerciseCount = template.exercises?.length || 0

  const workoutFromTemplate = {
    name: template.name || 'Untitled template',
    exercises: (template.exercises || []).map((ex) => ({
      ...ex,
      sets: (ex.sets || []).map((set) => ({
        ...set,
        completed: false,
      })),
    })),
  }

  return (
    <div
      className="card-base clickable"
      onClick={() =>
        navigate(`/templates/${template._id}`, {
          state: { template },
        })
      }
    >
      <p className="template-title">{workoutFromTemplate.name}</p>

      <p className="muted small">{exerciseCount} exercises</p>
    </div>
  )
}
