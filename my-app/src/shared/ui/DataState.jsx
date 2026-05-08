import Skeleton from './SkeletonGrid'

/**
 * DataState component to handle loading, error, and empty states for data fetching.
 * @param {object} param0 - Component props
 * @param {boolean} param0.loading - Indicates if data is currently being loaded
 * @param param0.error - Error message if data fetching failed
 * @param param0.data - The data that was fetched
 * @param param0.variant - The variant of the skeleton to display while loading (e.g., 'card', 'list')
 * @param param0.emptyText - Text to display when data is empty
 * @param param0.count - The number of skeleton items to display while loading
 * @param param0.children - The child components to render when data is successfully loaded
 * @returns {import('react').ReactElement} The appropriate UI based on the data state
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
  if (loading) {
    return <Skeleton variant={variant} count={count} />
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>{emptyText}</p>
      </div>
    )
  }

  return children
}
