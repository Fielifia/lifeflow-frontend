/**
 * Shared Axios API instance.
 * Handles base URL and authentication headers.
 */
import axios from 'axios'
import { userStorage } from '../utils/storage/userStorage'

// ===== API INSTANCE =====

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
})

// ===== AUTH INTERCEPTOR =====

API.interceptors.request.use((config) => {
  const storedUser = userStorage.get()
  const token = storedUser?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default API
