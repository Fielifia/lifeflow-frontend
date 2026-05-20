import StatCard from './StatCard'

/**
 * Reusable statistics grid.
 * @param {object} props - Component props
 * @param {Array<object>} props.items - Stat items
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
          icon={item.icon}
          label={item.label}
          value={item.value}
          emphasis={item.emphasis}
        />
      ))}

    </div>
  )
}
