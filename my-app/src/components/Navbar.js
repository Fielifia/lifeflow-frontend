/**
 * Navbar component that displays navigation links for the application using React Router.
 */

import { NavLink } from 'react-router-dom'

/**
 *
 */
export default function Navbar() {
  return (
    <div className='navbar'>
      <NavLink
        to='/'
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Home
      </NavLink>

      <NavLink
        to='/workout'
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Workout
      </NavLink>

      <NavLink
        to='/history'
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        History
      </NavLink>

      <NavLink
        to='/stats'
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Stats
      </NavLink>

      <NavLink
        to='/exercises'
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        Exercises
      </NavLink>
    </div>
  )
}
