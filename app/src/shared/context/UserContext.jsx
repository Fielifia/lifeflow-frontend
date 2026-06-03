import { createContext, useContext, useEffect, useState } from 'react'
import { userStorage } from '../utils/storage/userStorage'

const UserContext = createContext(null)

/**
 * Provides authenticated user state throughout the application.
 * @param {object} props - Component props.
 * @param {import('react').ReactNode} props.children - Child components.
 * @returns {import('react').ReactElement} User context provider.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(userStorage.get())

  useEffect(() => {
    if (user) {
      userStorage.set(user)
    } else {
      userStorage.clear()
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * Returns the current user context.
 * @returns {{
 *   user: object|null,
 *   setUser: (user: object|null) => void
 * }} User state and updater.
 */
export function useUser() {
  return useContext(UserContext)
}
