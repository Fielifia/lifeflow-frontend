/**
 * Main application component that handles user authentication and routing.
 *
 * @module App
 */
import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )
  const [showRegister, setShowRegister] = useState(false)
  const [view, setView] = useState('dashboard')

  if (!user) {
    return (
      <div className='app'>
        {showRegister ? (
          <>
            <Register />
            <p className='message' onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </p>
          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <p className='message' onClick={() => setShowRegister(true)}>
              Create account
            </p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className='app'>
      {view === 'dashboard' && (
        <Dashboard setUser={setUser} />
      )}
      {view === 'workout' && <div className='card'>Workout (coming soon)</div>}
      {view === 'history' && <div className='card'>History (coming soon)</div>}
      {view === 'stats' && <div className='card'>Stats (coming soon)</div>}

      <Navbar current={view} setView={setView} />
    </div>
  )
}

export default App
