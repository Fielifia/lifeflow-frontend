import { useEffect, useState } from 'react'

/**
 * Custom hook to track online/offline status of the user.
 * Listens to 'online' and 'offline' events and updates state accordingly.
 * @returns {boolean} isOnline - Current online status of the user.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
