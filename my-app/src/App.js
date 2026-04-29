import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from './features/auth/pages/LoginPage'
import Register from './features/auth/pages/RegisterPage'
import Dashboard from './features/dashboard/pages/Dashboard'
import ExerciseDetail from './features/exercise/components/ExerciseDetail'
import Exercises from './features/exercise/pages/ExerciseLibraryPage'
import WorkoutStartPage from './features/workout/pages/WorkoutStartPage'
import WorkoutRunPage from './features/workout/pages/WorkoutRunPage'
import TemplateDetailPage from './features/template/pages/TemplateDetailPage'
import TemplateListPage from './features/template/pages/TemplateListPage'
import TemplateEditPage from './features/template/pages/TemplateEditPage'
import Header from './shared/ui/Header'
import Navbar from './shared/ui/Navbar'

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
            <Register setUser={setUser} />
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
          <Route path="/exercise/:id" element={<ExerciseDetail />} />

          <Route path="/workout" element={<WorkoutStartPage />} />
          <Route path="/workout/run" element={<WorkoutRunPage />} />

          <Route path="/templates/" element={<TemplateListPage />} />
          <Route path="/templates/:id" element={<TemplateDetailPage />} />
          <Route path="/templates/create" element={<TemplateEditPage />} />


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
