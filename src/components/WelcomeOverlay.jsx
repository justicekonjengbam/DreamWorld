import { useState, useEffect } from 'react'
import './WelcomeOverlay.css'

const ESSENTIAL_ASSETS = [
  '/logo.png',
  '/dreamworld-portal-bg.jpg'
]

function WelcomeOverlay({ onEnter, onExitComplete }) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Establishing realm link...')
  const [isPreloadComplete, setIsPreloadComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let loadedCount = 0
    const totalAssets = ESSENTIAL_ASSETS.length

    const updateStatusText = (pct) => {
      if (pct < 30) setLoadingText('Establishing realm link...')
      else if (pct < 60) setLoadingText('Gathering world fragments...')
      else if (pct < 90) setLoadingText('Waking the living world...')
      else setLoadingText('DreamWorld is ready.')
    }

    ESSENTIAL_ASSETS.forEach(src => {
      const img = new Image()
      const handleLoad = () => {
        loadedCount++
        const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 100))
        setProgress(pct)
        updateStatusText(pct)
        if (loadedCount >= totalAssets) {
          setIsPreloadComplete(true)
        }
      }
      img.onload = handleLoad
      img.onerror = handleLoad
      img.src = src
    })

    // Fallback timer ensuring preloader finishes in max 3.5 seconds
    const fallbackTimer = setTimeout(() => {
      setProgress(100)
      setLoadingText('DreamWorld is ready.')
      setIsPreloadComplete(true)
    }, 3500)

    return () => clearTimeout(fallbackTimer)
  }, [])

  const handleEnter = () => {
    sessionStorage.setItem('dreamworld_assets_preloaded', 'true')
    onEnter()
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onExitComplete?.()
    }, 1100)
  }

  if (!isVisible) return null

  return (
      <div className={`welcome-overlay ${isExiting ? 'exiting' : ''}`}>
        <div className="welcome-portal" aria-hidden="true" />
      <div className="welcome-content">
        <p className="welcome-kicker"><span>✧</span> A BEAUTIFUL DREAM <span>✧</span></p>
        <img src="/logo.png" alt="DreamWorld" className="welcome-logo" />
        <h1 className="welcome-title">The Realm Awaits</h1>
        <p className="welcome-subtitle">A living world, ready to grow with you.</p>

        {/* Real-time Preloading Progress Card */}
        <div className="preloader-progress-box">
          <div className="preloader-bar-outer">
            <div 
              className="preloader-bar-inner" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="preloader-meta">
            <span className="preloader-text">{loadingText}</span>
            <span className="preloader-pct">{progress}%</span>
          </div>
        </div>

        {/* Action Enter Button */}
        <button 
          onClick={handleEnter} 
          className="enter-btn"
        >
          <span className="welcome-enter-sigil" aria-hidden="true">✧</span>{isPreloadComplete ? 'Enter DreamWorld' : 'Enter the Realm'}<span className="welcome-enter-sigil" aria-hidden="true">✧</span>
        </button>
        <p className="welcome-note">Select to awaken the sound and enter</p>
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
