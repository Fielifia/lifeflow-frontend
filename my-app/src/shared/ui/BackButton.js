import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Reusable back button.
 *
 * Uses location.state.from if available, otherwise goes back.
 */
export default function BackButton({
  fallback = -1,
  className = 'btn back-btn',
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    const target = location.state?.from
    if (target) {
      navigate(target)
    } else {
      navigate(fallback)
    }
  }

  return (
    <button onClick={handleBack} className={className}>
      ← Back
    </button>
  )
}
