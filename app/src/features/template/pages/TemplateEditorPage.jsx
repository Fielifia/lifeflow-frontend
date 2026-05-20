import {
  useNavigate,
  useParams
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/BackButton'
import Header from '../../../shared/components/ui/Header'
import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/WorkoutControls'

import WorkoutHeader from '../../workout/components/WorkoutHeader'

import ExerciseItem from '../../exercise/components/ExerciseItem'


/**
 * Page for creating and editing workout templates.
 * @returns {import('react').ReactElement} - Template create/edit UI
 */
export default function TemplateEditorPage() {
  const navigate = useNavigate()

  const { id } = useParams()
  const isCreate = !id

  const { returnTo } = useExerciseFlow()

  const {
    template,
    setTemplate,

    loading,
    saving,
    success,
    error,

    isEditingName,
    setIsEditingName,

    openLibrary,
    exerciseActions,

    updateTemplateNotes,

    hasUnsavedChanges,

    saveTemplate,
    discardTemplate,

    discardChanges,
  } = useTemplateManager(id, navigate)

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
        subtitle={isCreate ? 'Create Template' : 'Edit Template'}
      />

      {/* BACK BUTTON */}

      <BackButton
        fallback={returnTo || '/workouts'}
        warnOnUnsavedChanges
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={discardChanges}
      />

      <div className="section">

        {/* WORKOUT HEADER */}
        <WorkoutHeader
          name={template.name}
          isEditing={isEditingName}
          setIsEditing={setIsEditingName}
          onChangeName={(value) =>
            setTemplate((prev) => ({
              ...prev,
              name: value,
            }))
          }
          isEditable={true}
          showDuration={false}
        />

        {/* CONTROLS */}

        <WorkoutControls
          variant="editor"
          saving={saving}
          onSave={saveTemplate}
          onDiscardChanges={!isCreate ? discardChanges : undefined}
          onDiscardTemplate={isCreate ? discardTemplate : undefined}
          saveLabel="Save template"
          discardLabel="Discard"
          cancelLabel="Cancel"
          hasExercises={template.exercises.length > 0}
        />

        {/* FEEDBACK */}

        {success && <p className="muted center">Template saved ✔</p>}
        {error && <p className="error center">{error}</p>}

        {/* ADD EXERCISE */}

        <button
          className="btn btn-md btn-secondary btn-full"
          onClick={openLibrary}
        >
          Add exercise
        </button>

        {/* EMPTY TEMPLATE */}

        <DataState
          data={template.exercises}
          emptyText="Add your first exercise to start building your template."
        >

          {/* EXERCISES */}

          {template.exercises.map((ex, i) => (
            <ExerciseItem
              mode="template"
              key={ex.id}
              ex={ex}
              i={i}
              navigate={navigate}
              actions={exerciseActions}
            />
          ))}
        </DataState>

        {/* NOTES */}

        {template.exercises.length > 0 && (
          <textarea
            className="input-base textarea"
            value={template.notes}
            placeholder="Workout Notes..."
            onChange={(e) => updateTemplateNotes(e.target.value)}
          />
        )}

      </div>
    </div>
  )
}
