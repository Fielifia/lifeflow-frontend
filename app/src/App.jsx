import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { userStorage } from './shared/utils/storage/userStorage'
import { useOnlineStatus } from './shared/hooks/useOnlineStatus'

import Login from './features/auth/pages/LoginPage'
import Register from './features/auth/pages/RegisterPage'

import Dashboard from './features/dashboard/pages/Dashboard'

import ExerciseDetailPage from './features/exercise/pages/ExerciseDetailPage'
import { default as ExerciseLibraryPage } from './features/exercise/pages/ExerciseLibraryPage'

import WorkoutRunPage from './features/workout/pages/WorkoutRunPage'
import WorkoutStartPage from './features/workout/pages/WorkoutStartPage'

import WorkoutDetailPage from './features/history/pages/WorkoutDetailPage'
import WorkoutEditPage from './features/history/pages/WorkoutEditPage'
import WorkoutHistoryPage from './features/history/pages/WorkoutHistoryPage'

import TemplateDetailPage from './features/template/pages/TemplateDetailPage'
import TemplateEditorPage from './features/template/pages/TemplateEditorPage'

import ProfilePage from './features/profile/pages/ProfilePage'

import StatsPage from './features/stats/pages/StatsPage'

import WorkoutSessionBarWrapper from './features/workout/components/session/WorkoutSessionBarWrapper'

import Navbar from './shared/components/ui/Navbar'
import DataState from './shared/components/ui/skeleton/DataState'

import { ConfirmProvider } from './shared/context/ConfirmContext'
import { ExerciseFlowProvider } from './shared/context/ExerciseFlowContext'
import { FavoritesProvider } from './shared/context/FavoritesContext'
import { ToastProvider } from './shared/context/ToastContext'
import { WorkoutProvider } from './shared/context/WorkoutContext'

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

  const isOnline = useOnlineStatus()

  return (
    <BrowserRouter>
      <ConfirmProvider>
        <ToastProvider>
          <WorkoutProvider>
            <ExerciseFlowProvider>
              {!user ? (
                <div className="app">
                  {showRegister ? (
                    <>
                      <Register setUser={setUser} />

                      <p
                        className="message"
                        onClick={() => setShowRegister(false)}
                      >
                        Already have an account? Login
                      </p>
                    </>
                  ) : (
                    <>
                      <Login setUser={setUser} />

                      <p
                        className="message"
                        onClick={() => setShowRegister(true)}
                      >
                        Create account
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <FavoritesProvider>
                  <div className="app-wrapper">
                    {!isOnline && (
                      <div className="offline-banner">
                        You're offline. Some data may be unavailable.
                      </div>
                    )}

                    <div className="app">
                      <Routes>
                        <Route
                          path="/"
                          element={<Dashboard setUser={setUser} />}
                        />
                        <Route
                          path="/exercises"
                          element={<ExerciseLibraryPage />}
                        />
                        <Route
                          path="/exercises/:id"
                          element={<ExerciseDetailPage />}
                        />

                        <Route
                          path="/workouts"
                          element={<WorkoutStartPage />}
                        />
                        <Route
                          path="/workouts/:id/run"
                          element={<WorkoutRunPage />}
                        />
                        <Route
                          path="/workouts/:id/exercises"
                          element={<ExerciseLibraryPage />}
                        />

                        <Route
                          path="/templates/:id"
                          element={<TemplateDetailPage />}
                        />
                        <Route
                          path="/templates/create"
                          element={<TemplateEditorPage />}
                        />
                        <Route
                          path="/templates/:id/edit"
                          element={<TemplateEditorPage />}
                        />

                        <Route
                          path="/history"
                          element={<WorkoutHistoryPage />}
                        />
                        <Route
                          path="/workouts/:id"
                          element={<WorkoutDetailPage />}
                        />
                        <Route
                          path="/workouts/:id/edit"
                          element={<WorkoutEditPage />}
                        />

                        <Route path="/stats" element={<StatsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                          path="/calendar"
                          element={
                            <DataState
                              variant="card-empty"
                              emptyTitle="Coming soon"
                              emptyText="This feature is planned for a future release. Stay tuned!"
                              count={1}
                            />
                          }
                        />

                        {/* fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>

                      <Navbar />
                      <WorkoutSessionBarWrapper />
                    </div>
                  </div>
                </FavoritesProvider>
              )}
            </ExerciseFlowProvider>
          </WorkoutProvider>
        </ToastProvider>
      </ConfirmProvider>
    </BrowserRouter>
  )
}

export default App
