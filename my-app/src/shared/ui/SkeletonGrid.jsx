/**
 * SkeletonGrid component to display a grid of skeleton cards.
 * @param {object} param0 - Component props
 * @param param0.variant - The variant of the skeleton to display (e.g., 'card', 'list')
 * @param {number} [param0.count] - Number of skeleton cards to display
 * @returns {import('react').ReactElement} Skeleton grid UI
 */
export default function Skeleton({ variant = 'card', count = 12 }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton-${variant}`} />
      ))}
    </div>
  )
}
