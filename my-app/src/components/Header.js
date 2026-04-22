/**
 * Header component displaying app title and logout action.
 * @module components/Header
 */

/**
 *
 * @param root0
 * @param root0.setUser
 */
export default function Header({ setUser }) {
  /**
   *
   */
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(false)
  }

  return (
    <div className="header">
      <h2 className="logo">LifeFlow Fitness</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}
