import { useState, useEffect } from 'react'
import { initialSongs } from '../data/songs'
import './SongsPreloader.css'

function SongsPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Attuning Realm Harmonies...')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let loadedCount = 0
    const totalSongs = initialSongs.length

    if (totalSongs === 0) {
      setProgress(100)
      setIsDone(true)
      return
    }

    initialSongs.forEach((song, index) => {
      const audio = new Audio()
      
      const handleLoaded = () => {
        loadedCount++
        const pct = Math.min(100, Math.round((loadedCount / totalSongs) * 100))
        setProgress(pct)
        setStatusText(`Buffered "${song.title}" (${loadedCount}/${totalSongs})`)
        if (loadedCount >= totalSongs) {
          setStatusText('All DreamWorld Harmonies Ready!')
          setIsDone(true)
        }
      }

      // Track metadata / canplaythrough
      audio.oncanplaythrough = handleLoaded
      audio.onerror = handleLoaded
      audio.src = song.src
      audio.load()
    })

    // Safety fallback timer ensuring preloader finishes in max 4 seconds
    const fallbackTimer = setTimeout(() => {
      setProgress(100)
      setStatusText('All DreamWorld Harmonies Ready!')
      setIsDone(true)
    }, 4000)

    return () => clearTimeout(fallbackTimer)
  }, [])

  const handleEnterSongs = () => {
    sessionStorage.setItem('dreamworld_songs_preloaded', 'true')
    onComplete()
  }

  return (
    <div className="songs-preloader-overlay fade-in">
      <div className="songs-preloader-card">
        {/* Animated Equalizer Visualizer */}
        <div className="preloader-equalizer">
          {[...Array(9)].map((_, i) => (
            <span key={i} className={`eq-bar-anim eq-bar-${i % 3}`} />
          ))}
        </div>

        <h2 className="songs-preloader-title">🎵 Attuning Realm Harmonies</h2>
        <p className="songs-preloader-subtitle">Downloading & Caching DreamWorld Songs</p>

        {/* Progress Bar */}
        <div className="songs-progress-container">
          <div className="songs-progress-outer">
            <div className="songs-progress-inner" style={{ width: `${progress}%` }} />
          </div>
          <div className="songs-progress-meta">
            <span className="songs-status-text">{statusText}</span>
            <span className="songs-pct">{progress}%</span>
          </div>
        </div>

        {/* Enter Action Button */}
        <button 
          onClick={handleEnterSongs} 
          className={`songs-enter-btn ${isDone ? 'ready' : ''}`}
        >
          {isDone ? '✨ Listen to DreamWorld Songs ✨' : '⚡ Enter Player Directly'}
        </button>
      </div>
    </div>
  )
}

export default SongsPreloader
