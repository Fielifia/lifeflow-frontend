import { useNavigate } from 'react-router-dom'

import { ArrowLeft } from 'lucide-react'

import Button from './Button'

/**
 * Reusable navigation back button.
 * @param {object} props - Component props.
 * @param {string} props.fallback - Route to navigate to when going back.
 * @param {boolean} props.warnOnUnsavedChanges - Whether to show a warning before navigating away.
 * @param {boolean} props.hasUnsavedChanges - Whether there are unsaved changes.
 * @param {() => void} [props.onDiscard] - Callback triggered after confirming discard.
 * @returns {import('react').ReactElement} - Back button component
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
