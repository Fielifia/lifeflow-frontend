import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Reusable back button.
 * @param {{ fallback?: string }} props - Fallback route
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({ fallback = '/' }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    const { from, ...restState } = location.state || {}

    if (from) {
      navigate(from, {
        state: restState,
      })
    } else {
      navigate(fallback)
    }
  }

  return (
    <button onClick={handleBack} className="btn back-btn">
      ← Back
    </button>
  )
}
