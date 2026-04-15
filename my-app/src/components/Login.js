/**
 * Login component for user authentication.
 *
 * Provides a form for users to enter their email and password to log in.
 *
 * @module components/Login
 */
import { useState } from 'react'
import API from '../api/api'

/**
 * Login component allows users to authenticate and access the dashboard.
 *
 * @param {Function} setUser - Function to update user authentication state in parent component.
 * @returns {JSX.Element} The login form component.
 */
export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(true)
    } catch {
      alert('Invalid credentials')
    }
  }

  return (
    <div className='container'>
      <h2>Login</h2>

      <input
        className='input'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className='input'
        type='password'
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className='primary-btn' onClick={handleLogin}>
        Login
      </button>
    </div>
  )
}
