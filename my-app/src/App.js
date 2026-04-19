import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ExerciseList from './components/ExerciseList'
import Navbar from './components/Navbar'

import './styles/App.css'

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )
  const [showRegister, setShowRegister] = useState(false)

  // 🔒 Not logged in
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

  // ✅ Logged in → router
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route path="/" element={<Dashboard setUser={setUser} />} />
          <Route path="/exercises" element={<ExerciseList setUser={setUser} />} />

          <Route path="/workout" element={<div className="card">Workout (coming soon)</div>} />
          <Route path="/history" element={<div className="card">History (coming soon)</div>} />
          <Route path="/stats" element={<div className="card">Stats (coming soon)</div>} />
          <Route path="/calendar" element={<div className="card">Calendar (coming soon)</div>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App
