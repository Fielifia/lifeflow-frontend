import { useEffect, useMemo, useState } from 'react'
import { getTemplateByIdApi } from '../../../shared/api/templateApi'
import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'
import { calculateWorkoutStats } from '../../../shared/utils/calculateWorkoutStats'


/**
 * Fetches template detail data.
 *
 * Handles:
 * - Fetching template by ID
 * - Loading and error state
 * @param {string} id - Template ID
 * @returns {{
 *   template: object | null,
 *   loading: boolean,
 *   error: string | null,
 * }} Template detail state.
 */
export function useTemplateDetail(id) {
  const [template, setTemplate] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getTemplateByIdApi(id)

        setTemplate(data)
      } catch {
        setError(ERROR_MESSAGES.LOAD_TEMPLATE)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  const stats = useMemo(() => {
    if (!template) return null

    return calculateWorkoutStats(template)
  }, [template])

  return {
    template,
    loading,
    error,
    stats,
  }
}
