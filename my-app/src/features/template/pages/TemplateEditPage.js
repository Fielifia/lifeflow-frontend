import BackButton from '../../../shared/ui/BackButton'
import ExerciseItem from '../../workout/components/ExerciseItem'
import { useTemplateLogic } from '../hooks/useTemplateLogic'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import TemplateHeader from '../components/TemplateHeader'

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
 * - Receives selected exercises via location.state
 * - Returns to originating route using `from` and `mode`
 *
 * State structure:
 * template = {
 *   name: string,
 *   exercises: [
 *     {
 *       exerciseId: string,
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
  const location = useLocation()

  const { id } = useParams()
  const isCreate = !id

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
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    updateExerciseRest,
    updateExerciseNotes,

    saveTemplate,
  } = useTemplateLogic(navigate, location, id)

  // ===== UI =====
  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/templates" />
      {/* HEADER */}
      <h2>{isCreate ? 'Create Template' : 'Edit Template'}</h2>

      {/* HEADER */}
      <TemplateHeader
        name={template.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setTemplate((prev) => ({ ...prev, name: value }))
        }
      />

      {/* ADD EXERCISE */}
      <button className="btn btn-secondary btn-full" onClick={openLibrary}>
        Add exercise
      </button>

      {/* EXERCISES */}
      {template.exercises.map((ex, i) => (
        <ExerciseItem
          showCheckbox={false}
          key={ex.exerciseId}
          ex={ex}
          i={i}
          navigate={navigate}
          addSet={addSet}
          updateSet={updateSet}
          updateExerciseNotes={updateExerciseNotes}
          removeExercise={removeExercise}
          removeSet={removeSet}
          restTime={ex.restTime}
          onChangeRestTime={(value) => updateExerciseRest(i, value)}
        />
      ))}

      <button className="btn btn-primary btn-full" onClick={saveTemplate}>
        {saving ? 'Saving...' : 'Save Template'}
      </button>

      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
