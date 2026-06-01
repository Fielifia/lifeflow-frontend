import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutPreviewCard from '../../../shared/components/cards/WorkoutPreviewCard'

/**
 * Displays a searchable list of workout templates with incremental loading.
 * @param {object} props - Component props.
 * @param {Array<object>} props.templates - Template list.
 * @param {boolean} props.loading - Loading state.
 * @param {string | null} props.error - Error message.
 * @param {number} props.limit - Number of templates to show per increment.
 * @param {(id: string) => void} [props.onDeleteTemplate] - Deletes a template.
 * @returns {import('react').ReactElement} Template list UI.
 */
export default function TemplateList({
  templates = [],
  loading,
  error,
  limit = 5,
  onDeleteTemplate,
}) {
  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const [search, setSearch] = useState('')

  const [visibleCount, setVisibleCount] = useState(limit)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filteredTemplates.slice(0, visibleCount)

  return (
    <div className="section">
      <h3>My Templates</h3>

      {/* SEARCH */}

      <input
        className="input-base"
        placeholder="Search templates..."
        value={search}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          setSearch(e.target.value)
          setVisibleCount(limit)
        }}
      />

      {/* TEMPLATES */}

      <DataState
        loading={loading}
        error={error}
        data={filteredTemplates}
        variant="card-template"
        emptyText="No templates found"
        count={5}
      >
        <div className="section">
          {visible.map((template) => {
            const menuItems = [
              {
                label: 'Open',
                onClick: () =>
                  navigate(`/templates/${template._id}?from=workouts`),
              },
              {
                label: 'Edit',
                onClick: () => navigate(`/templates/${template._id}/edit`),
              },
              {
                label: 'Delete',
                danger: true,
                onClick: () => void onDeleteTemplate(template._id),
              },
            ]

            return (
              <WorkoutPreviewCard
                key={template._id}
                title={template.name}
                exercises={template.exercises}
                menuItems={menuItems}
                onClick={() =>
                  navigate(`/templates/${template._id}?from=workouts`)
                }
                onStartWorkout={(e) => {
                  e.stopPropagation()

                  startWorkout({ template })
                }}
                hasExercises={template.exercises?.length > 0}
              />
            )
          })}
        </div>
      </DataState>

      {/* SHOW MORE */}

      {visibleCount < filteredTemplates.length && (
        <button
          className="btn btn-md btn-primary"
          onClick={() => setVisibleCount((prev) => prev + limit)}
        >
          Show more (+{Math.min(limit, filteredTemplates.length - visibleCount)}
          )
        </button>
      )}
    </div>
  )
}
