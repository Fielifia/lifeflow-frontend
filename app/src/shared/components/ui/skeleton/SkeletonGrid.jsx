/**
 * Displays skeleton placeholder items.
 * @param {object} props - Component props
 * @param {string} [props.variant] - Skeleton variant
 * @param {number} [props.count] - Number of skeleton items
 * @returns {import('react').ReactElement} Skeleton grid UI
 */
export default function Skeleton({ variant = 'card', count = 12 }) {

  return (

    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton-card skeleton-${variant}`} />
      ))}

    </div>

  )
}
