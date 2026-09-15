import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import './Navbar.css'

const PRIMARY_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'Story' },
  { to: '/clans', label: 'Clans' },
  { to: '/characters', label: 'Dreamers' },
  { to: '/quests', label: 'Quests' },
  { to: '/events', label: 'Events' },
  { to: '/songs', label: 'Songs' },
]

const MORE_LINKS = [
  { to: '/creator', label: 'Creator' },
  { to: '/thanks', label: 'Sponsors' },
]

function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { appSettings } = useContent()

  const isJoinClosed = appSettings?.dreamworld_open === false

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path ? 'active' : ''
    return location.pathname.startsWith(path) ? 'active' : ''
  }

  const isMoreActive = MORE_LINKS.some(link => location.pathname.startsWith(link.to))

  const closeMenu = () => {
    setIsOpen(false)
    setMoreDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">DreamWorld</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-menu desktop-menu">
          {PRIMARY_LINKS.map(({ to, label, exact }) => (
            <li key={to}>
              <Link to={to} className={`nav-link ${isActive(to, exact)}`}>
                {label}
              </Link>
            </li>
          ))}

          {/* More / Explore Dropdown */}
          <li className="nav-dropdown-item" ref={dropdownRef}>
            <button 
              className={`nav-link dropdown-toggle ${isMoreActive ? 'active' : ''}`}
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              aria-expanded={moreDropdownOpen}
            >
              Explore <span className={`dropdown-arrow ${moreDropdownOpen ? 'open' : ''}`}>▾</span>
            </button>
            {moreDropdownOpen && (
              <div className="nav-dropdown-menu fade-in-down">
                {MORE_LINKS.map(({ to, label }) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className={`dropdown-link ${isActive(to)}`}
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Navbar Right Actions (Join Pill + Settings Button) */}
        <div className="navbar-actions">
          {/* Join Button */}
          <Link 
            to="/join" 
            className={`nav-join-btn ${isActive('/join')} ${isJoinClosed ? 'closed' : ''}`}
            onClick={closeMenu}
          >
            <span className="join-dot" />
            {isJoinClosed ? 'Join (Closed)' : 'Join World'}
          </Link>

          {/* Settings Button */}
          <Link 
            to="/settings" 
            className={`nav-settings-btn ${isActive('/settings')}`}
            onClick={closeMenu}
            title="System Settings"
          >
            <span className="settings-icon">⚙️</span>
            <span className="settings-label">Settings</span>
          </Link>

          {/* Hamburger Menu Button for Mobile/Tablet */}
          <button
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`navbar-drawer ${isOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <span className="drawer-title">DreamWorld Realm</span>
            <button className="drawer-close-btn" onClick={closeMenu}>✕</button>
          </div>

          <div className="drawer-section">
            <span className="drawer-section-label">Main Navigation</span>
            <ul className="drawer-links">
              {PRIMARY_LINKS.map(({ to, label, exact }) => (
                <li key={to}>
                  <Link to={to} className={isActive(to, exact)} onClick={closeMenu}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="drawer-section">
            <span className="drawer-section-label">Explore Realm</span>
            <ul className="drawer-links">
              {MORE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={isActive(to)} onClick={closeMenu}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="drawer-section drawer-footer-actions">
            <Link to="/join" className={`drawer-action-btn join ${isJoinClosed ? 'closed' : ''}`} onClick={closeMenu}>
              ✨ {isJoinClosed ? 'Join (Closed)' : 'Join World'}
            </Link>
            <Link to="/settings" className="drawer-action-btn settings" onClick={closeMenu}>
              ⚙️ System Settings
            </Link>
          </div>
        </div>

        {isOpen && <div className="overlay" onClick={closeMenu} />}
      </div>
    </nav>
  )
}

export default Navbar
