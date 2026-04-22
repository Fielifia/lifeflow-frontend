import { NavLink } from 'react-router-dom'

/**
 * Navigation bar for switching between views.
 * @returns {import('react').ReactElement} Navigation UI
 */
export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Home
      </NavLink>

      <NavLink
        to="/workout"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Workout
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        History
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Stats
      </NavLink>

    </div>
  )
}
