import SkeletonGrid from './SkeletonGrid'

/**
 * Handles loading, error, empty, and content states
 * for fetched data.
 * @param {object} props - Component props.
 * @param {boolean} props.loading - Indicates if data is loading.
 * @param {string|null} props.error - Error message if request failed.
 * @param {object|Array|null} props.data - Data used to determine empty state.
 * @param {string} [props.variant] - Skeleton variant.
 * @param {string} [props.emptyTitle] - Empty state title.
 * @param {string} [props.emptyText] - Empty state description.
 * @param {number} [props.count] - Number of skeleton items.
 * @param {import('react').ReactNode} props.children - Content to render when data exists.
 * @returns {import('react').ReactElement} UI based on current data state.
 */
export default function DataState({
  loading,
  error,
  data,
  variant = 'card',
  emptyTitle,
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
    (typeof data === 'object' &&
      !Array.isArray(data) &&
      Object.keys(data).length === 0)

  if (isEmpty) {
    return (
      <div className="empty-state">
        {emptyTitle && <h3>{emptyTitle}</h3>}
        <p>{emptyText}</p>
      </div>
    )
  }

  // ===== CONTENT =====

  return children
}
