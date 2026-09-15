import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Avatar from '../components/Avatar'
import ImageModal from '../components/ImageModal'
import './Clans.css'

function Clans() {
  const { clans, characters, loading } = useContent()
  const [activeSpotlightClan, setActiveSpotlightClan] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  // Trigonometric coordinates for 5 vertices of a pentagon (top center start at -90deg)
  // Radius R = 38% from center (50%, 50%)
  const PENTAGON_VERTICES = [
    { x: 50, y: 12 },    // Top Center (-90 deg)
    { x: 86.1, y: 38.3 }, // Top Right (-18 deg)
    { x: 72.3, y: 80.7 }, // Bottom Right (+54 deg)
    { x: 27.7, y: 80.7 }, // Bottom Left (+126 deg)
    { x: 13.9, y: 38.3 }  // Top Left (+198 deg / -162 deg)
  ]

  const handleClanTap = (clan) => {
    // Play standard button audio effect like all other pages
    try {
      const audio = new Audio('/ButtonAudio.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {}

    setActiveSpotlightClan(clan)
  }

  const openLightbox = (src, e) => {
    if (e) e.stopPropagation()
    if (!src) return
    setModalImage(src)
    setModalOpen(true)
  }

  const navigateSpotlight = (direction) => {
    if (!activeSpotlightClan || clans.length === 0) return
    const currentIndex = clans.findIndex(c => c.id === activeSpotlightClan.id)
    if (currentIndex === -1) return

    let nextIndex
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % clans.length
    } else {
      nextIndex = (currentIndex - 1 + clans.length) % clans.length
    }
    const targetClan = clans[nextIndex]

    try {
      const audio = new Audio('/ButtonAudio.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch (e) {}

    setActiveSpotlightClan(targetClan)
  }

  if (loading) return <div className="loading-state">Syncing Sacred Clans with DreamWorld...</div>

  return (
    <div className="clans-page page">
      {/* Background overlay gradient for high readability */}
      <div className="clans-bg-overlay" />

      <div className="container clans-container">
        {/* Header Hero */}
        <div className="clans-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="clans-logo" />
          <h1 className="clans-title-main">The Five Sacred Clans</h1>
          <p className="clans-subtitle-main">
            Every Dreamer carries an elemental spark. Discover the five ancient pillars that shape our realm.
          </p>
          <div className="pentagon-instruction-badge">
            <span className="sparkle-icon">✨</span> Tap any Clan Emblem to reveal its details
          </div>
        </div>

        {/* Lightbox Image Modal */}
        <ImageModal
          src={modalImage}
          alt="Clan Emblem"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Dynamic Pentagon Arena */}
        <div className="pentagon-section">
          <div className="pentagon-arena-wrapper">
            {/* SVG Glowing Pentagon Seal Lines */}
            <svg className="pentagon-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Outer Pentagon Edges */}
              <polygon 
                points={PENTAGON_VERTICES.map(v => `${v.x},${v.y}`).join(' ')} 
                className="pentagon-polygon-edge"
              />

              {/* Inner Pentagram Star Lines */}
              <polygon 
                points={`${PENTAGON_VERTICES[0].x},${PENTAGON_VERTICES[0].y} ${PENTAGON_VERTICES[2].x},${PENTAGON_VERTICES[2].y} ${PENTAGON_VERTICES[4].x},${PENTAGON_VERTICES[4].y} ${PENTAGON_VERTICES[1].x},${PENTAGON_VERTICES[1].y} ${PENTAGON_VERTICES[3].x},${PENTAGON_VERTICES[3].y}`}
                className="pentagon-star-edge"
              />
            </svg>

            {/* Central Core Artifact using clan_core.png (Stationary Majestic Core) */}
            <div className="pentagon-center-core" title="Sacred Core">
              <img src="/Clans/clan_core.png" alt="Sacred DreamWorld Core" className="core-logo-img" />
            </div>

            {/* 5 Pentagon Vertex Clan Symbols */}
            {clans.slice(0, 5).map((clan, index) => {
              const pos = PENTAGON_VERTICES[index] || { x: 50, y: 50 }
              const isActive = activeSpotlightClan?.id === clan.id

              return (
                <div
                  key={clan.id}
                  className={`pentagon-node interactive clickable ${isActive ? 'active' : ''}`}
                  style={{
                    '--pos-x': `${pos.x}%`,
                    '--pos-y': `${pos.y}%`,
                    '--clan-color': clan.color,
                    '--node-index': index
                  }}
                  onClick={() => handleClanTap(clan)}
                  title={`Tap to reveal ${clan.name}`}
                >
                  <div className="node-avatar-frame">
                    {/* Glowing elemental aura smoke layer */}
                    <div className="node-aura-smoke" />
                    {/* Perfectly centered pulse ring inside avatar frame */}
                    <div className="node-pulse-ring" />
                    <img src={clan.logo} alt={clan.name} className="node-logo-img" />
                  </div>
                  <div className="node-info-badge">
                    <span className="node-name">{clan.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Clan Spotlight Modal / Overlay */}
        {activeSpotlightClan && (
          <div className="spotlight-overlay" onClick={() => setActiveSpotlightClan(null)}>
            <div 
              className="spotlight-card fade-in-scale" 
              onClick={(e) => e.stopPropagation()}
              style={{
                '--clan-color': activeSpotlightClan.color,
                borderColor: activeSpotlightClan.color
              }}
            >
              {/* Top Navigation & Close Bar */}
              <div className="spotlight-header">
                <div className="spotlight-nav-btn-group">
                  <button 
                    className="spotlight-nav-btn interactive clickable" 
                    onClick={() => navigateSpotlight('prev')}
                    title="Previous Clan"
                  >
                    ◀ Prev
                  </button>
                  <span className="spotlight-element-tag" style={{ background: `${activeSpotlightClan.color}25`, color: activeSpotlightClan.color, borderColor: activeSpotlightClan.color }}>
                    {activeSpotlightClan.icon} {activeSpotlightClan.element} Element
                  </span>
                  <button 
                    className="spotlight-nav-btn interactive clickable" 
                    onClick={() => navigateSpotlight('next')}
                    title="Next Clan"
                  >
                    Next ▶
                  </button>
                </div>
                <button 
                  className="spotlight-close-btn interactive clickable" 
                  onClick={() => setActiveSpotlightClan(null)}
                  title="Close details"
                >
                  ✕
                </button>
              </div>

              {/* Spotlight Body */}
              <div className="spotlight-body">
                {/* Visual enlarged emblem frame */}
                <div className="spotlight-emblem-container">
                  <div 
                    className="spotlight-emblem-frame interactive clickable"
                    onClick={(e) => openLightbox(activeSpotlightClan.logo, e)}
                    style={{
                      borderColor: activeSpotlightClan.color,
                      boxShadow: `0 0 45px ${activeSpotlightClan.color}50`
                    }}
                  >
                    <img 
                      src={activeSpotlightClan.logo} 
                      alt={activeSpotlightClan.name} 
                      className="spotlight-emblem-img pulse-enlarge" 
                    />
                    <span className="spotlight-zoom-hint">🔍 Tap image to expand</span>
                  </div>
                  <h2 className="spotlight-clan-title" style={{ textShadow: `0 0 20px ${activeSpotlightClan.color}60` }}>
                    {activeSpotlightClan.name}
                  </h2>
                  <p className="spotlight-motto" style={{ color: activeSpotlightClan.color }}>
                    "{activeSpotlightClan.motto}"
                  </p>
                </div>

                {/* Details Column */}
                <div className="spotlight-details">
                  {/* Story */}
                  <div className="spotlight-section-box">
                    <h3 className="spotlight-section-title">📜 Clan Essence & Lore</h3>
                    <p className="spotlight-narrative">{activeSpotlightClan.story}</p>
                  </div>

                  {/* Principles */}
                  <div className="spotlight-section-box">
                    <h3 className="spotlight-section-title">✨ Sacred Principles</h3>
                    <div className="spotlight-principles-grid">
                      {activeSpotlightClan.principles?.map((principle, idx) => (
                        <div 
                          key={idx} 
                          className="spotlight-principle-card"
                          style={{ borderColor: `${activeSpotlightClan.color}40` }}
                        >
                          <span className="principle-name" style={{ color: activeSpotlightClan.color }}>
                            {principle.title}
                          </span>
                          <span className="principle-text">{principle.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Who Belongs */}
                  <div 
                    className="spotlight-belonging-box" 
                    style={{ 
                      borderColor: `${activeSpotlightClan.color}50`, 
                      background: `${activeSpotlightClan.color}12` 
                    }}
                  >
                    <span className="belonging-emoji">{activeSpotlightClan.icon}</span>
                    <div>
                      <strong style={{ color: activeSpotlightClan.color }}>Who Belongs in {activeSpotlightClan.name}?</strong>
                      <p>{activeSpotlightClan.whoBelongs}</p>
                    </div>
                  </div>

                  {/* Champions */}
                  <div className="spotlight-champions-box">
                    <h3 className="spotlight-section-title">
                      👥 Appointed Dreamers ({characters.filter(c => c.clan === activeSpotlightClan.id).length})
                    </h3>
                    {characters.filter(c => c.clan === activeSpotlightClan.id).length === 0 ? (
                      <p className="no-champions-text">No Dreamers have been appointed to this Clan yet.</p>
                    ) : (
                      <div className="spotlight-champions-list">
                        {characters.filter(c => c.clan === activeSpotlightClan.id).map(member => (
                          <Link 
                            to={`/characters/${member.id}`} 
                            key={member.id} 
                            className="spotlight-champion-chip interactive clickable"
                            onClick={() => setActiveSpotlightClan(null)}
                          >
                            <Avatar src={member.avatar} name={member.name} className="spotlight-avatar" />
                            <span>{member.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clans
