import clsx from 'clsx'
import './StatCard.css'

/**
 * Reusable statistics card.
 *
 * Supports:
 * - icons
 * - supporting values
 * - trends
 * - emphasis variants
 * - typography sizing
 * - responsive grid spans
 * @param {object} props - Component props
 * @param {import('lucide-react').LucideIcon} [props.icon] - Card icon
 * @param {string} props.label - Statistic label
 * @param {string|number} props.value - Statistic value
 * @param {string} [props.subvalue] - Optional supporting value text
 * @param {string} [props.unit] - Optional value unit
 * @param {string} [props.trend] - Optional trend text
 * @param {'default'|'large'} [props.emphasis] - Card emphasis style
 * @param {'sm'|'md'|'lg'} [props.labelSize] - Label text size
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.valueSize] - Value text size
 * @param {'left'|'center'} [props.align] - Content alignment
 * @param {1|2} [props.gridSpan] - Grid column span
 * @returns {import('react').ReactElement} Statistics card UI
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  subvalue,
  unit,
  trend,

  emphasis = 'default',

  labelSize = 'md',
  valueSize = 'lg',

  align = 'left',
  gridSpan = 1,
}) {
  return (
    <article
      className={clsx(
        'card-base stat-card',

        emphasis === 'large' && 'stat-card-large',

        align === 'center' && 'stat-card-center',

        gridSpan === 2 && 'stat-card-span-2',
      )}
    >
      <div
        className={clsx(
          'stat-card-value',

          valueSize === 'xs' && 'stat-value-xs',

          valueSize === 'sm' && 'stat-value-sm',

          valueSize === 'md' && 'stat-value-md',

          valueSize === 'lg' && 'stat-value-lg',

          valueSize === 'xl' && 'stat-value-xl',
        )}
      >
        {Icon && <Icon className="stat-card-icon" />}

        <span>{value}</span>

        {unit && <span className="stat-unit">{unit}</span>}
      </div>

      <div
        className={clsx(
          'stat-card-label',

          labelSize === 'sm' && 'stat-label-sm',

          labelSize === 'md' && 'stat-label-md',

          labelSize === 'lg' && 'stat-label-lg',
        )}
      >
        <span>{label}</span>
      </div>

      {subvalue && <p className="stat-card-subvalue">{subvalue}</p>}

      {trend && <span className="stat-trend">{trend}</span>}
    </article>
  )
}
