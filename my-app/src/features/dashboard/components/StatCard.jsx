/**
 * Dashboard statistics card.
 *
 * @param {object} props - Component props
 * @param {string} props.label - Statistic label
 * @param {string|number} props.value - Statistic value
 * @returns {import('react').ReactElement}
 */
export default function StatCard({ label, value }) {
  return (
    <article className="card-base stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </article>
  )
}
