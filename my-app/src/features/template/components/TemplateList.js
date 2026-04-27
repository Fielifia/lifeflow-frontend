import TemplateItem from './TemplateItem'

/**
 * Displays a list of templates.
 * @param {{ templates: Array<object> }} props - Template list data
 * @returns {import('react').ReactElement} Template list UI
 */
export default function TemplateList({ templates = [] }) {
  if (templates.length === 0) {
    return <p className="muted">No templates yet</p>
  }

  return (
    <div className="template-list">
      {templates.map((t) => (
        <TemplateItem key={t._id} template={t} />
      ))}
    </div>
  )
}
