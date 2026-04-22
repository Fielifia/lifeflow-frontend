/**
 * Header component displaying app title and logout functionality.
 * @param {{ setUser: (value: boolean) => void }} props - Updates authentication state on logout
 * @returns {import('react').ReactElement} The rendered header component
 */
export default function Header({ setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(false)
  }

  return (
    <div className="header header-row">
      <h2 className="logo">LifeFlow Fitness</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}
