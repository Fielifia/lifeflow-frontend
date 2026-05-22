import clsx from 'clsx'
import './StatCard.css'

/**
 * Reusable statistics card.
 *
 * Supports:
 * - icons
 * - subtitles
 * - trends
 * - emphasis variants
 * - typography sizing
 * @param {object} props - Component props
 * @param {import('lucide-react').LucideIcon} [props.icon] - Card icon
 * @param {string} props.label - Statistic label
 * @param {string|number} props.value - Statistic value
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.unit] - Optional value unit
 * @param {string} [props.trend] - Optional trend text
 * @param {'default'|'large'} [props.emphasis] - Card emphasis style
 * @param {'sm'|'md'|'lg'} [props.labelSize] - Label text size
 * @param {'sm'|'md'|'lg'|'xl'} [props.valueSize] - Value text size
 * @param {'left'|'center'} [props.align] - Content alignment
 * @returns {import('react').ReactElement} Statistics card UI
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  unit,
  trend,

  emphasis = 'default',

  labelSize = 'md',
  valueSize = 'lg',

  align = 'left',
}) {

  return (
    <article
      className={clsx(
        'card-base stat-card',

        emphasis === 'large' &&
        'stat-card-large',

        align === 'center' &&
        'stat-card-center',
      )}
    >
      <div
        className={clsx(
          'stat-card-value',

          valueSize === 'sm' &&
          'stat-value-sm',

          valueSize === 'md' &&
          'stat-value-md',

          valueSize === 'lg' &&
          'stat-value-lg',

          valueSize === 'xl' &&
          'stat-value-xl',
        )}
      >
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

      <div
        className={clsx(
          'stat-card-label',

          labelSize === 'sm' &&
          'stat-label-sm',

          labelSize === 'md' &&
          'stat-label-md',

          labelSize === 'lg' &&
          'stat-label-lg',
        )}
      >
        <span>{label}</span>
      </div>

      {subtitle && (
        <p className="stat-card-subtitle">
          {subtitle}
        </p>
      )}

      {trend && (
        <span className="stat-trend">
          {trend}
        </span>
      )}
    </article>
  )
}
