import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from './features/auth/pages/LoginPage'
import Register from './features/auth/pages/RegisterPage'
import Dashboard from './features/dashboard/pages/Dashboard'
import ExerciseDetail from './features/exercise/components/ExerciseDetail'
import {
  default as ExerciseLibraryPage,
  default as Exercises,
} from './features/exercise/pages/ExerciseLibraryPage'
import WorkoutDetailPage from './features/history/pages/WorkoutDetailPage'
import WorkoutHistoryPage from './features/history/pages/WorkoutHistoryPage'
import WorkoutEditPage from './features/history/pages/WorkoutEditPage'
import TemplateDetailPage from './features/template/pages/TemplateDetailPage'
import TemplateEditPage from './features/template/pages/TemplateEditPage'
import WorkoutSessionBarWrapper from './features/workout/components/session/WorkoutSessionBarWrapper'
import WorkoutRunPage from './features/workout/pages/WorkoutRunPage'
import WorkoutStartPage from './features/workout/pages/WorkoutStartPage'
import { WorkoutProvider } from './shared/context/WorkoutContext'
import DataState from './shared/ui/DataState'
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
      <WorkoutProvider>
        <div className="app">
          {/* Header */}
          <Header setUser={setUser} />
          <Routes>
            <Route path="/" element={<Dashboard setUser={setUser} />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />

            <Route path="/workouts" element={<WorkoutStartPage />} />
            <Route path="/workouts/:id/run" element={<WorkoutRunPage />} />
            <Route
              path="/workouts/:id/exercises"
              element={<ExerciseLibraryPage />}
            />

            <Route path="/templates/:id" element={<TemplateDetailPage />} />
            <Route path="/templates/create" element={<TemplateEditPage />} />

            <Route path="/history" element={<WorkoutHistoryPage />} />
            <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
            <Route path="/workouts/:id/edit" element={<WorkoutEditPage />} />

            <Route
              path="/stats"
              element={
                <DataState
                  variant="card-empty"
                  emptyText="Coming soon"
                  count={1}
                ></DataState>
              }
            />
            <Route
              path="/calendar"
              element={
                <DataState
                  variant="card-empty"
                  emptyText="Coming soon"
                  count={1}
                ></DataState>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <Navbar />
          <WorkoutSessionBarWrapper />
        </div>
      </WorkoutProvider>
    </BrowserRouter>
  )
}

export default App
