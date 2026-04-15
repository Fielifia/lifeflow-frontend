/**
 * Component for user registration.
 *
 * Provides a form for users to create a new account by entering their email and password.
 *
 * @module components/Register
 */
import { useState } from 'react'
import API from '../api/api'

/**
 * Register component allows users to create a new account.
 *
 * @returns {JSX.Element} The registration form component.
 */
export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await API.post('/auth/register', { email, password, username })
      alert('Account created')
    } catch {
      alert('Registration failed')
    }
  }

  return (
    <div className='container'>
      <h2>Create account</h2>

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

      <input
        className='input'
        type='password'
        placeholder='Confirm Password'
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <input
        className='input'
        placeholder='Username'
        onChange={(e) => setUsername(e.target.value)}
      />

      <button className='primary-btn' onClick={handleRegister}>
        Create account
      </button>
    </div>
  )
}
