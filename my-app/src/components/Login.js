/**
 * Login component for user authentication.
 *
 * Handles user input, sends login request to backend,
 * stores authentication data (JWT + user), and updates app state.
 *
 * @module components/Login
 */

import { useState } from 'react'
import API from '../api/api'

/**
 * Login component allows users to authenticate and access the dashboard.
 *
 * @param {{ setUser: (value: boolean) => void }} props
 * @returns {JSX.Element}
 */
export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Sends login request and handles authentication flow.
   *
   * @async
   * @function handleLogin
   * @returns {Promise<void>}
   */
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      const res = await API.post('/auth/login', { email, password })

      // Store auth data
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // Update app state
      setUser(true)
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <input
          className='input'
          placeholder='Email'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin()
          }}
        />

        <input
          className='input'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin()
          }}
        />

        <button type='submit' className='primary-btn' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className='error'>{error}</p>}
    </div>
  )
}
