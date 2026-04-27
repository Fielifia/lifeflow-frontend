import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Reusable back button.
 *
 * Uses location.state.from if available, otherwise goes back.
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
