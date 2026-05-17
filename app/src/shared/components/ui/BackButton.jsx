import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * Reusable back button.
 * @param {object} props - Component props
 * @param {string} [props.fallback='/'] - Fallback navigation path
 * @param {boolean} [props.warnOnUnsavedChanges=false] - Whether to warn before navigation
 * @param {boolean} [props.hasUnsavedChanges=false] - Whether unsaved changes exist
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({
  fallback = '/',
  warnOnUnsavedChanges = false,
  hasUnsavedChanges = false,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (warnOnUnsavedChanges && hasUnsavedChanges) {
      const confirmed = window.confirm('Discard unsaved changes?')

      if (!confirmed) {
        return
      }
    }

    navigate(fallback)
  }

  return (
    <button onClick={handleBack} className="btn back-btn">
      <ArrowLeft />
    </button>
  )
}
