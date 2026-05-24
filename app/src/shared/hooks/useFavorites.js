import { useContext } from 'react'

import { FavoritesContext } from '../context/FavoritesContext'

/**
 * Access favorite exercise state
 * and actions.
 * @returns {object} Favorites context
 */
export function useFavorites() {
  const context =
    useContext(FavoritesContext)

  if (!context) {
    throw new Error(
      'useFavorites must be used within FavoritesProvider',
    )
  }

  return context
}
