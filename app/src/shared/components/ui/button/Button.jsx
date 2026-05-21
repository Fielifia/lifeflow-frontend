/**
 * Reusable button component.
 * Handles variants, sizes,
 * loading, and layout modifiers.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'danger'|'ghost'|'cta'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'|'icon'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should fill container width
 * @param {boolean} props.loading - Whether button is loading
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {'button'|'submit'|'reset'} props.type - Native button type
 * @param {import('react').ReactNode} props.leftIcon - Icon displayed before content
 * @param {(event: object) => void} props.onClick - Click handler
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
