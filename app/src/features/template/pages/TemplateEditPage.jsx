import { useNavigate, useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/ui/BackButton'
import Header from '../../../shared/ui/Header'
import ExerciseItem from '../../workout/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'
import TemplateControls from '../components/TemplateControls'

/**
 * Page for editing a workout template.
 * @returns {import('react').ReactElement} Template edit page UI
 */
export default function TemplateEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isCreate = !id

  const {
    template,
    loading,
    saving,
    error,
    success,

    setTemplate,

    addSet,
    updateSet,
    removeExercise,
    removeSet,

    updateExerciseRest,
    updateExerciseNotes,

    isEditingName,
    setIsEditingName,

    openLibrary,

    saveCurrentTemplate,
    deleteCurrentTemplate,
  } = useTemplateManager(navigate, id)

  const { returnTo } = useExerciseFlow()

  // ===== UI =====
  if (loading) return <p className="center">Loading...</p>
  if (!template) return <p className="center">Template not found</p>

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={isCreate ? 'Create Template' : 'Edit Template'}
      />
      <BackButton
        fallback={returnTo || '/workouts'}
      />

      {/* HEADER */}
      <WorkoutHeader
        name={template.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setTemplate((prev) => ({ ...prev, name: value }))
        }
        isEditable={true}
        showDuration={false}
      />

      <TemplateControls
        onSaveTemplate={saveCurrentTemplate}
        saving={saving}
        onDeleteCurrentTemplate={deleteCurrentTemplate}
      />

      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}

      {/* ADD EXERCISE */}
      <button className="btn btn-standard btn-secondary btn-full" onClick={openLibrary}>
        Add exercise
      </button>

      {/* EXERCISES */}
      {template.exercises.map((ex, i) => (
        <ExerciseItem
          showCheckbox={false}
          key={ex.id}
          ex={ex}
          i={i}
          navigate={navigate}
          addSet={addSet}
          updateSet={updateSet}
          removeExercise={removeExercise}
          removeSet={removeSet}
          updateExerciseNotes={updateExerciseNotes}
          restTime={ex.restTime}
          onChangeRestTime={(value) => updateExerciseRest(i, value)}
        />
      ))}

    </div>
  )
}
