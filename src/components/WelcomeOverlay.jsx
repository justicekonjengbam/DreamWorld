import { useState, useRef, useEffect } from 'react'
import './WelcomeOverlay.css'

function WelcomeOverlay({ onEnter }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth)
  const videoRef = useRef(null)

  // Dynamically detect screen orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEnter = () => {
    setIsPlayingVideo(true)
  }

  const completeTransition = () => {
    // Trigger audio immediately
    onEnter()
    
    // Trigger visual fadeout of the overlay
    setIsExiting(true)
    
    // Hide overlay completely after fade out animation
    setTimeout(() => {
      setIsVisible(false)
    }, 1200)
  }

  const handleVideoEnd = () => {
    completeTransition()
  }

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    completeTransition()
  }

  if (!isVisible) return null

  // Configure orientation-aware sources and high-quality royalty-free CDN fallbacks
  const videoSrc = isPortrait ? "/portal-portrait.mp4" : "/portal.mp4"
  const fallbackSrc = isPortrait 
    ? "https://assets.mixkit.co/videos/preview/mixkit-vertical-hypnotic-swirl-of-glowing-particles-44280-large.mp4" // Beautiful vertical purple/teal abstract swirly flow
    : "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4" // Gorgeous horizontal starflight

  return (
    <div className={`welcome-overlay ${isExiting ? 'exiting' : ''} ${isPlayingVideo ? 'playing-video' : ''}`}>
      {!isPlayingVideo ? (
        <div className="welcome-content">
          <img src="/logo.png" alt="DreamWorld" className="welcome-logo" />
          <h1>Welcome to DreamWorld</h1>
          <p>Where nature, technology, and wonder unite</p>
          <button onClick={handleEnter} className="enter-btn">
            ✨ Enter DreamWorld ✨
          </button>
          <p className="welcome-note">Click to enable music and experience</p>
        </div>
      ) : (
        <div className="video-transition-wrapper">
          <video
            ref={videoRef}
            src={videoSrc}
            className="transition-video"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            onError={(e) => {
              // Gracefully switch to beautiful vertical/horizontal CDNs if local files are absent
              if (videoRef.current) {
                videoRef.current.src = fallbackSrc
                videoRef.current.play().catch(() => {})
              }
            }}
          />
          <button onClick={handleSkip} className="skip-btn">
            Skip Intro →
          </button>
        </div>
      )}
      
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
