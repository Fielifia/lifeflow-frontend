/**
 * API module for making HTTP requests to the backend server.
 *
 * This module uses Axios to create a pre-configured instance for making API calls.
 *
 * @module api/exerciseApi
 */
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

/**
 *
 */
export const getExercises = async (params = {}) => {
  const query = new URLSearchParams(params).toString()

  const token = localStorage.getItem('token') // 🔥 här är fixen

  const response = await fetch(
    `http://localhost:5000/exercises?${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch exercises')
  }

  return response.json()
}
