import { createContext, useContext, useState, useCallback } from 'react'
import ToastContainer from '../ui/ToastContainer'

const ToastContext = createContext()

/**
 * Toast context provider.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Provider children
 * @returns {import('react').ReactElement} Toast provider UI
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const show = useCallback(({ message, duration = 3000, type = 'default' }) => {
    const id = Date.now()

    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => remove(id), duration)
  }, [])

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
