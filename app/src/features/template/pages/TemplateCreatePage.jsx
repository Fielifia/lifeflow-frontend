import { useNavigate, useParams } from 'react-router-dom'
import BackButton from '../../../shared/ui/BackButton'
import Header from '../../../shared/ui/Header'
import ExerciseItem from '../../workout/components/ExerciseItem'
import WorkoutHeader from '../../workout/components/WorkoutHeader'
import TemplateControls from '../components/TemplateControls'
import { useTemplateManager } from '../hooks/useTemplateManager'

/**
 * Page for creating and editing workout templates.
 *
 * Supports both:
 * - Create mode (no id in route)
 * - Edit mode (template id in route)
 *
 * Features:
 * - Load existing template when editing
 * - Add exercises from Exercise Library (select mode)
 * - Manage sets (reps, weight)
 * - Update rest time per exercise
 * - Remove exercises and sets
 * - Save template (create or update)
 *
 * Navigation flow:
 * - Opens Exercise Library in select mode
 * - Receives selected exercises via ExerciseFlowContext
 * - Uses shared flow state for navigation handling
 *
 * State structure:
 * template = {
 *   name: string,
 *   exercises: [
 *     {
 *       id: string,
 *       name: string,
 *       image?: string,
 *       restTime: number,
 *       sets: [
 *         { reps: number, weight: number }
 *       ]
 *     }
 *   ]
 * }
 * @returns {import('react').ReactElement} Template edit/create page UI
 */
export default function TemplateEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isCreate = !id

  const {
    template,
    saving,
    success,
    error,
    setTemplate,
    loading,

    isEditingName,
    setIsEditingName,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    updateExerciseRest,
    updateExerciseNotes,

    saveCurrentTemplate,
  } = useTemplateManager(navigate, id)

  // ===== UI =====
  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="app">
      <Header
        title={template.name}
        subtitle={isCreate ? 'Create Template' : 'Edit Template'}
      />
      <BackButton fallback="/workouts" />

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


      <TemplateControls
        onSaveTemplate={saveCurrentTemplate}
        saving={saving}
        hasExercises={template.exercises.length > 0}
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


      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
