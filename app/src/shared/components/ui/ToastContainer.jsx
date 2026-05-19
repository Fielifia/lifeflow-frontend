/**
 * Toast notification container.
 * Displays active toast notifications.
 * @param {object} props - Component props
 * @param {Array<{
 *  id: string | number,
 *  type: string,
 *  message: string
 * }>} props.toasts
 * Active toast notifications.
 * @returns {import('react').ReactElement} Toast container UI
 */
export default function ToastContainer({ toasts }) {
  return (

    <div className="toast-container">
      
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}

    </div>

  )
}
