import { useNavigate } from 'react-router-dom'
import TemplateList from './TemplateList.js'

/**
 *
 */
export default function Templates() {
  const navigate = useNavigate()
  return (
    <div className="card-base">
      <TemplateList />
      <button
        className="btn btn-primary btn-full"
        onClick={() => navigate('/templates/create')}
      >
        Create new template
      </button>
    </div>
  )
}
