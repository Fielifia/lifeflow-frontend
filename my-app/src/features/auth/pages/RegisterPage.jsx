import { useState } from 'react'
import { register } from '../../../shared/api/authApi'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../../../shared/ui/Header'
import LoadingButton from '../../../shared/ui/LoadingButton'

/**
 * Register component for creating a new user account.
 * @param {{ setUser: (user: object) => void }} props - Component props
 * @returns {import('react').ReactElement} Registration form UI
 */
export default function Register({ setUser }) {
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

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="app">
      <Header
        title="Create Account"
        subtitle="Start your fitness journey"
        variant="guest"
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
            />

            <button
              type="button"
              className="password-toggle"
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
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRegister()
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

          <LoadingButton className="btn btn-standard btn-primary" loading={loading} onClick={handleRegister}>
            Create account
          </LoadingButton>
        </form>

        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  )
}
