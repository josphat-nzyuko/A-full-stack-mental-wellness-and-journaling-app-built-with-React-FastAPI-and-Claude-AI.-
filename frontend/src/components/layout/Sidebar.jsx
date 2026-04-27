import { NavLink } from 'react-router-dom'
import '../../styles/Sidebar.css'

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/journal', icon: '📝', label: 'Journal' },
  { path: '/insights', icon: '✨', label: 'Insights' }
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">Your safe space to reflect and grow</p>
      </div>
    </aside>
  )
}

export default Sidebar