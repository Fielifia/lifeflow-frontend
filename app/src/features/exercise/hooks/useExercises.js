import {
  useEffect,
  useMemo,
  useState
} from 'react'

import Fuse from 'fuse.js'

import { getExercisesApi } from '../../../shared/api/exerciseApi'
import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

import { useFavorites } from '../../../shared/hooks/useFavorites'

import { normalizeExercise } from '../utils/exerciseAdapter'

import { CATEGORIES } from '../utils/exerciseCategories'

const SPECIAL = CATEGORIES.SPECIAL

/**
 * Custom hook for fetching, filtering,
 * and paginating exercise data.
 * @param {object} filters - Filter and pagination settings.
 * @param {string} filters.search - Exercise search query.
 * @param {string} filters.sort - Selected sorting option.
 * @param {string} filters.bodyPart - Selected body part filter.
 * @param {string} filters.muscleGroup - Selected muscle group filter.
 * @param {string} filters.equipment - Selected equipment filter.
 * @param {string} filters.category - Selected category filter.
 * @param {number} filters.visibleCount - Number of visible exercises.
 * @param {boolean} filters.favoritesOnly - Show only favorite exercises.
 * @returns {{
 *  loading: boolean,
 *  error: string | null,
 *  exercises: Array<object>,
 *  filtered: Array<object>,
 *  visibleExercises: Array<object>,
 * }} Exercise state and filtered results.
 */
export default function useExercises(filters) {
  const {
    search,
    sort,
    bodyPart,
    muscleGroup,
    equipment,
    category,
    visibleCount,
    favoritesOnly,
  } = filters

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ===== FETCH =====

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getExercisesApi({
          limit: 1000,
          sort,
        })

        setExercises(
          data.results.map(normalizeExercise),
        )
      } catch (err) {
        setError(ERROR_MESSAGES.LOAD_EXERCISE)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [sort])

  // ===== FAVORITES =====

  const { isFavorite } = useFavorites()

  // ===== FILTERED =====

  const filtered = useMemo(() => {
    const filteredExercises = exercises
    // ===== FAVORITES =====

      .filter((e) => {
        if (!favoritesOnly) {
          return true
        }

        return isFavorite(e.id)
      })

    // ===== BODY PART =====

      .filter((e) => {
        if (!bodyPart) return true

        if (SPECIAL.includes(bodyPart)) {
          return e.category === bodyPart
        }

        return e.bodyPart === bodyPart
      })

    // ===== MUSCLE =====

      .filter((e) => {
        if (!muscleGroup) return true

        if (SPECIAL.includes(bodyPart)) {
          return e.bodyPart === muscleGroup
        }

        return (
          e.muscle?.toLowerCase() ===
          muscleGroup.toLowerCase()
        )
      })

    // ===== EQUIPMENT =====

      .filter((e) => {
        if (!equipment) return true

        return (
          e.equipment?.toLowerCase() ===
          equipment.toLowerCase()
        )
      })

    // ===== CATEGORY =====

      .filter((e) => {
        if (!category) return true

        return e.category === category
      })

    // ===== SEARCH =====

    if (!search.trim()) {
      return filteredExercises
    }

    const fuse = new Fuse(filteredExercises, {
      threshold: 0.35,
      ignoreLocation: true,

      keys: [
        'name',
        'bodyPart',
        'muscle',
        'equipment',
        'category',
      ],
    })

    return fuse.search(search).map((r) => r.item)

  }, [
    exercises,
    favoritesOnly,
    isFavorite,
    search,
    bodyPart,
    muscleGroup,
    equipment,
    category,
  ])

  const visibleExercises = useMemo(() => {
    return filtered.slice(0, visibleCount)
  }, [filtered, visibleCount])

  return {
    loading,
    error,
    exercises,
    filtered,
    visibleExercises,
  }
}
