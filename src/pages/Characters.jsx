import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import ImageModal from '../components/ImageModal'
import Avatar from '../components/Avatar'
import './Characters.css'

import { Link } from 'react-router-dom'

function Characters() {
  const { characters, loading } = useContent()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  if (loading) return <div className="loading-state">Syncing Members with DreamWorld...</div>

  const openLightbox = (src) => {
    setModalImage(src)
    setModalOpen(true)
  }

  return (
    <div className="characters page">
      <div className="container">
        <div className="characters-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="characters-logo" />
        </div>

        <SectionHeader
          title="Community Members"
          subtitle="Meet the people building DreamWorld together"
        />

        <div className="view-roles-banner">
          <Card hover={false}>
            <p>Want to understand the different paths in DreamWorld?</p>
            <Link to="/roles" className="roles-banner-link">
              Explore Character Roles & Traits →
            </Link>
          </Card>
        </div>

        <ImageModal
          src={modalImage}
          alt="Member Photo"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="characters-grid">
          {characters.map((character) => (
            <Link to={`/characters/${character.id}`} key={character.id} className="character-link">
              <Card>
                <div
                  className="character-cover-section"
                  style={{
                    backgroundImage: character.coverImage ? `url("${character.coverImage}")` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    cursor: character.coverImage ? 'zoom-in' : 'default'
                  }}
                  onClick={(e) => {
                    if (character.coverImage) {
                      e.preventDefault();
                      openLightbox(character.coverImage);
                    }
                  }}
                >
                  <div className="character-photo-wrapper">
                    <Avatar
                      src={character.avatar}
                      name={character.name}
                      className="character-photo"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLightbox(character.avatar);
                      }}
                    />
                  </div>
                  <div className="character-level-badge" title={`Dream Level: ${character.level || 0}`}>
                    <span className="level-label">DREAM LVL</span>
                    <span className="level-value">{character.level || 0}</span>
                  </div>
                </div>
                <h3>{character.name}</h3>
                <p className="character-role-title">{character.title}</p>
                <p className="character-bio">
                  {character.bio && character.bio.length > 120
                    ? character.bio.substring(0, 120) + '...'
                    : character.bio}
                </p>
                <div className="character-themes">
                  {character.themes.map((theme, index) => (
                    <Badge key={index}>{theme}</Badge>
                  ))}
                </div>
                <div className="character-cta">View profile →</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Characters
