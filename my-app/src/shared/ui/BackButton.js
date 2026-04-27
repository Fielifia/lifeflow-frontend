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
    if (location.state?.from) {
      navigate(location.state.from)
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
