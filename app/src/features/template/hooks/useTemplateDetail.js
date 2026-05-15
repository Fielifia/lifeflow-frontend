import { useEffect, useState } from 'react'
import { getTemplateById } from '../../../shared/api/templateApi'

/**
 * Fetches template detail data.
 *
 * Handles:
 * - Fetching template by ID
 * - Loading and error state
 *
 * @param {string} id - Template ID
 * @returns {{
 *   template: object | null,
 *   loading: boolean,
 *   error: string,
 * }} Template detail state.
 */
export function useTemplateDetail(id) {
  const [template, setTemplate] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getTemplateById(id)

        setTemplate(data)
      } catch {
        setError('Could not load template')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  return {
    template,
    loading,
    error,
  }
}
