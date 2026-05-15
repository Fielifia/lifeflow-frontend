import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Login from './features/auth/pages/LoginPage'
import Register from './features/auth/pages/RegisterPage'
import Dashboard from './features/dashboard/pages/Dashboard'
import ExerciseDetailPage from './features/exercise/pages/ExerciseDetailPage'
import {
  default as ExerciseLibraryPage,
} from './features/exercise/pages/ExerciseLibraryPage'
import WorkoutDetailPage from './features/history/pages/WorkoutDetailPage'
import WorkoutEditPage from './features/history/pages/WorkoutEditPage'
import WorkoutHistoryPage from './features/history/pages/WorkoutHistoryPage'
import StatsPage from './features/stats/pages/StatsPage'
import TemplateDetailPage from './features/template/pages/TemplateDetailPage'
import TemplateEditorPage from './features/template/pages/TemplateEditorPage'
import WorkoutSessionBarWrapper from './features/workout/components/session/WorkoutSessionBarWrapper'
import WorkoutRunPage from './features/workout/pages/WorkoutRunPage'
import WorkoutStartPage from './features/workout/pages/WorkoutStartPage'
import { ToastProvider } from './shared/context/ToastContext'
import { WorkoutProvider } from './shared/context/WorkoutContext'
import { ExerciseFlowProvider } from './shared/context/ExerciseFlowContext'
import DataState from './shared/ui/DataState'
import Navbar from './shared/ui/Navbar'
import { userStorage } from './shared/utils/storage/userStorage'

/**
 * Root application component handling authentication and routing.
 * @returns {import('react').ReactElement} Application UI
 */
function App() {
  let storedUser = null

  try {
    storedUser = userStorage.get()
  } catch {
    storedUser = null
  }

  const [user, setUser] = useState(storedUser || null)
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
      <ToastProvider>
        <WorkoutProvider>
          <ExerciseFlowProvider>
            <div className="app">
              <Routes>
                <Route path="/" element={<Dashboard setUser={setUser} />} />
                <Route path="/exercises" element={<ExerciseLibraryPage />} />
                <Route path="/exercises/:id" element={<ExerciseDetailPage />} />

                <Route path="/workouts" element={<WorkoutStartPage />} />
                <Route path="/workouts/:id/run" element={<WorkoutRunPage />} />
                <Route
                  path="/workouts/:id/exercises"
                  element={<ExerciseLibraryPage />}
                />

                <Route path="/templates/:id" element={<TemplateDetailPage />} />
                <Route path="/templates/create" element={<TemplateEditorPage />} />
                <Route path="/templates/:id/edit" element={<TemplateEditorPage />} />

                <Route path="/history" element={<WorkoutHistoryPage />} />
                <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
                <Route path="/workouts/:id/edit" element={<WorkoutEditPage />} />

                <Route
                  path="/stats"
                  element={<StatsPage />}
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
          </ExerciseFlowProvider>
        </WorkoutProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
