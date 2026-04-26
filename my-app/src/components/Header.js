import { Link } from 'react-router-dom'

/**
 * Header component displaying app title and logout action.
 * @param {{ setUser: (value: boolean) => void }} props - Component props
 * @returns {import('react').ReactElement} Header UI
 */
export default function Header({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(false)
  }

  return (
    <div className="header">
      <Link to="/" className="logo">
        LifeFlow Fitness
      </Link>

      {user && (
        <button className="btn btn-secondary btn-right" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  )
}
