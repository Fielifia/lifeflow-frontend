import { Eye, EyeOff } from 'lucide-react'

import { useState } from 'react'

import { login } from '../../../shared/api/authApi'

import Button from '../../../shared/components/ui/button/Button'

import Header from '../../../shared/components/ui/Header'

/**
 * Login component for user authentication.
 * @param {{ setUser: (value: object) => void }} props - Component props
 * @returns {import('react').ReactElement} Login form UI
 */
export default function LoginPage({ setUser }) {
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
    <div className="app-start">

      <Header
        title="Welcome Back"
        subtitle="Login to continue"
        variant="login"
      />

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
            onFocus={(e) => e.target.select()}
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
              onFocus={(e) => e.target.select()}
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
              className="icon-btn password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            loading={loading}
            onClick={handleLogin}
          >
            Log In
          </Button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
