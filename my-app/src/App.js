import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import Navbar from './components/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ExerciseBodyPart from './pages/Exercises/ExerciseBodyPart'
import ExerciseDetail from './pages/Exercises/ExerciseDetail'
import ExerciseMuscle from './pages/Exercises/ExerciseMuscle'
import Exercises from './pages/Exercises/Exercises'

/**
 * Root application component handling authentication and routing.
 * @returns {import('react').ReactElement} Application UI
 */
function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )
  const [showRegister, setShowRegister] = useState(false)

  if (!user) {
    return (
      <div className="app">
        {showRegister ? (
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
        )}
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        {/* Header */}
        <Header setUser={setUser} />
        <Routes>
          <Route path="/" element={<Dashboard setUser={setUser} />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:category" element={<ExerciseBodyPart />} />
          <Route
            path="/exercises/:category/:muscle"
            element={<ExerciseMuscle />}
          />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />

          <Route
            path="/workout"
            element={<div className="card">Workout (coming soon)</div>}
          />
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

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App
