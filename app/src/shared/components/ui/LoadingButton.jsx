/**
 * Button component with loading spinner support.
 * @param {object} props - Component props
 * @param {boolean} props.loading - Whether button is loading
 * @param {string} [props.loadingText] - Optional loading text override
 * @param {import('react').ReactNode} props.children - Button content
 * @returns {import('react').ReactElement} Loading button UI
 */
export default function LoadingButton({
  loading,
  loadingText,
  children,
  ...props
}) {
  return (

    <button {...props} disabled={loading || props.disabled}>
      {loading && <span className="spinner"></span>}

      <span>{loading ? loadingText || children : children}</span>
    </button>

  )
}
