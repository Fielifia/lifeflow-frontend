import { useContext } from 'react'

import { ConfirmContext } from '../context/ConfirmContext'

/**
 * Access confirm dialog actions.
 * Must be used within ConfirmProvider.
 * @returns {(
 *  options: {
 *    title: string,
 *    description?: string,
 *    confirmText?: string,
 *    cancelText?: string,
 *    variant?: 'default' | 'danger',
 *  }
 * ) => Promise<boolean>} Confirm dialog opener
 */
export function useConfirm() {
  const context = useContext(ConfirmContext)

  if (!context) {
    throw new Error(
      'useConfirm must be used within ConfirmProvider',
    )
  }

  return context.confirm
}
