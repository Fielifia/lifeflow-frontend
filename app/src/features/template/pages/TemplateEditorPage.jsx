import { useState } from 'react'

import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { DndContext, closestCenter } from '@dnd-kit/core'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableExerciseItem from '../../exercise/components/SortableExerciseItem'

import { useTemplateManager } from '../hooks/useTemplateManager'

import BackButton from '../../../shared/components/ui/button/BackButton'
import Button from '../../../shared/components/ui/button/Button'

import Header from '../../../shared/components/ui/Header'

import EditModal from '../../workout/components/time/EditModal'

import DataState from '../../../shared/components/ui/skeleton/DataState'
import WorkoutControls from '../../../shared/components/ui/WorkoutControls/WorkoutControls'

import WorkoutHeader from '../../workout/components/WorkoutHeader'

import ExerciseItem from '../../exercise/components/ExerciseItem/ExerciseItem'

/**
 * Page for creating and editing workout templates.
 * @returns {import('react').ReactElement} - Template create/edit UI
 */
export default function TemplateEditorPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)

  const from = searchParams.get('from')

  const fallback = from === 'workouts' ? '/workouts' : '/templates'

  const { id } = useParams()
  const isCreate = !id

  const [showRenameModal, setShowRenameModal] = useState(false)

  const [tempTemplateName, setTempTemplateName] = useState('')

  const {
    template,
    setTemplate,

    loading,
    saving,
    error,

    openLibrary,
    exerciseActions,

    updateTemplateNotes,

    hasUnsavedChanges,

    saveTemplate,
    discardTemplate,

    discardChanges,
  } = useTemplateManager(id, navigate)

  // ===== REORDER =====

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = template.exercises.findIndex((ex) => ex.id === active.id)

    const newIndex = template.exercises.findIndex((ex) => ex.id === over.id)

    exerciseActions.reorderExercises(oldIndex, newIndex)
  }

  // ===== RENAME MODAL =====

  const openRenameModal = () => {
    setTempTemplateName(template.name)
    setShowRenameModal(true)
  }

  // ===== ACTION MENU =====

  const templateMenuItems = [
    {
      label: 'Rename',
      onClick: openRenameModal,
    },

    {
      label: 'Default Rest Time',
      subtitle: '120s',
      onClick: () => console.log('default rest'),
    },

    {
      divider: true,
    },

    {
      label: 'Duplicate Template',
      onClick: () => console.log('duplicate template'),
    },
  ]

  // ===== LOADING / ERROR / EMPTY =====

  if (loading || error || !template) {
    return (
      <div className="app">
        <Header subtitle={isCreate ? 'Create Template' : 'Edit Template'} />

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

      <Header subtitle={isCreate ? 'Create Template' : 'Edit Template'} />

      {/* BACK BUTTON */}

      <BackButton
        fallback={fallback}
        warnOnUnsavedChanges
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={!isCreate ? discardChanges : undefined}
        onDiscardTemplate={isCreate ? discardTemplate : undefined}
      />

      {/* WORKOUT HEADER */}

      <WorkoutHeader
        name={template.name}
        onEditName={openRenameModal}
        showDuration={false}
        menuItems={templateMenuItems}
      />

      {/* RENAME MODAL */}

      {showRenameModal && (
        <EditModal
          title="Edit template name"
          tempValue={tempTemplateName}
          setTempValue={setTempTemplateName}
          onClose={() => setShowRenameModal(false)}
          onSave={() => {
            setTemplate((prev) => ({
              ...prev,
              name: tempTemplateName.trim() || 'Template',
            }))

            setShowRenameModal(false)
          }}
        />
      )}

      {/* CONTROLS */}
      <div className="container">
        <WorkoutControls
          variant="editor"
          saving={saving}
          onSave={saveTemplate}
          onDiscardChanges={!isCreate ? discardChanges : undefined}
          onDiscardTemplate={isCreate ? discardTemplate : undefined}
          saveLabel="Save template"
          discardLabel="Discard"
          discardChangesLabel="Discard Changes"
          hasUnsavedChanges={hasUnsavedChanges}
          hasExercises={template.exercises.length > 0}
        />

        {/* FEEDBACK */}

        {error && <p className="error center">{error}</p>}

        {/* ADD EXERCISE(S) */}

        <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
          Add exercise
        </Button>
      </div>

      {/* EMPTY TEMPLATE */}

      <DataState
        data={template.exercises}
        emptyText="Add your first exercise to start building your template."
      >
        <div className="section">
          {/* EXERCISES */}

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={template.exercises.map((ex) => ex.id)}
              strategy={verticalListSortingStrategy}
            >
              {template.exercises.map((ex, i) => (
                <SortableExerciseItem key={ex.id} id={ex.id}>
                  {({ dragHandleProps }) => (
                    <ExerciseItem
                      mode="template"
                      ex={ex}
                      i={i}
                      navigate={navigate}
                      actions={exerciseActions}
                      dragHandleProps={dragHandleProps}
                    />
                  )}
                </SortableExerciseItem>
              ))}
            </SortableContext>
          </DndContext>

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
      </DataState>

      {/* BOTTOM ACTIONS */}

      {template.exercises.length >= 3 && (
        <div className="container">
          {/* ADD EXERCISE */}

          <Button variant="secondary" size="md" fullWidth onClick={openLibrary}>
            Add exercise
          </Button>

          <WorkoutControls
            variant="editor"
            saving={saving}
            onSave={saveTemplate}
            onDiscardChanges={!isCreate ? discardChanges : undefined}
            onDiscardTemplate={isCreate ? discardTemplate : undefined}
            saveLabel="Save template"
            discardLabel="Discard"
            discardChangesLabel="Discard Changes"
            hasUnsavedChanges={hasUnsavedChanges}
            hasExercises={template.exercises.length > 0}
          />
        </div>
      )}
    </div>
  )
}
