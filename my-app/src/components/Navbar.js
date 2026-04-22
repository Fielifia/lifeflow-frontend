import { NavLink } from 'react-router-dom'
import { House, Dumbbell, History, ChartNoAxesCombined } from 'lucide-react'

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
        <House className="nav-icon" />
        Home
      </NavLink>

      <NavLink
        to="/workout"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <Dumbbell className="nav-icon" />
        Workout
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <History className="nav-icon" />
        History
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <ChartNoAxesCombined className="nav-icon" />
        Stats
      </NavLink>
    </div>
  )
}
