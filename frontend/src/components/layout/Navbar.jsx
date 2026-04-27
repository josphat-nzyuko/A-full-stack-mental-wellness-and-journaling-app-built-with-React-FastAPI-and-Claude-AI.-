import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import '../../styles/Navbar.css'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🌿</span>
        <span className="navbar-title">MindfulSpace</span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="navbar-username">{user?.username || 'User'}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost navbar-logout">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar