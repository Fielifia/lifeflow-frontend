import axios from 'axios'

/**
 * Pre-configured Axios instance for API requests.
 *
 * Uses environment variable REACT_APP_API_URL if available,
 * otherwise defaults to localhost.
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const API = axios.create({
  baseURL: API_URL,
})

export default API
