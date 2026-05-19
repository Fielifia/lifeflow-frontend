import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * Reusable back button.
 * @param {object} props - Component props
 * @param {string} [props.fallback]
 * Fallback navigation path
 * @param {boolean} [props.warnOnUnsavedChanges]
 * Whether to warn before navigation
 * @param {boolean} [props.hasUnsavedChanges]
 * Whether unsaved changes exist
 * @param {() => void} [props.onDiscard]
 * Callback triggered when user confirms discard
 * @returns {import('react').ReactElement}
 * Back button UI
 */
export default function BackButton({
  fallback = '/',
  warnOnUnsavedChanges = false,
  hasUnsavedChanges = false,
  onDiscard,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (
      warnOnUnsavedChanges &&
      hasUnsavedChanges
    ) {
      const confirmed = window.confirm(
        'Discard unsaved changes?',
      )

      if (!confirmed) {
        return
      }

      onDiscard?.()
    }

    navigate(fallback)
  }

  return (
    <button
      onClick={handleBack}
      className="btn back-btn"
    >
      <ArrowLeft className="back-icon" />
    </button>
  )
}
