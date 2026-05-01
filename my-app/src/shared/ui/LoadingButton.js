/**
 * A button component that displays a loading state while an operation is in progress.
 * @param {{ loading: boolean, children: import('react').ReactNode }} param0 - The component props
 * @returns {import('react').ReactElement} The loading button UI
 */
export default function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading}>
      {loading ? <span className="spinner"></span> : children}
    </button>
  )
}
