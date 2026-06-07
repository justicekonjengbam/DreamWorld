import { useState, useEffect, useRef } from 'react'
import { useAudio } from '../context/AudioContext'
import Card from '../components/Card'
import Button from '../components/Button'
import './Songs.css'

function Songs() {
  const {
    songsList,
    activeSong,
    isPlayingCustom,
    currentTime,
    duration,
    isShuffle,
    setIsShuffle,
    isRepeat,
    setIsRepeat,
    playCustomSong,
    pauseCustomSong,
    nextCustomSong,
    prevCustomSong,
    seekCustomSong,
    isSoundMuted,
    setIsSoundMuted,
    musicVolume,
    setMusicVolume,
    customAudioElement
  } = useAudio()

  const [hoveredSongId, setHoveredSongId] = useState(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [smoothTime, setSmoothTime] = useState(0)

  const visualizerCanvasRef = useRef(null)
  const lyricsContainerRef = useRef(null)

  // Disable context menu to prevent easy downloads
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  // Poll audio currentTime at 60fps for ultra-smooth real-time lyric sync
  useEffect(() => {
    let animId
    const updateSmoothTime = () => {
      if (customAudioElement && !customAudioElement.paused) {
        setSmoothTime(customAudioElement.currentTime)
      }
      animId = requestAnimationFrame(updateSmoothTime)
    }

    if (isPlayingCustom && customAudioElement) {
      animId = requestAnimationFrame(updateSmoothTime)
    } else if (customAudioElement) {
      setSmoothTime(customAudioElement.currentTime)
    }

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [isPlayingCustom, customAudioElement])

  // Sync smoothTime when seeking or when global currentTime updates
  useEffect(() => {
    setSmoothTime(currentTime)
  }, [currentTime])

  // Calculate dynamic active lyric line based on current time
  const getActiveLyricIndex = () => {
    if (!activeSong || !activeSong.lyrics || activeSong.lyrics.length === 0) return -1
    return activeSong.lyrics.findIndex((line, i) => {
      const nextLine = activeSong.lyrics[i + 1]
      return smoothTime >= line.time && (!nextLine || smoothTime < nextLine.time)
    })
  }
  const activeLyricIndex = getActiveLyricIndex()

  // Scroll active lyric line into view smoothly
  useEffect(() => {
    if (activeLyricIndex !== -1 && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current
      const activeElement = container.querySelector('.lyric-line-active')
      if (activeElement) {
        const activeOffsetTop = activeElement.offsetTop
        const activeHeight = activeElement.offsetHeight
        const containerHeight = container.offsetHeight
        const targetScrollTop = activeOffsetTop - (containerHeight / 2) + (activeHeight / 2)
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        })
      }
    }
  }, [activeLyricIndex])

  // Beautiful Canvas Audio Visualizer
  useEffect(() => {
    const canvas = visualizerCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Define bars with randomized initial heights
    const barCount = 28
    let barHeights = Array.from({ length: barCount }, () => Math.random() * 10 + 2)
    let speeds = Array.from({ length: barCount }, () => Math.random() * 0.15 + 0.05)

    const renderVisualizer = () => {
      // Resize to fit container
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width
        canvas.height = rect.height
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const gap = 3
      const barWidth = (canvas.width - (barCount - 1) * gap) / barCount

      for (let i = 0; i < barCount; i++) {
        if (isPlayingCustom) {
          // Animate height using sinewaves combined with random noise
          const time = Date.now() * 0.003
          const waveHeight = Math.sin(time + i * 0.3) * (canvas.height * 0.4) + (canvas.height * 0.5)
          const randomJitter = Math.random() * 12 - 6
          const targetHeight = Math.max(4, Math.min(canvas.height, waveHeight + randomJitter))
          barHeights[i] += (targetHeight - barHeights[i]) * speeds[i]
        } else {
          // Decelerate to idle resting line
          barHeights[i] += (4 - barHeights[i]) * 0.1
        }

        const x = i * (barWidth + gap)
        const y = canvas.height - barHeights[i]

        // Create elegant metallic gold to glowing pink gradient matching site theme
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height)
        gradient.addColorStop(0, '#ffd778') // Gold
        gradient.addColorStop(0.5, '#d46aae') // Pink
        gradient.addColorStop(1, '#06040d') // Deep Background

        ctx.fillStyle = gradient
        
        // Rounded top bars
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeights[i], [3, 3, 0, 0])
        } else {
          ctx.rect(x, y, barWidth, barHeights[i])
        }
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(renderVisualizer)
    }

    renderVisualizer()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPlayingCustom])

  // Helper: Format Time in MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }


  // Calculate total playlist duration dynamically
  const getPlaylistDuration = () => {
    let totalSeconds = 0
    songsList.forEach(song => {
      const parts = song.duration.split(':')
      if (parts.length === 2) {
        totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1])
      }
    })
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins} min ${secs} sec`
  }

  // Handle progress bar drag
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value)
    seekCustomSong(seekTime)
  }

  // Handle playlist click play
  const handlePlaySong = (song) => {
    if (activeSong?.id === song.id && isPlayingCustom) {
      pauseCustomSong()
    } else {
      playCustomSong(song)
    }
  }

  // Play whole playlist from beginning (or resume current)
  const handlePlayPlaylist = () => {
    if (songsList.length === 0) return
    if (isPlayingCustom) {
      pauseCustomSong()
    } else {
      if (activeSong) {
        playCustomSong(activeSong)
      } else {
        playCustomSong(songsList[0])
      }
    }
  }


  return (
    <div className="songs-page page" onContextMenu={(e) => e.preventDefault()}>
      <div className="page-hero">
        <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" draggable="false" />
      </div>

      <div className="spotify-container">
        {/* Sidebar Panel */}
        <div className="spotify-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">🏰 Library</h3>
            <div className="playlist-list-item active">
              <div className="playlist-mini-art">🎵</div>
              <div className="playlist-mini-info">
                <span className="playlist-mini-name">DreamWorld Songs</span>
                <span className="playlist-mini-type">Playlist • {songsList.length} songs</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section visualizer-section">
            <h3 className="sidebar-title">✨ Dream Wave</h3>
            <div className="visualizer-container">
              <canvas ref={visualizerCanvasRef} className="visualizer-canvas" />
            </div>
            {activeSong && (
              <div className="visualizer-now-playing">
                <span className="now-playing-label">Now Visualizing</span>
                <span className="now-playing-title">{activeSong.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Playlist Content */}
        <div className="spotify-content">
          <div className="playlist-header-card">
            <div className="playlist-cover-art">
              <img 
                src={activeSong ? activeSong.cover : '/world-tree.png'} 
                alt="Playlist Cover" 
                className={`playlist-img ${isPlayingCustom ? 'spin-slow' : ''}`}
                draggable="false" 
              />
              <div className="playlist-glow" />
            </div>
            <div className="playlist-details">
              <span className="playlist-tag">PUBLIC PLAYLIST</span>
              <h1 className="playlist-name">Dreamworld Songs</h1>
              <p className="playlist-description">
                A mystical sanctuary of music manually curated for the DreamWorld. Listen, focus, and let your mind explore the infinite realms.
              </p>
              <div className="playlist-stats">
                <strong style={{ color: 'var(--color-primary)' }}>DreamWorld</strong>
                <span className="bullet">•</span>
                <span>{songsList.length} songs</span>
                <span className="bullet">•</span>
                <span className="duration-label">{getPlaylistDuration()}</span>
              </div>
            </div>
          </div>

          {/* Split Column Layout */}
          <div className="playlist-main-layout">
            
            {/* Left Column: Playlist Actions & Songs Table */}
            <div className="playlist-left-col">
              {/* Action Row */}
              <div className="playlist-actions-row">
                <button 
                  className={`big-play-btn ${isPlayingCustom ? 'playing' : ''}`}
                  onClick={handlePlayPlaylist}
                  aria-label={isPlayingCustom ? 'Pause playlist' : 'Play playlist'}
                >
                  {isPlayingCustom ? (
                    <span className="pause-icon">❚❚</span>
                  ) : (
                    <span className="play-icon">▶</span>
                  )}
                </button>
                <span className="action-hint">Double click any song to play</span>
              </div>

              {/* Song Table */}
              <div className="songs-table-container">
                <table className="songs-table">
                  <thead>
                    <tr>
                      <th className="col-index">#</th>
                      <th className="col-title">Title</th>
                      <th className="col-album">Album</th>
                      <th className="col-date">Date Added</th>
                      <th className="col-duration">🕒</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songsList.map((song, idx) => {
                      const isCurrent = activeSong?.id === song.id
                      const isPlayingThis = isCurrent && isPlayingCustom

                      return (
                        <tr 
                          key={song.id} 
                          className={`song-row ${isCurrent ? 'active-row' : ''}`}
                          onDoubleClick={() => playCustomSong(song)}
                          onMouseEnter={() => setHoveredSongId(song.id)}
                          onMouseLeave={() => setHoveredSongId(null)}
                        >
                          <td className="col-index">
                            {hoveredSongId === song.id ? (
                              <button 
                                className="row-play-btn" 
                                onClick={() => handlePlaySong(song)}
                              >
                                {isPlayingThis ? '❚❚' : '▶'}
                              </button>
                            ) : isPlayingThis ? (
                              <div className="equalizer-bars">
                                <span className="eq-bar bar1" />
                                <span className="eq-bar bar2" />
                                <span className="eq-bar bar3" />
                              </div>
                            ) : (
                              <span className="row-num">{idx + 1}</span>
                            )}
                          </td>
                          <td className="col-title">
                            <div className="song-title-cell">
                              <img 
                                src={song.cover} 
                                alt={song.title} 
                                className="song-row-cover" 
                                draggable="false" 
                              />
                              <div className="song-title-meta">
                                <span className="song-title-name">{song.title}</span>
                                <span className="song-title-artist">{song.artist}</span>
                              </div>
                            </div>
                          </td>
                          <td className="col-album">{song.album}</td>
                          <td className="col-date">{song.addedAt}</td>
                          <td className="col-duration">{song.duration}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Synced Scrolling Lyrics Panel */}
            <div className="playlist-right-col">
              <div className="lyrics-view-container">
                <div className="lyrics-blur-bg" style={{ backgroundImage: `url(${activeSong ? activeSong.cover : '/world-tree.png'})` }} />
                <div className="lyrics-header-row">
                  <h3 className="lyrics-header-title">📜 Synced Lyrics</h3>
                </div>
                
                <div className="lyrics-scroll-box" ref={lyricsContainerRef}>
                  {activeSong && activeSong.lyrics ? (
                    activeSong.lyrics.map((line, i) => (
                      <p 
                        key={i} 
                        className={`lyric-line ${activeLyricIndex === i ? 'lyric-line-active' : ''} ${activeLyricIndex > i ? 'lyric-line-past' : 'lyric-line-future'}`}
                        onClick={() => seekCustomSong(line.time)}
                        title="Click to skip to this line"
                      >
                        {line.text}
                      </p>
                    ))
                  ) : (
                    <p className="no-lyrics-msg">Select a track and click play to display scrolling lyrics.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotify Bottom Player Bar */}
      <div className="spotify-player-bar">
        {/* Track Info */}
        <div className="player-track-info">
          {activeSong ? (
            <>
              <img 
                src={activeSong.cover} 
                alt={activeSong.title} 
                className="player-cover-art" 
                draggable="false" 
              />
              <div className="player-track-meta">
                <span className="player-track-name">{activeSong.title}</span>
                <span className="player-track-artist">{activeSong.artist}</span>
              </div>
            </>
          ) : (
            <div className="player-no-track">
              <span>Select a song to start dreaming</span>
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="player-controls-container">
          <div className="player-buttons">
            <button 
              className={`control-btn shuffle-btn ${isShuffle ? 'active' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
              title="Shuffle"
            >
              🔀
            </button>
            <button 
              className="control-btn prev-btn" 
              onClick={prevCustomSong}
              disabled={!activeSong}
              title="Previous"
            >
              ⏮
            </button>
            <button 
              className="control-play-btn" 
              onClick={() => activeSong && (isPlayingCustom ? pauseCustomSong() : playCustomSong(activeSong))}
              disabled={!activeSong}
              title={isPlayingCustom ? 'Pause' : 'Play'}
            >
              {isPlayingCustom ? '❚❚' : '▶'}
            </button>
            <button 
              className="control-btn next-btn" 
              onClick={nextCustomSong}
              disabled={!activeSong}
              title="Next"
            >
              ⏭
            </button>
            <button 
              className={`control-btn repeat-btn ${isRepeat ? 'active' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
              title="Repeat"
            >
              🔁
            </button>
          </div>

          <div className="player-progress-bar">
            <span className="time-label">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="progress-slider"
              disabled={!activeSong}
            />
            <span className="time-label">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="player-volume-container">
          <button 
            className="volume-btn" 
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            onMouseEnter={() => setShowVolumeSlider(true)}
            title={isSoundMuted ? 'Unmute' : 'Mute'}
          >
            {isSoundMuted ? '🔇' : '🔊'}
          </button>
          <div 
            className={`volume-slider-wrapper ${showVolumeSlider ? 'show' : ''}`}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={isSoundMuted ? 0 : musicVolume} 
              onChange={(e) => {
                const vol = parseFloat(e.target.value)
                setMusicVolume(vol)
                if (vol > 0 && isSoundMuted) setIsSoundMuted(false)
              }}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Songs
