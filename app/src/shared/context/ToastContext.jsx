import {
  createContext,
  useCallback,
  useContext,
  useState

} from 'react'

import ToastContainer from '../components/ui/ToastContainer'

/**
 * Accesses toast notification actions.
 * @returns {{
 *  show:(params:{
 *    message:string,
 *    duration?:number,
 *    type?:string
 *  })=>void,
 *  success:(message:string)=>void,
 *  error:(message:string)=>void,
 *  warning:(message:string)=>void
 * }} Toast actions
 */
const ToastContext = createContext()

/**
 * Toast notification provider.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Provider children
 * @returns {import('react').ReactElement} Toast provider UI
 */
export function ToastProvider({ children }) {

  const [toasts, setToasts] = useState([])

  // ===== REMOVE TOAST =====

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ===== SHOW TOAST =====

  const show = useCallback(({ message, duration = 3000, type = 'default' }) => {
    const id = Date.now()

    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => remove(id), duration)
  }, [])

  // ===== TOAST API =====

  const api = {
    show,
    success: (msg) => show({ message: msg, type: 'success' }),
    error: (msg) => show({ message: msg, type: 'error' }),
    warning: (msg) => show({ message: msg, type: 'warning' }),
  }

  return (

    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>

  )
}

export const useToast = () => useContext(ToastContext)
