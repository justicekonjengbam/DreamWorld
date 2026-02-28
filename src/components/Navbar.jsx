import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const DREAMWORLD_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'Story' },
  { to: '/creator', label: 'Creator' },
  { to: '/roles', label: 'Roles' },
  { to: '/characters', label: 'Dreamers' },
  { to: '/quests', label: 'Quests' },
  { to: '/events', label: 'Events' },
  { to: '/join', label: 'Join' },
  { to: '/funders', label: 'Support' },
  { to: '/thanks', label: 'Sponsors' },
]

const ACADEMY_LINKS = [
  { to: '/academy', label: 'Home', exact: true },
  { to: '/academy/students', label: 'Students' },
  { to: '/academy/enroll', label: 'Enroll' },
]

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isAcademyPage = location.pathname.startsWith('/academy')
  const links = isAcademyPage ? ACADEMY_LINKS : DREAMWORLD_LINKS

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path ? 'active' : ''
    return location.pathname.startsWith(path) ? 'active' : ''
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className={`navbar ${isAcademyPage ? 'navbar-academy' : ''}`}>
      <div className="navbar-container">

        {/* Logo — always DreamWorld */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="DreamWorld Logo" className="logo-image" />
          <span className="logo-text">DreamWorld</span>
        </Link>


        {/* Hamburger */}
        <button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        {/* Desktop Links */}
        <ul className="navbar-menu">
          {links.map(({ to, label, exact }) => (
            <li key={to + label}>
              <Link to={to} className={isActive(to, exact)}>{label}</Link>
            </li>
          ))}
          {/* Cross-link pill */}
          {isAcademyPage ? (
            <li>
              <Link to="/" className="cross-link">← DreamWorld</Link>
            </li>
          ) : (
            <li>
              <Link to="/academy" className="cross-link">🏫 Academy</Link>
            </li>
          )}
        </ul>

        {/* Mobile Drawer */}
        <div className={`navbar-drawer ${isOpen ? 'open' : ''}`}>
          <div className="drawer-cross-link">
            {isAcademyPage ? (
              <Link to="/" onClick={closeMenu}>← Back to DreamWorld</Link>
            ) : (
              <Link to="/academy" onClick={closeMenu}>🏫 Explore Academy</Link>
            )}
          </div>
          <ul className="drawer-links">
            {links.map(({ to, label, exact }) => (
              <li key={to + label}>
                <Link to={to} className={isActive(to, exact)} onClick={closeMenu}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {isOpen && <div className="overlay" onClick={closeMenu} />}
      </div>
    </nav>
  )
}

export default Navbar
