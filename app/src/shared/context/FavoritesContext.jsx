import { createContext, useEffect, useState } from 'react'

import {
  addFavoriteExerciseApi,
  getFavoriteExercisesApi,
  removeFavoriteExerciseApi,
} from '../api/exerciseApi'

import { userStorage } from '../utils/storage/userStorage'

export const FavoritesContext = createContext(null)

/**
 * Provides favorite exercise state
 * and actions across the app.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Child components
 * @returns {import('react').ReactElement} Provider
 */
export function FavoritesProvider({ children }) {
  // ===== STATE =====

  const [favorites, setFavorites] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  // ===== LOAD FAVORITES =====

  useEffect(() => {
    const storedUser = userStorage.get()

    if (!storedUser?.token) {
      setLoading(false)

      return
    }

    const loadFavorites = async () => {
      try {
        setLoading(true)

        const data = await getFavoriteExercisesApi()

        setFavorites(data.map((ex) => ex._id))
      } catch (err) {
        setError('Unable to load favorite exercises.')
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  // ===== HELPERS =====

  const isFavorite = (id) => favorites.includes(id)

  // ===== TOGGLE =====

  const toggleFavorite = async (id) => {
    const favorite = isFavorite(id)

    try {
      if (favorite) {
        await removeFavoriteExerciseApi(id)

        setFavorites((prev) => prev.filter((favId) => favId !== id))

        return
      }

      await addFavoriteExerciseApi(id)

      setFavorites((prev) => [...prev, id])
    } catch (err) {
      setError('Unable to update favorite exercises.')
    }
  }

  // ===== CONTEXT VALUE =====

  const value = {
    favorites,
    loading,
    error,

    isFavorite,
    toggleFavorite,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
