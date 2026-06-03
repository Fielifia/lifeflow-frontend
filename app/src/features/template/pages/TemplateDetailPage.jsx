import { useNavigate, useParams } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import { useTemplateDetail } from '../hooks/useTemplateDetail'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/button/BackButton'
import Header from '../../../shared/components/ui/Header'
import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

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
        <Header />

        <div className="section">
          <BackButton fallback="/workouts" />

          <DataState
            loading={loading}
            error={error}
            data={template ? [template] : []}
            variant="card-workout"
            emptyTitle="Template not found"
            emptyText="It may have been deleted or no longer exists."
            count={1}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* HEADER */}

      <Header subtitle={`Template (${template.exercises.length} exercises)`} />

      {/* BACK BUTTON */}

      <BackButton fallback="/workouts" />

      {/* WORKOUT HEADER */}

      <WorkoutHeader
        name={template.name}
        mode="template"
        showDuration={false}
      />

      {/* CONTROLS */}

      <WorkoutControls
        variant="detail"
        onStartWorkout={(e) => {
          e.stopPropagation?.()

          startWorkout({ template })
        }}
        onEdit={() => {
          navigate(`/templates/${template._id}/edit`)
        }}
        onDelete={handleDeleteTemplate}
        editLabel="Edit Template"
        deleteLabel="Delete"
      />

      {/* EXERCISES */}
      <div className="section">
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
