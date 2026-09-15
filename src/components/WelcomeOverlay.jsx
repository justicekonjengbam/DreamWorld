import { useState, useEffect } from 'react'
import './WelcomeOverlay.css'

const ESSENTIAL_ASSETS = [
  '/logo.png',
  '/world-tree.png',
  '/crystal-library.png',
  '/future-vision.png',
  '/living-city.png',
  '/Clans/clan_background_desktop.png',
  '/Clans/clan_background_mobile.png',
  '/Clans/clan_core.png',
  '/Clans/The_Crimson_Phoenix.png',
  '/Clans/The_White_Lotus_Clan.png',
  '/Clans/The_Silver_Feather_Clan.png',
  '/Clans/The_Verdant_Grove.png',
  '/Clans/The_Golden_Thunder_Clan.png'
]

function WelcomeOverlay({ onEnter }) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Connecting to Sacred Realm...')
  const [isPreloadComplete, setIsPreloadComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let loadedCount = 0
    const totalAssets = ESSENTIAL_ASSETS.length

    const updateStatusText = (pct) => {
      if (pct < 30) setLoadingText('Connecting to Sacred Realm...')
      else if (pct < 60) setLoadingText('Downloading High-Res Imagery & Clan Seals...')
      else if (pct < 90) setLoadingText('Caching Realm Backgrounds & Artworks...')
      else setLoadingText('DreamWorld Realm Preloaded & Ready!')
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
      setLoadingText('DreamWorld Realm Preloaded & Ready!')
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
    }, 800)
  }

  if (!isVisible) return null

  return (
    <div className={`welcome-overlay ${isExiting ? 'exiting' : ''}`}>
      <div className="welcome-content">
        <img src="/logo.png" alt="DreamWorld" className="welcome-logo" />
        <h1 className="welcome-title">Welcome to DreamWorld</h1>
        <p className="welcome-subtitle">Where nature, technology, and wonder unite</p>

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
          className={`enter-btn ${isPreloadComplete ? 'ready' : ''}`}
        >
          {isPreloadComplete ? '✨ Enter DreamWorld ✨' : '⚡ Enter Realm Anyway'}
        </button>
        <p className="welcome-note">Click to initialize sound and enter the world</p>
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
