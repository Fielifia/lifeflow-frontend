import { useNavigate } from 'react-router-dom'

/**
 * Reusable back button.
 * @param {{
 *  fallback?: string
 * }} props - Component props
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({
  fallback = '/',
}) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(fallback)}
      className="btn btn-standard back-btn"
    >
      ← Back
    </button>
  )
}
