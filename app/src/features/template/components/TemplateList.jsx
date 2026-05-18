import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  deleteTemplateApi,
  getTemplatesApi,
} from '../../../shared/api/templateApi'
import DataState from '../../../shared/components/ui/DataState'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import TemplateCard from './TemplateCard'

/**
 * Displays a list of workout templates.
 * @param {object} props - Component props
 * @param {number} [props.limit] - Initial number of visible templates
 * @returns {import('react').ReactElement} Template list UI
 */
export default function TemplateList({ limit = 5 }) {
  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

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
        const data = await getTemplatesApi({ limit: 100 })
        setTemplates(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filteredTemplates.slice(0, visibleCount)

  const handleDeleteTemplate = async (id) => {
    const confirmed = window.confirm('Delete this template?')

    if (!confirmed) {
      return
    }

    try {
      await deleteTemplateApi(id)

      setTemplates((prev) => prev.filter((template) => template._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

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

      <DataState
        loading={loading}
        error={error}
        data={templates}
        variant="card-template"
        emptyText={
          search ? `No templates found for "${search}"` : 'No templates yet'
        }
        count={4}
      >
        <div className="section">
          {visible.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onDeleteTemplate={handleDeleteTemplate}
              onClick={() => {
                setReturnTo(location.pathname)

                navigate(`/templates/${template._id}`)
              }}
            />
          ))}
        </div>
      </DataState>

      {/* SHOW MORE */}
      {visibleCount < templates.length && (
        <button
          className="btn btn-standard btn-primary"
          onClick={() => setVisibleCount((prev) => prev + limit)}
        >
          Show more (+{Math.min(limit, templates.length - visibleCount)})
        </button>
      )}
    </div>
  )
}
