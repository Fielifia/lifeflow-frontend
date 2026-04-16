/**
 * Navbar component that displays navigation links for the application.
 *
 * @param {Object} param0 - The props for the Navbar component.
 * @param {string} param0.current - The currently selected view.
 * @param {Function} param0.setView - The function to set the current view.
 * @returns {JSX.Element} The Navbar component.
 */

export default function Navbar({ current, setView }) {
  return (
    <div className='navbar'>
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
