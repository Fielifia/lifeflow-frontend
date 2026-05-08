import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
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
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

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

  const [showPassword, setShowPassword] = useState(false)

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

        <div className="password-wrapper">
          <input
            className="input-base input-auth"
            type={showPassword ? 'text' : 'password'}
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

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <LoadingButton className="btn btn-standard btn-primary" loading={loading} onClick={handleLogin}>
          {loading ? 'Logging in...' : 'Login'}
        </LoadingButton>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  )
}
