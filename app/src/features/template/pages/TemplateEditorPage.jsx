import { useNavigate, useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/BackButton'
import Header from '../../../shared/components/ui/Header'

import ExerciseItem from '../../exercise/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'

import TemplateControls from '../components/TemplateControls'

/**
 * Page for creating and editing workout templates.
 * @returns {import('react').ReactElement} - Template create/edit UI
 */
export default function TemplateEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isCreate = !id

  const {
    returnTo,
  } = useExerciseFlow()

  const {
    template,
    setTemplate,

    loading,
    saving,
    success,
    error,

    isEditingName,
    setIsEditingName,

    addSet,
    updateSet,
    removeSet,
    removeExercise,

    updateExerciseRest,
    updateExerciseNotes,

    openLibrary,

    saveCurrentTemplate,
    deleteTemplate,
  } = useTemplateManager(
    navigate,
    id,
  )

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
        <p className="center">
          Template not found
        </p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={
          isCreate
            ? 'Create Template'
            : 'Edit Template'
        }
      />

      <BackButton
        fallback={
          returnTo || '/workouts'
        }
      />

      {/* HEADER */}
      <WorkoutHeader
        name={template.name}
        isEditing={isEditingName}
        setIsEditing={
          setIsEditingName
        }
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
      <TemplateControls
        onSaveTemplate={
          saveCurrentTemplate
        }
        onDeleteTemplate={
          !isCreate
            ? deleteTemplate
            : undefined
        }
        saving={saving}
        hasExercises={
          template.exercises.length > 0
        }
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

      {/* ADD EXERCISE */}
      <button
        className="btn btn-standard btn-secondary btn-full"
        onClick={openLibrary}
      >
        Add exercise
      </button>

      {/* EXERCISES */}
      {template.exercises.map(
        (ex, i) => (
          <ExerciseItem
            key={ex.id}
            showCheckbox={false}
            ex={ex}
            i={i}
            navigate={navigate}
            addSet={addSet}
            updateSet={updateSet}
            removeSet={removeSet}
            removeExercise={
              removeExercise
            }
            updateExerciseNotes={
              updateExerciseNotes
            }
            restTime={ex.restTime}
            onChangeRestTime={(
              value,
            ) =>
              updateExerciseRest(
                i,
                value,
              )
            }
          />
        ),
      )}
    </div>
  )
}
