import { useNavigate } from 'react-router-dom'

import { ArrowLeft } from 'lucide-react'

import { useConfirm } from '../../../hooks/useConfirm'

import Button from './Button'

/**
 * Reusable navigation back button.
 *
 * Supports optional unsaved changes confirmation
 * before navigating away.
 * @param {object} props - Component props.
 * @param {string} props.fallback - Route to navigate to.
 * @param {boolean} [props.warnOnUnsavedChanges]
 * Whether to show discard confirmation.
 * @param {boolean} [props.hasUnsavedChanges]
 * Whether unsaved changes currently exist.
 * @param {() => void} [props.onDiscard]
 * Callback triggered after confirming discard.
 * @returns {import('react').ReactElement}
 * Back button UI.
 */
export default function BackButton({
  fallback,
  warnOnUnsavedChanges = false,
  hasUnsavedChanges = false,
  onDiscard,
}) {
  const navigate = useNavigate()

  const confirm = useConfirm()

  const handleBack = async () => {
    if (
      warnOnUnsavedChanges &&
      hasUnsavedChanges
    ) {
      const confirmed = await confirm({
        title: 'Discard changes?',
        description: 'Your edits will be lost.',
        confirmText: 'Discard',
      })

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
