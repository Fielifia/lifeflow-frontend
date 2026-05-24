import { useNavigate, useParams } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import { useTemplateDetail } from '../hooks/useTemplateDetail'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/button/BackButton'
import Header from '../../../shared/components/ui/Header'
import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'

/**
 * Displays detailed view of a template.
 * @returns {import('react').ReactElement} Template detail UI
 */
export default function TemplateDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const { template, loading, error } = useTemplateDetail(id)

  const { deleteTemplate } = useTemplateManager()

  const handleDeleteTemplate = async () => {
    const deleted = await deleteTemplate(template._id)

    if (!deleted) {
      return
    }

    navigate('/workouts')
  }

  // ===== LOADING / ERROR / EMPTY =====

  if (loading || error || !template) {
    return (
      <div className="app">
        <Header title="Template" />

        <div className="section">
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

  return (
    <div className="app">
      {/* HEADER */}

      <Header
        title={template.name}
        subtitle={`${template.exercises.length} exercises`}
      />

      {/* BACK BUTTON */}

      <BackButton fallback="/workouts" />

      <div className="section">
        {/* CONTROLS */}

        <WorkoutControls
          variant="detail"
          onStartWorkout={(e) => {
            e.stopPropagation?.()

            startWorkout({ template })
          }}
          onEdit={() => {
            navigate(`/templates/${template._id}/edit?from=workouts`)
          }}
          onDelete={handleDeleteTemplate}
          editLabel="Edit Template"
          deleteLabel="Delete"
        />

        {/* FEEDBACK */}

        {error && <p className="error center">{error}</p>}

        {/* EXERCISES */}

        {template.exercises.map((ex, i) => (
          <ExerciseItem
            mode="template"
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

            <p className="muted">{template.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
