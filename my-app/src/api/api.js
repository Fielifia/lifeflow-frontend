/**
 * API module for making HTTP requests to the backend server.
 *
 * This module uses Axios to create a pre-configured instance for making API calls.
 * @module api/api
 */
import axios from 'axios'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

API.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const token = storedUser?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API ERROR:', err.response?.data || err.message)
    return Promise.reject(err)
  },
)

export default API
