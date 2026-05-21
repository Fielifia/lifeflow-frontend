import StatCard from './StatCard'

/**
 * Reusable statistics grid.
 *
 * Displays a collection of stat cards.
 * @param {object} props - Component props
 * @param {Array<object>} props.items - Stat card items
 * @returns {import('react').ReactElement} Stats grid UI
 */
export default function StatsGrid({
  items = [],
}) {
  return (
    <div className="grid-base stats-grid">

      {items.map((item) => (
        <StatCard
          key={item.label}
          {...item}
        />
      ))}

    </div>
  )
}
