import {
  useEffect,
  useState,
  useMemo
} from 'react'

import { getExercises } from '../../../shared/api/exerciseApi'

import { normalizeExercise } from '../utils/exerciseAdapter'

import { CATEGORIES } from '../utils/exerciseCategories'

const SPECIAL = CATEGORIES.SPECIAL

/**
 * Custom hook for fetching, filtering, and paginating exercise data.
 * @param {object} filters - Filter and pagination settings.
 * @param {string} filters.search - Exercise search query.
 * @param {string} filters.sort - Selected sorting option.
 * @param {string} filters.bodyPart - Selected body part filter.
 * @param {string} filters.muscleGroup - Selected muscle group filter.
 * @param {string} filters.equipment - Selected equipment filter.
 * @param {number} filters.visibleCount - Number of visible exercises.
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
    visibleCount
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

        const all = []
        let page = 1
        let hasMore = true
        const LIMIT = 100

        while (hasMore) {
          const data = await getExercises({ limit: LIMIT, page })
          all.push(...data.results)

          if (data.results.length < LIMIT) {
            hasMore = false
          }

          page++
        }

        setExercises(all.map(normalizeExercise))
      } catch (err) {
        setError('Failed to load exercises')
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  // ===== FILTERED =====

  const filtered = useMemo(() => {

    const filteredExercises = exercises
      .filter((e) => {
        if (!bodyPart) return true
        if (SPECIAL.includes(bodyPart)) return e.category === bodyPart

        return e.bodyPart === bodyPart
      })
      .filter((e) => {
        if (!muscleGroup) return true
        if (SPECIAL.includes(bodyPart)) return e.bodyPart === muscleGroup

        return e.muscle?.toLowerCase() === muscleGroup.toLowerCase()
      })
      .filter((e) => {
        if (!equipment) return true

        return e.equipment?.toLowerCase() === equipment.toLowerCase()
      })
      .filter((e) => {
        if (!category) return true

        return e.category === category
      })
      .filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()),
      )

    switch (sort) {
    case 'z-a':
      return [...filteredExercises].sort((a, b) =>
        b.name.localeCompare(a.name),
      )

    case 'a-z':
    default:
      return [...filteredExercises].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
    }

  }, [
    exercises,
    sort,
    bodyPart,
    muscleGroup,
    equipment,
    category,
    search,
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
