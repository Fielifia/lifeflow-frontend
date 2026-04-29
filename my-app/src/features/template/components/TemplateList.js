import TemplateCard from './TemplateCard'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Displays a list of templates.
 * @param {{ templates: Array<object> }} props - Template list data
 * @returns {import('react').ReactElement} Template list UI
 */
export default function TemplateList({ templates = [] }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (templates.length === 0) {
    return <p className="muted center">No templates yet</p>
  }

  return (
    <div className="template-list">
      {templates.map((template) => (
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
  )
}
