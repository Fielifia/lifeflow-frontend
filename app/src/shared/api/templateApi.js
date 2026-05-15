import API from './api'
import { normalizeExercise } from '../utils/normalizeExercise'

export const getTemplatesApi = async ({ page = 1, limit = 5 } = {}) => {
  const res = await API.get('/templates', {
    params: { page, limit },
  })

  return res.data
}

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

export const updateTemplateApi = async (id, data) => {
  const res = await API.put(`/templates/${id}`, data)
  return res.data
}

export const deleteTemplateApi = async (id) => {
  const res = await API.delete(`/templates/${id}`)
  return res.data
}
