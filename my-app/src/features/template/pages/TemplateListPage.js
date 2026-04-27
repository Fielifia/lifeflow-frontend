import { useEffect, useState } from 'react'
import BackButton from '../../../shared/ui/BackButton'
import TemplateList from '../components/TemplateList'
import { getTemplates } from '../../../shared/api/templateApi'

/**
 * Page for browsing templates with search and pagination.
 * @returns {import('react').ReactElement} Template list page UI
 */
export default function TemplateListPage() {
  const [templates, setTemplates] = useState([])
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates({ limit: 100 })
        setTemplates(data.results || [])
      } catch (err) {
        console.error(err)
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

        {/* LIST */}
        <TemplateList templates={visibleTemplates} />

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
