import { useState } from 'react'
import './WelcomeOverlay.css'

function WelcomeOverlay({ onEnter }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const handleEnter = () => {
    // Call onEnter FIRST to start audio immediately
    onEnter()
    
    // Then start visual transition
    setIsExiting(true)
    
    // Hide overlay after animation completes
    setTimeout(() => {
      setIsVisible(false)
    }, 800)
  }

  if (!isVisible) return null

  return (
    <div className={`welcome-overlay ${isExiting ? 'exiting' : ''}`}>
      <div className="welcome-content">
        <img src="/logo.png" alt="DreamWorld" className="welcome-logo" />
        <h1>Welcome to DreamWorld</h1>
        <p>Where nature, technology, and wonder unite</p>
        <button onClick={handleEnter} className="enter-btn">
          ✨ Enter DreamWorld ✨
        </button>
        <p className="welcome-note">Click to enable music and experience</p>
      </div>
      
      {isExiting && (
        <div className="magic-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="magic-particle"></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WelcomeOverlay
