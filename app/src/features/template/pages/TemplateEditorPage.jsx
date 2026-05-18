import { useNavigate, useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/BackButton'
import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'

import ExerciseItem from '../../exercise/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

import WorkoutControls from '../../../shared/components/WorkoutControls'

/**
 * Page for creating and editing workout templates.
 * @returns {import('react').ReactElement} - Template create/edit UI
 */
export default function TemplateEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()

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

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="app">
        <Header title="Template" />
        <p className="center">Loading...</p>
      </div>
    )
  }

  // ===== EMPTY =====
  if (!template) {
    return (
      <div className="app">
        <Header title="Template" />
        <p className="center">Template not found</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={isCreate ? 'Create Template' : 'Edit Template'}
      />

      <BackButton
        fallback={returnTo || '/workouts'}
        warnOnUnsavedChanges
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* HEADER */}
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
        onSave={saveTemplate}
        onDiscardTemplate={isCreate ? discardTemplate : undefined}
        onDiscardChanges={!isCreate ? discardChanges : undefined}
        saveLabel="Save template"
        discardLabel="Discard template"
        cancelLabel="Cancel"
        saving={saving}
        hasExercises={template.exercises.length > 0}
      />

      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* ADD EXERCISE */}
      <button
        className="btn btn-standard btn-secondary btn-full"
        onClick={openLibrary}
      >
        Add exercise
      </button>

      {/* EXERCISES */}

      <DataState
        data={template.exercises}
        emptyText="Add your first exercise to start building your template."
      >
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
  )
}
