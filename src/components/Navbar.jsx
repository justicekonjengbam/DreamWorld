import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="DreamWorld Logo" className="logo-image" />
          <span>DreamWorld</span>
        </Link>

        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')} onClick={closeMenu}>Story</Link></li>
          <li><Link to="/creator" className={isActive('/creator')} onClick={closeMenu}>Creator</Link></li>
          <li><Link to="/roles" className={isActive('/roles')} onClick={closeMenu}>Roles</Link></li>
          <li><Link to="/characters" className={isActive('/characters')} onClick={closeMenu}>Dreamers</Link></li>
          <li><Link to="/quests" className={isActive('/quests')} onClick={closeMenu}>Quests</Link></li>
          <li><Link to="/events" className={isActive('/events')} onClick={closeMenu}>Events</Link></li>
          <li><Link to="/join" className={isActive('/join')} onClick={closeMenu}>Join</Link></li>
          <Link to="/funders">Support</Link>
        </ul>

        {isOpen && <div className="overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  )
}

export default Navbar
