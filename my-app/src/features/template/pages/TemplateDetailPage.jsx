import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTemplateById } from '../../../shared/api/templateApi'
import Header from '../../../shared/ui/Header'
import BackButton from '../../../shared/ui/BackButton'
import DataState from '../../../shared/ui/DataState'

/**
 * Displays detailed view of a template.
 * @returns {import('react').ReactElement} Template detail UI
 */
export default function TemplateDetail() {
  const navigate = useNavigate()
  const location = useLocation()

  const { id } = useParams()

  const [template, setTemplate] = useState(
    location.state?.template || null,
  )

  const [loading, setLoading] = useState(!location.state?.template)
  const [error, setError] = useState('')

  useEffect(() => {
    if (template) return

    const fetchTemplate = async () => {
      try {
        setLoading(true)

        const data = await getTemplateById(id)

        setTemplate(data)
      } catch {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id, template])

  // ===== LOADING / ERROR / EMPTY =====
  if (loading || error || !template) {
    return (
      <div className="app">
        <Header
          title="Template"
          
        />

        <div className="card-base card-workout">
          <BackButton fallback="/workouts" />

          <DataState
            loading={loading}
            error={error}
            data={template ? [template] : []}
            variant="card-workout"
            emptyText="No template found"
            count={1}
          />
        </div>
      </div>
    )
  }

  // ===== NORMALIZE =====
  const normalizedExercises = (template.exercises || []).map((ex) => ({
    ...ex,
    image: ex.image || ex.images?.[0] || '',
    images: ex.images || (ex.image ? [ex.image] : []),
    restTime: ex.restTime ?? ex.rest ?? 120,
    notes: ex.notes ?? '',
  }))

  // ===== ACTIONS =====
  const handleStartWorkout = () => {
    const workoutId = Date.now()

    navigate(`/workouts/${workoutId}/run`, {
      state: { template },
    })
  }

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={`${template.exercises.length} exercises `}
      />
      <BackButton fallback="/workouts" />

      {/* EXERCISES */}
      {normalizedExercises.map((ex, i) => (
        <div key={i} className="workout-exercise">
          {/* HEADER */}
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

          {/* REST */}
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
          className="btn btn-standard btn-primary btn-full"
          onClick={handleStartWorkout}
        >
          Start workout
        </button>

        <button
          className="btn btn-standard btn-secondary btn-full"
          onClick={() =>
            navigate(`/templates/${template._id}/edit`, {
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
