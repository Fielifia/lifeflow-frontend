import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../../shared/ui/BackButton'
import TemplateList from '../components/TemplateList'
import { getTemplates } from '../../../shared/api/templateApi'
import DataState from '../../../shared/ui/DataState'

/**
 * Page for browsing templates with search and pagination.
 * @returns {import('react').ReactElement} Template list page UI
 */
export default function TemplateListPage() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTemplates({ limit: 100 })
        setTemplates(data.results || [])
      } catch (err) {
        console.error(err)
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

  const visibleTemplates = filtered.slice(0, visibleCount)

  return (
    <div className="app">
      <BackButton fallback="/workout" />

      <div className="section">
        <button
          className="btn btn-primary btn-full"
          onClick={() => navigate('/templates/create')}
        >
          Create template
        </button>

        {/* SEARCH */}
        <input
          className="input-base"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setVisibleCount(10)
          }}
        />

        <h2>Saved Templates</h2>

        {/* LIST */}
        <DataState
          loading={loading}
          error={error}
          data={filtered}
          variant="card-template"
          emptyText="No templates found"
          count={4}
        >
          <TemplateList templates={visibleTemplates} />
        </DataState>

        {/* LOAD MORE */}
        {visibleCount < filtered.length && (
          <button
            className="btn btn-primary"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Show more ({filtered.length - visibleCount} left)
          </button>
        )}
      </div>
    </div>
  )
}
