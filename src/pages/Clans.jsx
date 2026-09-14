import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Avatar from '../components/Avatar'
import ImageModal from '../components/ImageModal'
import './Clans.css'

function Clans() {
  const { clans, characters, loading } = useContent()
  const [selectedClanId, setSelectedClanId] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  if (loading) return <div className="loading-state">Syncing Sacred Clans with DreamWorld...</div>

  const openLightbox = (src) => {
    if (!src) return
    setModalImage(src)
    setModalOpen(true)
  }

  const displayedClans = selectedClanId === 'all' 
    ? clans 
    : clans.filter(c => c.id === selectedClanId)

  return (
    <div className="clans-page page">
      <div className="container">
        {/* Header Hero */}
        <div className="clans-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="clans-logo" />
          <h1 className="clans-title-main">The Five Sacred Clans</h1>
          <p className="clans-subtitle-main">
            Every Dreamer carries an elemental spark. Discover the five ancient pillars that shape our realm, guide our mission, and unite our community.
          </p>
        </div>

        <ImageModal
          src={modalImage}
          alt="Clan Emblem"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Filter Navigation Tabs */}
        <div className="clan-nav-tabs">
          <button
            className={`clan-nav-btn ${selectedClanId === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedClanId('all')}
          >
            🌟 All Clans
          </button>
          {clans.map(clan => (
            <button
              key={clan.id}
              className={`clan-nav-btn ${selectedClanId === clan.id ? 'active' : ''}`}
              style={{
                '--clan-color': clan.color,
                borderColor: selectedClanId === clan.id ? clan.color : 'rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => setSelectedClanId(clan.id)}
            >
              {clan.icon} {clan.name}
            </button>
          ))}
        </div>

        {/* Clans Symmetrical Story Showcase */}
        <div className="clans-story-list">
          {displayedClans.map(clan => {
            const membersInClan = characters.filter(c => c.clan === clan.id)

            return (
              <article 
                key={clan.id} 
                className="clan-story-card"
                style={{ '--clan-color': clan.color, borderColor: `${clan.color}40` }}
              >
                {/* Visual Emblem Column */}
                <div className="clan-card-visual">
                  <div 
                    className="clan-emblem-frame"
                    onClick={() => openLightbox(clan.logo)}
                    title="Click to expand emblem"
                    style={{ borderColor: clan.color, boxShadow: `0 0 30px ${clan.color}35` }}
                  >
                    <img src={clan.logo} alt={clan.name} className="clan-emblem-img" />
                    <span className="emblem-zoom-tag">🔍 Click to Expand</span>
                  </div>

                  <div className="clan-meta-info">
                    <span className="clan-element-tag" style={{ background: `${clan.color}20`, color: clan.color, borderColor: `${clan.color}50` }}>
                      {clan.icon} {clan.element} Element
                    </span>
                    <h2 className="clan-name-heading" style={{ textShadow: `0 0 15px ${clan.color}44` }}>{clan.name}</h2>
                    <p className="clan-motto-text" style={{ color: clan.color }}>"{clan.motto}"</p>
                  </div>
                </div>

                {/* Story & Content Column */}
                <div className="clan-card-content">
                  {/* Story Narrative */}
                  <div className="clan-narrative-box">
                    <h3 className="section-label">📜 Clan Story & Essence</h3>
                    <p className="narrative-text">{clan.story}</p>
                  </div>

                  {/* Core Principles */}
                  <div className="clan-principles-box">
                    <h3 className="section-label">✨ Sacred Principles</h3>
                    <div className="principles-grid">
                      {clan.principles?.map((p, pIdx) => (
                        <div key={pIdx} className="principle-item" style={{ borderColor: `${clan.color}30` }}>
                          <span className="principle-title" style={{ color: clan.color }}>{p.title}</span>
                          <span className="principle-desc">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Who Belongs Here */}
                  <div className="clan-belonging-box" style={{ borderColor: `${clan.color}35`, background: `${clan.color}0D` }}>
                    <span className="belonging-icon">{clan.icon}</span>
                    <div>
                      <strong style={{ color: clan.color }}>Who Belongs in {clan.name}?</strong>
                      <p>{clan.whoBelongs}</p>
                    </div>
                  </div>

                  {/* Appointed Champions Roster */}
                  <div className="clan-champions-box">
                    <h3 className="section-label">👥 Appointed Dreamers ({membersInClan.length})</h3>
                    {membersInClan.length === 0 ? (
                      <p className="empty-champions-msg">No Dreamers have been appointed to this Clan yet.</p>
                    ) : (
                      <div className="champions-chips-list">
                        {membersInClan.map(member => (
                          <Link to={`/characters/${member.id}`} key={member.id} className="champion-chip">
                            <Avatar src={member.avatar} name={member.name} className="champion-avatar" />
                            <span className="champion-name">{member.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Clans


