import { useEffect, useState } from 'react'
import { getTemplates } from '../../../shared/api/templateApi'
import TemplateItem from '../components/TemplateItem'

/**
 *
 * @param root0
 * @param root0.limit
 * @param root0.title
 */
export default function TemplateList({ limit = 5, title = 'Templates' }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates({ page: 1, limit })
        setTemplates(data?.results || [])
      } catch (err) {
        console.error(err)
        setTemplates([])
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [limit])

  if (loading) return <p>Loading...</p>

  return (
    <div className="section">
      <h2>{title}</h2>

      {templates.length === 0 ? (
        <p className="muted">No templates yet</p>
      ) : (
        templates.map((t) => <TemplateItem key={t._id} template={t} />)
      )}
    </div>
  )
}
