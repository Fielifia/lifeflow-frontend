import API from './api'
import { normalizeExercise } from '../utils/normalizeExercise'

// ===== GET TEMPLATES =====

export const getTemplatesApi = async ({ page = 1, limit = 5 } = {}) => {
  const res = await API.get('/templates', {
    params: { page, limit },
  })

  return res.data
}

// ===== CREATE TEMPLATE =====

export const createTemplateApi = async (data) => {
  const res = await API.post('/templates', data)
  return res.data
}

export const getTemplateByIdApi = async (id) => {
  const res = await API.get(`/templates/${id}`)

  return {
    ...res.data,

    exercises:
      res.data.exercises?.map(
        normalizeExercise,
      ) || [],
  }
}

// ===== UPDATE TEMPLATE =====

export const updateTemplateApi = async (id, data) => {
  const res = await API.put(`/templates/${id}`, data)
  return res.data
}

// ===== DELETE TEMPLATE =====

export const deleteTemplateApi = async (id) => {
  const res = await API.delete(`/templates/${id}`)
  return res.data
}

export const deleteAllTemplatesApi = async () => {
  const res = await API.delete('/templates')
  return res.data
}
