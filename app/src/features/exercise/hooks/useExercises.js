import { useEffect, useState, useMemo } from 'react'
import { getExercises } from '../../../shared/api/exerciseApi'
import { normalizeExercise } from '../utils/exerciseAdapter'
import { CATEGORIES } from '../utils/exerciseCategories'

const SPECIAL = CATEGORIES.SPECIAL

/**
 * Custom hook for managing exercise data, including fetching, filtering, and pagination.
 * @param {object} filters - An object containing filter criteria and pagination settings:
 *  - search: string for text search
 *  - bodyPart: string for filtering by body part
 *  - muscleGroup: string for filtering by muscle group
 *  - equipment: string for filtering by equipment
 *  - visibleCount: number for pagination
 * @returns {object} An object containing:
 *  - loading: boolean indicating if data is being fetched
 *  - error: error message if fetching failed
 */
export default function useExercises(filters) {
  const { search, bodyPart, muscleGroup, equipment, visibleCount } = filters

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // FETCH
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

  // FILTERED
  const filtered = useMemo(() => {
    return exercises
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
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
  }, [exercises, bodyPart, muscleGroup, equipment, search])

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
