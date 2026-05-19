import { useState } from 'react'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import TemplateCard from './TemplateCard'

/**
 * Displays a list of workout templates.
 * @param {object} props - Component props
 * @param {Array<object>} props.templates - Template list
 * @param {(id: string) => void} [props.onDeleteTemplate] - Deletes template
 * @param {number} [props.limit=5] - Visible template increment count
 * @returns {import('react').ReactElement} Template list UI
 */
export default function TemplateList({
  templates = [],
  limit = 5,
  onDeleteTemplate,
}) {

  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const [search, setSearch] = useState('')

  const [visibleCount, setVisibleCount] = useState(limit)

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filteredTemplates.slice(0, visibleCount)

  return (
    <div className="section">
      <h3 className="close">My Templates</h3>

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

      <div className="section">
        {visible.map((template) => (
          <TemplateCard
            key={template._id}
            template={template}
            onDeleteTemplate={onDeleteTemplate}
            onClick={() => {
              setReturnTo(location.pathname)

              navigate(`/templates/${template._id}`)
            }}
          />
        ))}
      </div>

      {/* SHOW MORE */}

      {visibleCount < filteredTemplates.length && (
        <button
          className="btn btn-md btn-primary"
          onClick={() => setVisibleCount((prev) => prev + limit)}
        >
          Show more (+{Math.min(limit, filteredTemplates.length - visibleCount)})
        </button>
      )}
    </div>
  )
}
