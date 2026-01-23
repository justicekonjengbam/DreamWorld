import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import ImageModal from '../components/ImageModal'
import Avatar from '../components/Avatar'
import './CharacterDetail.css'

function CharacterDetail() {
  const { id } = useParams()
  const { characters, roles, loading } = useContent()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  if (loading) return <div className="loading-state">Syncing Member Info...</div>

  const character = characters.find(c => String(c.id) === String(id))

  if (!character) {
    return (
      <div className="character-detail page">
        <div className="container">
          <h2>Character not found</h2>
          <Link to="/characters"><Button>Back to Members</Button></Link>
        </div>
      </div>
    )
  }

  const role = roles.find(r => r.id === character.role)

  const openLightbox = (src) => {
    if (!src) return
    setModalImage(src)
    setModalOpen(true)
  }

  return (
    <div className="character-detail page" style={{ padding: 0 }}>
      {/* Immersive Cover Hero */}
      <div
        className="character-full-cover"
        style={{
          backgroundImage: character.coverImage ? `url("${character.coverImage}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          cursor: character.coverImage ? 'zoom-in' : 'default'
        }}
        onClick={() => character.coverImage && openLightbox(character.coverImage)}
      >
        <div className="cover-overlay"></div>
        <div className="container" style={{ position: 'relative', height: '100%' }}>
          <Link to="/characters" className="back-link-overlay">← Back to Members</Link>
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="character-hero">
          <Avatar
            src={character.avatar}
            name={character.name}
            className="character-avatar-large"
            style={{
              cursor: character.avatar ? 'zoom-in' : 'default',
              border: '8px solid var(--color-background)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
              width: '240px',
              height: '240px'
            }}
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(character.avatar);
            }}
          />
          <div className="character-header-info">
            <h1>{character.name}</h1>
            <p className="character-role-large">{character.title}</p>
            <div className="character-tags-socials">
              <div className="character-themes-large">
                {role && (
                  <Link to={`/roles/${role.id}`} className="role-badge-small">
                    {role.singular}
                  </Link>
                )}
                {character.themes && character.themes.map((theme, index) => (
                  <Badge key={index}>{theme}</Badge>
                ))}
              </div>

              {/* Social Links Bar - Always Visible */}
              <div className="profile-social-bar">
                <a href={character.socials?.youtube || '#'} target="_blank" rel="noreferrer" className={`social-icon youtube ${!character.socials?.youtube ? 'unlinked' : ''}`} title="YouTube">
                  <span className="icon">▶</span>
                </a>
                <a href={character.socials?.instagram || '#'} target="_blank" rel="noreferrer" className={`social-icon instagram ${!character.socials?.instagram ? 'unlinked' : ''}`} title="Instagram">
                  <span className="icon">📸</span>
                </a>
                <a href={character.socials?.facebook || '#'} target="_blank" rel="noreferrer" className={`social-icon facebook ${!character.socials?.facebook ? 'unlinked' : ''}`} title="Facebook">
                  <span className="icon">f</span>
                </a>
                <a href={character.socials?.twitter || '#'} target="_blank" rel="noreferrer" className={`social-icon twitter ${!character.socials?.twitter ? 'unlinked' : ''}`} title="Twitter">
                  <span className="icon">𝕏</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <ImageModal
          src={modalImage}
          alt={character.name}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="character-content-grid">
          <div className="character-main-content">
            <div className="about-member-section">
              <p className="character-full-bio">{character.bio}</p>
              <div className="character-meta">
                <p>{character.joineddate || character.joinedDate}</p>
              </div>
            </div>

            {role && (
              <div className="path-member-section">
                <p>{role.description}</p>
              </div>
            )}
          </div>

          <div className="character-sidebar">
            {/* Future sidebar content like achievements or recent quests could go here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetail
