import { Eye, EyeOff } from 'lucide-react'

import { useState } from 'react'

import { useUser } from '../../../shared/context/UserContext'

import { register } from '../../../shared/api/authApi'

import Button from '../../../shared/components/ui/button/Button'

import Header from '../../../shared/components/ui/Header'

/**
 * Register component for creating a new user account.
 * @returns {import('react').ReactElement} Registration form UI
 */
export default function RegisterPage() {
  const { setUser } = useUser()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
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
      setError(null)
      setMessage('')

      const user = await register({ email, username, password })

      setUser(user)
      setEmail('')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="app-start">
      <Header
        title="Create Account"
        subtitle="Start your fitness journey"
        variant="register"
      />

      <div className="card-base card-auth">
        <h2 className="center">Create account</h2>

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
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
          />

          <input
            className="input-base input-auth"
            placeholder="Username"
            value={username}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              setUsername(e.target.value)
              setError(null)
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
                setError(null)
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

          <div className="password-wrapper">
            <input
              className="input-base input-auth"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRegister()
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
            onClick={handleRegister}
          >
            Create account
          </Button>
        </form>

        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  )
}
