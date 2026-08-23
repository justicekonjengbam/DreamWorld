import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import './Navbar.css'

const DREAMWORLD_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'Story' },
  { to: '/creator', label: 'Creator' },
  { to: '/roles', label: 'Roles' },
  { to: '/characters', label: 'Dreamers' },
  { to: '/quests', label: 'Quests' },
  { to: '/events', label: 'Events' },
  { to: '/songs', label: 'Songs' },
  { to: '/games', label: 'Mind Games' },
  { to: '/join', label: 'Join' },
  { to: '/funders', label: 'Support' },
  { to: '/thanks', label: 'Sponsors' },
  { to: '/settings', label: 'Settings' },
]

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { appSettings } = useContent()

  const processedLinks = DREAMWORLD_LINKS.map(link => {
    if (link.to === '/join' && appSettings?.dreamworld_open === false) {
      return { ...link, label: 'Join (Closed)' }
    }
    return link
  })

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path ? 'active' : ''
    return location.pathname.startsWith(path) ? 'active' : ''
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="navbar">
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
          {processedLinks.map(({ to, label, exact }) => (
            <li key={to + label}>
              <Link to={to} className={isActive(to, exact)}>{label}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile Drawer */}
        <div className={`navbar-drawer ${isOpen ? 'open' : ''}`}>
          <ul className="drawer-links">
            {processedLinks.map(({ to, label, exact }) => (
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
