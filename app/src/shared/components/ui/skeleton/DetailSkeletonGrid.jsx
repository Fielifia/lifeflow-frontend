/**
 * Skeleton loader for detail pages.
 *
 * Displays loading placeholders for workout or template detail views.
 * @param {object} props - Component props.
 * @param {'workout' | 'template'} [props.type='workout'] - Determines which skeleton sections to render.
 * @returns {import('react').ReactElement} Rendered detail skeleton component.
*/
export default function DetailSkeleton({
  type = 'workout',
}) {
  return (
    <div className="section detail-skeleton">

      {/* Header */}

      <div className="detail-skeleton-header">
        <div className="skeleton skeleton-detail-title" />
        <div className="skeleton skeleton-detail-subtitle" />
      </div>

      {/* Controls */}

      <div className="workout-controls-detail">
        <div className="skeleton skeleton-detail-btn" />
        <div className="skeleton skeleton-detail-btn" />
        <div className="skeleton skeleton-detail-btn" />
      </div>

      {/* Summary */}

      {type === 'workout' && (
        <div className="workout-summary-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-summary-card"
            />
          ))}
        </div>
      )}

      {/* Exercises */}

      <div className="section">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-exercise-item"
          />
        ))}
      </div>

      {/* Notes */}

      <div className="section">
        <h3>Notes</h3>

        <div className="skeleton skeleton-note" />
      </div>

    </div>
  )
}
