import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from '../context/AudioContext'
import SongsPreloader from '../components/SongsPreloader'
import './Songs.css'

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ─── Component ───────────────────────────────────────────────────────────────
function Songs() {
  const {
    songsList, activeSong, isPlayingCustom, currentTime, duration,
    isShuffle, setIsShuffle, isRepeat, setIsRepeat,
    playCustomSong, pauseCustomSong, nextCustomSong, prevCustomSong,
    seekCustomSong, isSoundMuted, setIsSoundMuted,
    musicVolume, setMusicVolume, customAudioElement
  } = useAudio()

  const [hoveredSongId, setHoveredSongId]   = useState(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [smoothTime, setSmoothTime]           = useState(0)
  const [viewMode, setViewMode]               = useState('playlist')
  const [selectedSong, setSelectedSong]       = useState(null)
  const [showSongsPreloader, setShowSongsPreloader] = useState(() =>
    sessionStorage.getItem('dreamworld_songs_preloaded') !== 'true'
  )

  // ── Calibration state ──────────────────────────────────────────────────────
  const visualizerCanvasRef = useRef(null)
  const lyricsContainerRef  = useRef(null)
  const rafRef              = useRef(null)

  // ── Preloader ──────────────────────────────────────────────────────────────
  const handleSongsPreloadComplete = () => {
    sessionStorage.setItem('dreamworld_songs_preloaded', 'true')
    setShowSongsPreloader(false)
  }

  // ── Disable right-click ────────────────────────────────────────────────────
  useEffect(() => {
    const block = (e) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  // ── RAF: read currentTime every frame ─────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      if (customAudioElement) setSmoothTime(customAudioElement.currentTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [customAudioElement])

  // ── When activeSong changes in song view, follow it ───────────────────────
  useEffect(() => {
    if (activeSong && viewMode === 'song') {
      setSelectedSong(activeSong)
    }
  }, [activeSong, viewMode])

  // ── Check localStorage on song selection ──────────────────────────────────
// ── Active lyric index ────────────────────────────────────────────────────
  const getActiveLyricIndex = useCallback((lyrics) => {
    if (!lyrics?.length) return -1
    let active = -1
    for (let i = 0; i < lyrics.length; i++) {
      if (smoothTime >= lyrics[i].time) active = i
      else break
    }
    return active
  }, [smoothTime])

  const songViewLyrics    = selectedSong?.lyrics || []
  const songViewActive    = getActiveLyricIndex(songViewLyrics)

  // ── Auto-scroll lyrics ────────────────────────────────────────────────────
  useEffect(() => {
    if (songViewActive !== -1 && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current
      const el = container.querySelector('.lyric-line-active')
      if (el) {
        container.scrollTo({
          top: el.offsetTop - container.offsetHeight / 2 + el.offsetHeight / 2,
          behavior: 'smooth'
        })
      }
    }
  }, [songViewActive])

  // ── Calibration: Space key ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = visualizerCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const barCount = 28
    let barHeights = Array.from({ length: barCount }, () => Math.random() * 10 + 2)
    let speeds     = Array.from({ length: barCount }, () => Math.random() * 0.15 + 0.05)

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width; canvas.height = rect.height
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gap = 3
      const bw  = (canvas.width - (barCount - 1) * gap) / barCount

      for (let i = 0; i < barCount; i++) {
        if (isPlayingCustom) {
          const wave   = Math.sin(Date.now() * 0.003 + i * 0.3) * (canvas.height * 0.4) + (canvas.height * 0.5)
          const target = Math.max(4, Math.min(canvas.height, wave + Math.random() * 12 - 6))
          barHeights[i] += (target - barHeights[i]) * speeds[i]
        } else {
          barHeights[i] += (4 - barHeights[i]) * 0.1
        }
        const x    = i * (bw + gap)
        const y    = canvas.height - barHeights[i]
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height)
        grad.addColorStop(0, '#ffd778')
        grad.addColorStop(0.5, '#d46aae')
        grad.addColorStop(1, '#06040d')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect ? ctx.roundRect(x, y, bw, barHeights[i], [3, 3, 0, 0]) : ctx.rect(x, y, bw, barHeights[i])
        ctx.fill()
      }
      animId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(animId)
  }, [isPlayingCustom])

  const formatTime = (s) => {
    if (isNaN(s) || s == null) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  const getPlaylistDuration = () => {
    let total = 0
    songsList.forEach(s => {
      const p = s.duration.split(':')
      if (p.length === 2) total += parseInt(p[0]) * 60 + parseInt(p[1])
    })
    return `${Math.floor(total / 60)} min ${total % 60} sec`
  }

  const handleSeek      = (e) => seekCustomSong(parseFloat(e.target.value))
  const handlePlaySong  = (song) => {
    activeSong?.id === song.id && isPlayingCustom ? pauseCustomSong() : playCustomSong(song)
  }

  const handleOpenSongPage = (song) => {
    setSelectedSong(song)
    setViewMode('song')
    if (activeSong?.id !== song.id) playCustomSong(song)
  }

  const handlePlayPlaylist = () => {
    if (!songsList.length) return
    if (isPlayingCustom) pauseCustomSong()
    else activeSong ? playCustomSong(activeSong) : playCustomSong(songsList[0])
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SONG DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (viewMode === 'song' && selectedSong) {
    const isCurrentSong = activeSong?.id === selectedSong.id
    const isPlaying     = isCurrentSong && isPlayingCustom

    return (
      <div className="songs-page page song-detail-page" onContextMenu={e => e.preventDefault()}>
        {showSongsPreloader && <SongsPreloader onComplete={handleSongsPreloadComplete} />}

        <div className="song-detail-bg" style={{ backgroundImage: `url(${selectedSong.cover})` }} />

        <div className="song-detail-wrapper">
          <button className="back-to-playlist-btn" onClick={() => setViewMode('playlist')}>
            ← Back to Playlist
          </button>

          <div className="song-detail-layout">
            {/* Left: Cover + Controls */}
            <div className="song-detail-left">
              <div className="song-detail-cover-wrap">
                <img src={selectedSong.cover} alt={selectedSong.title} className="song-detail-cover" draggable="false" />
                <div className="song-detail-cover-glow" />
              </div>

              <div className="song-detail-meta">
                <span className="song-detail-album">{selectedSong.album}</span>
                <h1 className="song-detail-title">{selectedSong.title}</h1>
                <p className="song-detail-artist">{selectedSong.artist}</p>
                <span className="song-detail-genre">{selectedSong.genre}</span>
              </div>

              <div className="song-detail-progress">
                <div className="song-detail-time-row">
                  <span className="time-label">{formatTime(isCurrentSong ? smoothTime : 0)}</span>
                  <span className="time-label">{formatTime(isCurrentSong ? duration : 0)}</span>
                </div>
                <input
                  type="range" min="0"
                  max={isCurrentSong ? (duration || 100) : 100}
                  value={isCurrentSong ? smoothTime : 0}
                  onChange={handleSeek}
                  className="progress-slider song-detail-slider"
                  disabled={!isCurrentSong}
                />
              </div>

              <div className="song-detail-controls">
                <button className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)} title="Shuffle">🔀</button>
                <button className="control-btn" onClick={prevCustomSong} title="Previous">⏮</button>
                <button
                  className="song-detail-play-btn"
                  onClick={() => isPlaying ? pauseCustomSong() : playCustomSong(selectedSong)}
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
                <button className="control-btn" onClick={nextCustomSong} title="Next">⏭</button>
                <button className={`control-btn ${isRepeat ? 'active' : ''}`} onClick={() => setIsRepeat(!isRepeat)} title="Repeat">🔁</button>
              </div>

              <div className="song-detail-volume">
                <button className="volume-btn" onClick={() => setIsSoundMuted(!isSoundMuted)}>
                  {isSoundMuted ? '🔇' : '🔊'}
                </button>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={isSoundMuted ? 0 : musicVolume}
                  onChange={e => {
                    const v = parseFloat(e.target.value)
                    setMusicVolume(v)
                    if (v > 0 && isSoundMuted) setIsSoundMuted(false)
                  }}
                  className="volume-slider song-detail-vol-slider"
                />
              </div>
            </div>

            {/* Right: Synced Lyrics */}
            <div className="song-detail-right">
              <div className="song-detail-lyrics-panel">
                <div className="lyrics-blur-bg" style={{ backgroundImage: `url(${selectedSong.cover})` }} />

                <div className="lyrics-header-row">
                  <h3 className="lyrics-header-title">📜 Lyrics</h3>
                  <div className="lyrics-header-actions">
                    {isPlaying && (
                      <span className="lyrics-live-badge">LIVE</span>
                    )}
                  </div>
                </div>

                <div className="lyrics-scroll-box song-detail-lyrics-scroll" ref={lyricsContainerRef}>
                  {songViewLyrics.length > 0 ? (
                    songViewLyrics.map((line, i) => (
                      <p
                        key={i}
                        className={`lyric-line ${songViewActive === i ? 'lyric-line-active' : ''} ${songViewActive > i ? 'lyric-line-past' : 'lyric-line-future'}`}
                        onClick={() => { seekCustomSong(line.time); if (!isPlaying) playCustomSong(selectedSong) }}
                        title="Click to jump here"
                      >
                        {line.text}
                      </p>
                    ))
                  ) : (
                    <p className="no-lyrics-msg">No lyrics available for this track.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <PlayerBar
          activeSong={activeSong} isPlayingCustom={isPlayingCustom}
          currentTime={currentTime} duration={duration}
          isShuffle={isShuffle} setIsShuffle={setIsShuffle}
          isRepeat={isRepeat} setIsRepeat={setIsRepeat}
          isSoundMuted={isSoundMuted} setIsSoundMuted={setIsSoundMuted}
          musicVolume={musicVolume} setMusicVolume={setMusicVolume}
          showVolumeSlider={showVolumeSlider} setShowVolumeSlider={setShowVolumeSlider}
          pauseCustomSong={pauseCustomSong} playCustomSong={playCustomSong}
          nextCustomSong={nextCustomSong} prevCustomSong={prevCustomSong}
          handleSeek={handleSeek} formatTime={formatTime}
          onCoverClick={activeSong ? () => handleOpenSongPage(activeSong) : null}
        />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYLIST VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="songs-page page" onContextMenu={(e) => e.preventDefault()}>
      {showSongsPreloader && <SongsPreloader onComplete={handleSongsPreloadComplete} />}

      <div className="page-hero">
        <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" draggable="false" />
      </div>

      <div className="spotify-container">
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
                <span className="now-playing-label">Now Playing</span>
                <span className="now-playing-title">{activeSong.title}</span>
              </div>
            )}
          </div>
        </div>

        <div className="spotify-content">
          <div className="playlist-header-card">
            <div className="playlist-cover-art-square">
              <img
                src={activeSong ? activeSong.cover : '/world-tree.png'}
                alt="Playlist Cover"
                className="playlist-img-square"
                draggable="false"
              />
              <div className="playlist-glow-square" />
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

          <div className="playlist-actions-row">
            <button
              className={`big-play-btn ${isPlayingCustom ? 'playing' : ''}`}
              onClick={handlePlayPlaylist}
              aria-label={isPlayingCustom ? 'Pause playlist' : 'Play playlist'}
            >
              {isPlayingCustom ? <span className="pause-icon">❚❚</span> : <span className="play-icon">▶</span>}
            </button>
            <span className="action-hint">Click a song to open its page</span>
          </div>

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
                  const isCurrent    = activeSong?.id === song.id
                  const isPlayingThis = isCurrent && isPlayingCustom

                  return (
                    <tr
                      key={song.id}
                      className={`song-row ${isCurrent ? 'active-row' : ''}`}
                      onClick={() => handleOpenSongPage(song)}
                      onMouseEnter={() => setHoveredSongId(song.id)}
                      onMouseLeave={() => setHoveredSongId(null)}
                    >
                      <td className="col-index">
                        {hoveredSongId === song.id ? (
                          <button className="row-play-btn" onClick={e => { e.stopPropagation(); handlePlaySong(song) }}>
                            {isPlayingThis ? '❚❚' : '▶'}
                          </button>
                        ) : isPlayingThis ? (
                          <div className="equalizer-bars">
                            <span className="eq-bar bar1" /><span className="eq-bar bar2" /><span className="eq-bar bar3" />
                          </div>
                        ) : (
                          <span className="row-num">{idx + 1}</span>
                        )}
                      </td>
                      <td className="col-title">
                        <div className="song-title-cell">
                          <img src={song.cover} alt={song.title} className="song-row-cover" draggable="false" />
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
      </div>

      <PlayerBar
        activeSong={activeSong} isPlayingCustom={isPlayingCustom}
        currentTime={currentTime} duration={duration}
        isShuffle={isShuffle} setIsShuffle={setIsShuffle}
        isRepeat={isRepeat} setIsRepeat={setIsRepeat}
        isSoundMuted={isSoundMuted} setIsSoundMuted={setIsSoundMuted}
        musicVolume={musicVolume} setMusicVolume={setMusicVolume}
        showVolumeSlider={showVolumeSlider} setShowVolumeSlider={setShowVolumeSlider}
        pauseCustomSong={pauseCustomSong} playCustomSong={playCustomSong}
        nextCustomSong={nextCustomSong} prevCustomSong={prevCustomSong}
        handleSeek={handleSeek} formatTime={formatTime}
        onCoverClick={activeSong ? () => handleOpenSongPage(activeSong) : null}
      />
    </div>
  )
}

// ─── Player Bar ───────────────────────────────────────────────────────────────
function PlayerBar({
  activeSong, isPlayingCustom, currentTime, duration,
  isShuffle, setIsShuffle, isRepeat, setIsRepeat,
  isSoundMuted, setIsSoundMuted, musicVolume, setMusicVolume,
  showVolumeSlider, setShowVolumeSlider,
  pauseCustomSong, playCustomSong, nextCustomSong, prevCustomSong,
  handleSeek, formatTime, onCoverClick
}) {
  return (
    <div className="spotify-player-bar">
      <div className="player-track-info">
        {activeSong ? (
          <>
            <img
              src={activeSong.cover}
              alt={activeSong.title}
              className={`player-cover-art ${onCoverClick ? 'clickable-cover' : ''}`}
              draggable="false"
              onClick={onCoverClick}
              title={onCoverClick ? 'Open song page' : ''}
            />
            <div className="player-track-meta">
              <span className="player-track-name">{activeSong.title}</span>
              <span className="player-track-artist">{activeSong.artist}</span>
            </div>
          </>
        ) : (
          <div className="player-no-track"><span>Select a song to start dreaming</span></div>
        )}
      </div>

      <div className="player-controls-container">
        <div className="player-buttons">
          <button className={`control-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)} title="Shuffle">🔀</button>
          <button className="control-btn" onClick={prevCustomSong} disabled={!activeSong} title="Previous">⏮</button>
          <button
            className="control-play-btn"
            onClick={() => activeSong && (isPlayingCustom ? pauseCustomSong() : playCustomSong(activeSong))}
            disabled={!activeSong}
          >
            {isPlayingCustom ? '❚❚' : '▶'}
          </button>
          <button className="control-btn" onClick={nextCustomSong} disabled={!activeSong} title="Next">⏭</button>
          <button className={`control-btn ${isRepeat ? 'active' : ''}`} onClick={() => setIsRepeat(!isRepeat)} title="Repeat">🔁</button>
        </div>
        <div className="player-progress-bar">
          <span className="time-label">{formatTime(currentTime)}</span>
          <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} className="progress-slider" disabled={!activeSong} />
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume-container">
        <button className="volume-btn" onClick={() => setIsSoundMuted(!isSoundMuted)} onMouseEnter={() => setShowVolumeSlider(true)}>
          {isSoundMuted ? '🔇' : '🔊'}
        </button>
        <div className={`volume-slider-wrapper ${showVolumeSlider ? 'show' : ''}`} onMouseLeave={() => setShowVolumeSlider(false)}>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isSoundMuted ? 0 : musicVolume}
            onChange={e => {
              const v = parseFloat(e.target.value)
              setMusicVolume(v)
              if (v > 0 && isSoundMuted) setIsSoundMuted(false)
            }}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
}

export default Songs
