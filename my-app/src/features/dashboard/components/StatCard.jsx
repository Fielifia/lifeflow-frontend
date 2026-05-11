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
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </article>
  )
}
