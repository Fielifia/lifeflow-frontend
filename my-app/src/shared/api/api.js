/**
 * API module for making HTTP requests to the backend server.
 *
 * This module uses Axios to create a pre-configured instance for making API calls.
 * @module api/api
 */
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const API = axios.create({
  baseURL: API_URL,
})

API.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const token = storedUser?.token
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Fallback to local API if REACT_APP_API_URL for testing
const LOCAL_API_URL = 'http://localhost:5000'
const LOCAL_API = axios.create({
  baseURL: LOCAL_API_URL,
})

export default API
export { LOCAL_API }
