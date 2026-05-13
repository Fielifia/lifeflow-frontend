import { useNavigate } from 'react-router-dom'

/**
 * Reusable back button.
 * @param {{ fallback?: string, state?: object }} props - Navigation props
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({
  fallback = '/',
  state = null,
}) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (fallback) {
      navigate(fallback, { state })
      return
    }

    navigate(-1)
  }

  return (
    <button onClick={handleBack} className="btn btn-standard back-btn">
      ← Back
    </button>
  )
}
