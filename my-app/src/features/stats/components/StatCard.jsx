import clsx from 'clsx'

/**
 * Reusable statistics card.
 *
 * @param {object} props
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.unit]
 * @param {string} [props.trend]
 * @param {'default' | 'large'} [props.emphasis]
 * @returns {import('react').ReactElement}
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
