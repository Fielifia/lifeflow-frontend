import BackButton from '../../../shared/ui/BackButton'
import ExerciseItem from '../../workout/components/ExerciseItem'
import { useTemplateLogic } from '../hooks/useTemplateLogic'
import { useNavigate, useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'

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

    saveTemplate,
  } = useTemplateLogic(navigate, location, id)

  // ===== UI =====
  if (loading) return <p className="center">Loading...</p>

  return (
    <div className="card-base card-workout">
      <BackButton fallback="/templates" />
      {/* HEADER */}
      <h2>{isCreate ? 'Create Template' : 'Edit Template'}</h2>

      <input
        className="input-base"
        value={template.name}
        isEditing={isEditingName}
        setIsEditing={setIsEditingName}
        onChangeName={(value) =>
          setTemplate((prev) => ({ ...prev, name: value }))
        }
      />

      {/* TOP CONTROLS 
        <WorkoutControls
          status={status}
          handleStartPause={handleStartPause}
          saveWorkout={saveWorkout}
          onSaveTemplate={handleSaveTemplate}
          saving={saving}
          hasExercises={workout.exercises.length > 0}
        />*/}

      {/* REST TIMER 
        <RestTimer
          isResting={isResting}
          restRemaining={restRemaining}
          adjustRest={adjustRest}
          skipRest={skipRest}
        />*/}

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
          removeExercise={removeExercise}
          removeSet={removeSet}
          restTime={ex.restTime}
          onChangeRestTime={(value) => updateExerciseRest(i, value)}
        />
      ))}

      <button className="btn btn-primary btn-full" onClick={saveTemplate}>
        {saving ? 'Saving...' : 'Save Template'}
      </button>

      {/* BOTTOM CONTROLS
        {workout.exercises.length > 0 && (
          <WorkoutControls
            status={status}
            handleStartPause={handleStartPause}
            saveWorkout={saveWorkout}
            saving={saving}
            hasExercises={true}
          />
        )} */}

      {/* FEEDBACK */}
      {success && <p className="muted center">Template saved ✔</p>}
      {error && <p className="error center">{error}</p>}
    </div>
  )
}
