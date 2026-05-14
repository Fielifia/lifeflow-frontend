import API from './api'

export const getTemplates = async ({ page = 1, limit = 5 } = {}) => {
  const res = await API.get('/templates', {
    params: { page, limit },
  })

  return res.data
}

export const createTemplate = async (data) => {
  const res = await API.post('/templates', data)
  return res.data
}

export const getTemplateById = async (id) => {
  const res = await API.get(`/templates/${id}`)
  return res.data
}

export const updateTemplate = async (id, data) => {
  const res = await API.put(`/templates/${id}`, data)
  return res.data
}
