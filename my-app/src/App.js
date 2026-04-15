import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  const [user, setUser] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  if (!user) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register />
            <p onClick={() => setShowRegister(false)}>
              Already have an account? Login
            </p>
          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <p onClick={() => setShowRegister(true)}>Create account</p>
          </>
        )}
      </div>
    )
  }

  return <Dashboard />
}

export default App
