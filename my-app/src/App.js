import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import Navbar from './components/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ExerciseDetail from './pages/Exercises/ExerciseDetail'
import Exercises from './pages/Exercises/Exercises'
import Workout from './pages/Workout/Workout'

/**
 * Root application component handling authentication and routing.
 * @returns {import('react').ReactElement} Application UI
 */
function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )
  const [showRegister, setShowRegister] = useState(false)

  return (
    <BrowserRouter>
      <div className="app">
        {/* Header fungerar nu alltid */}
        <Header user={user} setUser={setUser} />

        {!user ? (
          showRegister ? (
            <>
              <Register />
              <p className="message" onClick={() => setShowRegister(false)}>
                Already have an account? Login
              </p>
            </>
          ) : (
            <>
              <Login setUser={setUser} />
              <p className="message" onClick={() => setShowRegister(true)}>
                Create account
              </p>
            </>
          )
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Dashboard setUser={setUser} />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/exercise/:id" element={<ExerciseDetail />} />
              <Route path="/workout" element={<Workout />} />

              <Route
                path="/history"
                element={<div className="card">History (coming soon)</div>}
              />
              <Route
                path="/stats"
                element={<div className="card">Stats (coming soon)</div>}
              />
              <Route
                path="/calendar"
                element={<div className="card">Calendar (coming soon)</div>}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <Navbar />
          </>
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
