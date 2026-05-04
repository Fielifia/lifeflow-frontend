import { useNavigate, useLocation } from 'react-router-dom'
import { Timer } from 'lucide-react'
import BackButton from '../../../shared/ui/BackButton'

/**
 * Displays detailed view of a template.
 * @returns {import('react').ReactElement} Template detail UI
 */
export default function TemplateDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const template = location.state?.template

  if (!template) return <p className="center">No template found</p>

  const normalizedExercises = (template.exercises || []).map((ex) => ({
    ...ex,
    image: ex.image || ex.images?.[0] || '',
    images: ex.images || (ex.image ? [ex.image] : []),
    restTime: ex.restTime ?? ex.rest ?? 0,
    notes: ex.notes ?? '',
  }))

  const handleStartWorkout = () => {
    navigate('/workout/run', {
      state: {
        template,
      },
    })
  }

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/templates" />

      {/* HEADER */}
      <div className="workout-header">
        <h2>{template.name || 'Untitled template'}</h2>
        <span>{template.exercises?.length || 0} exercises</span>
      </div>

      {/* EXERCISES */}
      {normalizedExercises.map((ex, i) => (
        <div key={i} className="workout-exercise">
          {/* HEADER  */}
          <div className="exercise-header-main">
            <img
              src={ex.image || '/placeholder.png'}
              alt=""
              className="exercise-img-small"
              onClick={() => navigate(`/exercises/${ex.exerciseId}`)}
            />

            <h2>{ex.name}</h2>
          </div>

          {/* SET HEADER */}
          <div className="set-header">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
          </div>

          {/* SETS */}
          {ex.sets.map((set, j) => (
            <div key={j} className="set-row">
              <span className="set-number">{j + 1}</span>

              <span>{set.weight ?? '-'}</span>
              <span>{set.reps ?? '-'}</span>
            </div>
          ))}

          {/* REST TIMER (read only) */}
          {ex.restTime && (
            <div className="rest-label">
              <Timer className="icon-small" /> Rest: {ex.restTime}s
            </div>
          )}

          {/* NOTES */}
          {ex.notes && <p className="muted small">{ex.notes}</p>}
        </div>
      ))}

      {/* ACTIONS */}
      <div className="section">
        <button
          className="btn btn-primary btn-full"
          onClick={handleStartWorkout}
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
