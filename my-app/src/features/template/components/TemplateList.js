import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTemplates } from '../../../shared/api/templateApi'
import DataState from '../../../shared/ui/DataState'
import TemplateCard from './TemplateCard'

/**
 * Displays a list of templates.
 * @param {{ templates: Array<object> }} props - Template list data
 * @returns {import('react').ReactElement} Template list UI
 */
export default function TemplateList({ limit = 5 }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [visibleCount, setVisibleCount] = useState(limit)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTemplates({ limit: 100 })
        setTemplates(data.results || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // ===== FILTER =====
  const filtered = templates.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filtered.slice(0, visibleCount)

  return (
    <div className="page-section">
      <h3 className="close">My Templates</h3>

      {/* SEARCH */}
      <input
        className="input-base"
        placeholder="Search templates..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setVisibleCount(limit)
        }}
      />

      <DataState
        loading={loading}
        error={error}
        data={filtered}
        variant="card-template"
        emptyText={
          search ? `No templates found for "${search}"` : 'No templates yet'
        }
        count={4}
      >
        <div className="page-section">
          {visible.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onClick={() =>
                navigate(`/templates/${template._id}`, {
                  state: {
                    template,
                    from: location.pathname,
                  },
                })
              }
            />
          ))}
        </div>
      </DataState>

      {/* SHOW MORE */}
      {visibleCount < filtered.length && (
        <button
          className="btn btn-primary"
          onClick={() => setVisibleCount((prev) => prev + limit)}
        >
          Show more (+{Math.min(limit, filtered.length - visibleCount)})
        </button>
      )}
    </div>
  )
}
