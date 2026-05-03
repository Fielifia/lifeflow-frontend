import { useState } from 'react'
import { login } from '../../../shared/api/authApi'
import LoadingButton from '../../../shared/ui/LoadingButton'

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
    if (!email || !password) return
    try {
      setLoading(true)

      const user = await login({ email, password })
      setUser(user)

    } catch (err) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-base card-auth">
      <h2>Login</h2>
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
        />

        <LoadingButton className="btn btn-primary" loading={loading} onClick={handleLogin}>
          Login
        </LoadingButton>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
