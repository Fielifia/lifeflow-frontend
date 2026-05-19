/**
 * Reusable button component.
 * Handles variants, sizes, loading and layout modifiers.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'ghost'|'cta'} [props.variant]
 * @param {'sm'|'md'|'lg'|'icon'} [props.size]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.loading]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {'button'|'submit'|'reset'} [props.type]
 * @param {import('react').ReactNode} [props.leftIcon]
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} [props.onClick]
 * @returns {import('react').ReactElement} Button UI
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  leftIcon,
  onClick,
}) {
  const classes = [
    'btn',

    `btn-${variant}`,

    `btn-${size}`,

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
      {loading ? (
        <span className="spinner" />
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  )
}
