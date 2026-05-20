import SkeletonGrid from './SkeletonGrid'

/**
 * Handles loading, error, and empty states
 * for fetched data.
 * @param {object} props - Component props
 * @param {boolean} props.loading - Indicates if data is loading
 * @param {string|null} props.error - Error message if request failed
 * @param {object|Array|null} props.data - Data used to determine empty state
 * @param {string} [props.variant] - Skeleton variant - Skeleton variant
 * @param {string} [props.emptyText] - Empty state text
 * @param {number} [props.count] - Number of skeleton items
 * @param {import('react').ReactNode} props.children - Rendered content
 * @returns {import('react').ReactElement} UI based on current data state
 */
export default function DataState({
  loading,
  error,
  data,
  variant = 'card',
  emptyText = 'No data found',
  count = 6,
  children,
}) {

  // ===== LOADING =====

  if (loading) {
    return <SkeletonGrid variant={variant} count={count} />
  }

  // ===== ERROR =====

  if (error) {
    return (
      <div className="empty-state">
        <p className="error">{error}</p>
      </div>
    )
  }

  // ===== EMPTY =====

  const isEmpty =
    !data ||
    (Array.isArray(data) && data.length === 0) ||
    (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0
    )

  if (isEmpty) {
    return (
      <div className="empty-state">
        <p>{emptyText}</p>
      </div>
    )
  }

  // ===== CONTENT =====

  return children
}
