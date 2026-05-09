import { useNavigate } from 'react-router-dom'

/**
 * Reusable back button.
 * @param {{ fallback?: string }} props - Fallback route
 * @returns {import('react').ReactElement} Back button UI
 */
export default function BackButton({ fallback = '/' }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (fallback) {
      navigate(fallback)
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
