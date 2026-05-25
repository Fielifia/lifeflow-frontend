import { Star } from 'lucide-react'

import Button from '../button/Button'

import { useFavorites } from '../../../hooks/useFavorites'

/**
 * Favorite toggle button.
 * @param {object} props - Component props
 * @param {string} props.exerciseId - Exercise id
 * @returns {import('react').ReactElement} - Favorite toggle button
 */
export default function FavoriteButton({ exerciseId }) {
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <Button
      variant="ghost"
      size="icon-small"
      onClick={(e) => {
        e.stopPropagation()

        void toggleFavorite(exerciseId)
      }}
    >
      <Star fill={isFavorite(exerciseId) ? 'currentColor' : 'none'} />
    </Button>
  )
}
