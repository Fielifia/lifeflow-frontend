import { useState } from 'react'
import API from '../../api/api'

/**
 * Login component for user authentication.
 * @param {{ setUser: (value: object) => void }} props - Component props
 * @returns {import('react').ReactElement} Login form UI
 */
export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Sends login request and handles authentication flow.
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
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...res.data.user,
          token: res.data.token,
        }),
      )

      // Update app state
      setUser(res.data.user)
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-base card-auth">
      <h2 className="center">Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <input
          className="input-base input-auth"
          placeholder="Email"
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
          className="input-base input-auth"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin()
          }}
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
