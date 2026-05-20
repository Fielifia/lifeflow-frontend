import clsx from 'clsx'

/**
 * Reusable statistics card.
 * @param {object} props - Component props
 * @param {object} props.icon - Card icon
 * @param {string} props.label - Statistic label
 * @param {string|number} props.value - Statistic value
 * @param {string} [props.unit] - Optional unit
 * @param {string} [props.trend] - Optional trend text
 * @param {string} [props.emphasis] - Visual emphasis style
 * @returns {import('react').ReactElement} Statistics card UI
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  emphasis = 'default',
}) {
  return (
    <article
      className={clsx(
        'card-base stat-card',
        emphasis === 'large' && 'stat-card-large'
      )}
    >
      <div className="stat-card-value">
        {Icon && (
          <Icon
            className="stat-card-icon"
          />
        )}
        <span>{value}</span>

        {unit && (
          <span className="stat-unit">
            {unit}
          </span>
        )}
      </div>

      <div className="stat-card-label">
        <span>{label}</span>
      </div>

      {trend && (
        <span className="stat-trend">
          {trend}
        </span>
      )}
    </article>
  )
}
