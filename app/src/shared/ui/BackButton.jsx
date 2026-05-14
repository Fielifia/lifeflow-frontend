import { useNavigate } from 'react-router-dom'

/**
 * Reusable back button.
 *
 * Navigates back in browser history when possible.
 * Falls back to provided route if no history exists.
 *
 * @param {{
 *  fallback?: string,
 *  state?: object | null
 * }} props - Component props
 *
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({
  fallback = '/',
  state = null,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(fallback, { state })
  }

  return (
    <button
      onClick={handleBack}
      className="btn btn-standard back-btn"
    >
      ← Back
    </button>
  )
}
