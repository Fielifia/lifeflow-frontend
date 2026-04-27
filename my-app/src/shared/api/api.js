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
  const user = JSON.parse(localStorage.getItem('user'))

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  return config
})

export default API
