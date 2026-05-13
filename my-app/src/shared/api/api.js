/**
 * API module for making HTTP requests to the backend server.
 *
 * This module uses Axios to create a pre-configured instance for making API calls.
 * @module api/api
 */
import axios from 'axios'
import { userStorage } from '../utils/storage/userStorage'

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
})

API.interceptors.request.use((config) => {
  const storedUser = userStorage.get()
  const token = storedUser?.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default API
