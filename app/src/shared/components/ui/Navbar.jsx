import { Link, useLocation } from 'react-router-dom'

import { getActiveNav } from '../../utils/navigation/getActiveNav'

import {
  House,
  Dumbbell,
  History,
  ChartNoAxesCombined
} from 'lucide-react'

/**
 * Bottom navigation bar for main app routes.
 * @returns {import('react').ReactElement} Navigation UI
 */
export default function Navbar() {
  const { pathname } = useLocation()

  const active = getActiveNav(pathname)

  return (
    <div className="navbar">

      <Link
        to="/"
        className={`nav-item ${active === 'home' ? 'active' : ''}`}
      >
        <House className="nav-icon" />
        Home
      </Link>

      <Link
        to="/workouts"
        className={`nav-item ${active === 'workout' ? 'active' : ''}`}
      >
        <Dumbbell className="nav-icon" />
        Workout
      </Link>

      <Link
        to="/history"
        className={`nav-item ${active === 'history' ? 'active' : ''}`}
      >
        <History className="nav-icon" />
        History
      </Link>

      <Link
        to="/stats"
        className={`nav-item ${active === 'stats' ? 'active' : ''}`}
      >
        <ChartNoAxesCombined className="nav-icon" />
        Stats
      </Link>

    </div>
  )
}
