/**
 * Navbar component for navigating between different views.
 * @param {{ current: string, setView: (view: string) => void }} props - Current view and setter function
 * @returns {import('react').ReactElement} The rendered navigation bar
 */
export default function Navbar({ current, setView }) {
  return (
    <div className="navbar">
      <div
        className={`nav-item ${current === 'dashboard' ? 'active' : ''}`}
        onClick={() => setView('dashboard')}
      >
        Home
      </div>

      <div
        className={`nav-item ${current === 'workout' ? 'active' : ''}`}
        onClick={() => setView('workout')}
      >
        Workout
      </div>

      <div
        className={`nav-item ${current === 'history' ? 'active' : ''}`}
        onClick={() => setView('history')}
      >
        History
      </div>

      <div
        className={`nav-item ${current === 'stats' ? 'active' : ''}`}
        onClick={() => setView('stats')}
      >
        Stats
      </div>
    </div>
  )
}
