import { useState } from 'react'
import { register } from '../../../shared/api/authApi'

/**
 * Register component for creating a new user account.
 * @param {{ setUser: (user: object) => void }} props - Component props
 * @returns {import('react').ReactElement} Registration form UI
 */
export default function Register( { setUser } ) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Handles registration flow.
   *
   * Validates input, sends POST request to backend,
   * and displays success or error messages.
   * @async
   * @function handleRegister
   * @returns {Promise<void>}
   */
  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')

      const user = await register({ email, username, password })

      setUser(user)
      setEmail('')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-base card-auth">
      <h2>Create account</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleRegister()
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
        />

        <input
          className="input-base input-auth"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError('')
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
        />

        <input
          className="input-base input-auth"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setError('')
          }}
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  )
}
