import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTemplateLogic } from '../hooks/useTemplateLogic'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import Header from '../../../shared/ui/Header'
import BackButton from '../../../shared/ui/BackButton'
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
  
  const location = useLocation()
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

    saveTemplate,
  } = useTemplateLogic(navigate, location, id)

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

      <TemplateControls
        saveTemplate={saveTemplate}
        saving={saving}
      />

      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
