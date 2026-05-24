import { createContext, useCallback, useMemo, useState } from 'react'

import ConfirmDialog from '../components/ui/confirm/ConfirmDialog'

/**
 * Global confirmation dialog context.
 *
 * Provides:
 * - promise-based confirm dialogs
 * - shared modal state
 * - reusable confirmation flows
 */
export const ConfirmContext = createContext(null)

/**
 * Confirmation dialog provider.
 *
 * Wraps the application with:
 * - confirm dialog state
 * - promise-based confirm handling
 * - global confirmation modal rendering
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Provider children
 * @returns {import('react').ReactElement} Confirm provider
 */
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)

  const [resolver, setResolver] = useState(null)

  /**
   * Opens a confirmation dialog.
   * @param {object} config - Confirm dialog configuration
   * @param {string} config.title - Dialog title
   * @param {string} [config.description] - Optional dialog description
   * @param {string} [config.confirmText] - Confirm button text
   * @param {string} [config.cancelText] - Cancel button text
   * @param {'default'|'danger'} [config.variant] - Dialog variant
   * @returns {Promise<boolean>} True if confirmed
   */
  const confirm = useCallback((config) => {
    setOptions(config)

    return new Promise((resolve) => {
      setResolver(() => resolve)
    })
  }, [])

  const handleClose = useCallback(
    (result) => {
      resolver?.(result)

      setOptions(null)

      setResolver(null)
    },
    [resolver],
  )

  const value = useMemo(
    () => ({
      confirm,
    }),
    [confirm],
  )

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <ConfirmDialog
        open={Boolean(options)}
        options={options}
        onClose={handleClose}
      />
    </ConfirmContext.Provider>
  )
}
