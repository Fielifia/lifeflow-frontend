import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTemplateById } from '../../../shared/api/templateApi'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import BackButton from '../../../shared/ui/BackButton'
import DataState from '../../../shared/ui/DataState'
import Header from '../../../shared/ui/Header'
import ExerciseItem from '../../workout/components/ExerciseItem'
import TemplateControls from '../components/TemplateControls'
import { useTemplateManager } from '../hooks/useTemplateManager'

/**
 * Displays detailed view of a template.
 * @returns {import('react').ReactElement} Template detail UI
 */
export default function TemplateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const { setSelectedTemplate } = useWorkoutContext()

  const {
    success,

    saveTemplate,

    deleteCurrentTemplate,
  } = useTemplateManager(id, navigate)


  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
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

  // ===== ACTIONS =====
  const handleStartWorkout = () => {
    const workoutId = Date.now()

    setSelectedTemplate(template)

    navigate(`/workouts/${workoutId}/run`)
  }

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={`${template.exercises.length} exercises `}
      />
      <BackButton fallback="/workouts" />

      <TemplateControls
        onEditTemplate={() => {
          setReturnTo(location.pathname)

          navigate(`/templates/${template._id}/edit`)
        }}
        onSaveTemplate={saveTemplate}
        deleteCurrentTemplate={deleteCurrentTemplate}
      />

      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* EXERCISES */}
      {template.exercises.map((ex, i) => (
        <ExerciseItem
          key={ex.id || i}
          ex={ex}
          i={i}
          navigate={navigate}
          isEditable={false}
          showCheckbox={false}
        />
      ))}

      {/* NOTES */}
      {template.notes && (
        <div className="section">
          <h3>Notes</h3>

          <p className="muted">
            {template.notes}
          </p>
        </div>
      )}

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
                returnTo: `/templates/${template._id}`,
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
