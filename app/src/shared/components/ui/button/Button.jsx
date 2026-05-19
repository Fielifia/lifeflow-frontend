/**
 * Reusable button component.
 * Handles variants, sizes, loading and layout modifiers.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'clean'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.cta]
 * @param {string} [props.className]
 * @param {'button'|'submit'|'reset'} [props.type]
 * @param {() => void} [props.onClick]
 * @returns {import('react').ReactElement} Button UI
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  cta = false,
  className = '',
  type = 'button',
  onClick,
}) {
  const classes = [
    'btn',

    `btn-${variant}`,

    cta
      ? 'btn-cta'
      : `btn-${size}`,

    fullWidth
      ? 'btn-full'
      : '',

    loading
      ? 'btn-loading'
      : '',

    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading
        ? 'Loading...'
        : children}
    </button>
  )
}
