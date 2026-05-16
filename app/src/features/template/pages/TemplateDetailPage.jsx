import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import BackButton from '../../../shared/ui/BackButton'
import DataState from '../../../shared/ui/DataState'
import Header from '../../../shared/ui/Header'

import ExerciseItem from '../../exercise/components/ExerciseItem'
import TemplateControls from '../components/TemplateControls'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import { useTemplateDetail } from '../hooks/useTemplateDetail'
import { useTemplateManager } from '../hooks/useTemplateManager'

/**
 * Displays detailed view of a template.
 * @returns {import('react').ReactElement} Template detail UI
 */
export default function TemplateDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const { startWorkout } = useStartWorkout()

  const {
    template,
    loading,
    error,
  } = useTemplateDetail(id)

  const {
    success,
    deleteTemplate,
  } = useTemplateManager(navigate, id)

  // ===== LOADING / ERROR / EMPTY =====

  if (loading || error || !template) {
    return (
      <div className="app">
        <Header title="Template" />

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
    )
  }

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={`${template.exercises.length} exercises`}
      />

      <BackButton fallback="/workouts" />

      {/* CONTROLS */}
      <TemplateControls
        onStartWorkout={(e) => {
          e.stopPropagation?.()

          startWorkout({ template })
        }}

        onEditTemplate={() => {
          setReturnTo(location.pathname)

          navigate(`/templates/${template._id}/edit`)
        }}

        onDeleteTemplate={deleteTemplate}
      />

      {/* FEEDBACK */}
      {success && (
        <p className="muted center">
          Template saved ✔
        </p>
      )}

      {error && (
        <p className="error center">
          {error}
        </p>
      )}

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
    </div>
  )
}
