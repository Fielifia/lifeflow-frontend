import { useNavigate } from 'react-router-dom'

import { ArrowLeft } from 'lucide-react'

import Button from './Button'

/**
 * Reusable back button.
 * @param {object} props
 * @param {string} props.fallback
 * @param {boolean} [props.warnOnUnsavedChanges]
 * @param {boolean} [props.hasUnsavedChanges]
 * @param {() => void} [props.onDiscard]
 * @returns {import('react').ReactElement}
 */
export default function BackButton({
  fallback,
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
    <Button
      variant="ghost"
      className="back-btn"
      size="icon"
      onClick={handleBack}
    >
      <ArrowLeft />
    </Button>
  )
}
