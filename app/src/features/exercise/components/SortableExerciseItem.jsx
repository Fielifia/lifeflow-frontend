import { useSortable } from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

/**
 * Sortable wrapper for workout exercises.
 *
 * Provides drag-and-drop state and drag handle props
 * using dnd-kit sortable utilities.
 * @param {object} props - Component props.
 * @param {string} props.id - Unique sortable item id.
 * @param {(props: {
 *  dragHandleProps: object
 * }) => import('react').ReactNode} props.children
 * Render function receiving drag handle props.
 * @returns {import('react').ReactElement}
 * Sortable exercise wrapper.
 */
export default function SortableExerciseItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging' : ''}
    >
      {children({
        dragHandleProps: {
          ...attributes,
          ...listeners,
        },
      })}
    </div>
  )
}
