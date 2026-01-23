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
          height: '400px',
          width: '100%',
          position: 'relative',
          cursor: character.coverImage ? 'zoom-in' : 'default',
          borderBottom: '1px solid rgba(76, 161, 175, 0.3)'
        }}
        onClick={() => character.coverImage && openLightbox(character.coverImage)}
      >
        <div className="cover-overlay"></div>
        <div className="container" style={{ position: 'relative', height: '100%' }}>
          <Link to="/characters" className="back-link-overlay">← Back to Members</Link>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
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

              {/* Social Links Bar */}
              <div className="profile-social-bar">
                {character.socials?.youtube && (
                  <a href={character.socials.youtube} target="_blank" rel="noreferrer" className="social-icon youtube" title="YouTube">
                    <span className="icon">▶</span>
                  </a>
                )}
                {character.socials?.instagram && (
                  <a href={character.socials.instagram} target="_blank" rel="noreferrer" className="social-icon instagram" title="Instagram">
                    <span className="icon">📸</span>
                  </a>
                )}
                {character.socials?.facebook && (
                  <a href={character.socials.facebook} target="_blank" rel="noreferrer" className="social-icon facebook" title="Facebook">
                    <span className="icon">f</span>
                  </a>
                )}
                {character.socials?.twitter && (
                  <a href={character.socials.twitter} target="_blank" rel="noreferrer" className="social-icon twitter" title="Twitter">
                    <span className="icon">𝕏</span>
                  </a>
                )}
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
            <Card hover={false} className="about-member-card">
              <h2>About {character.name}</h2>
              <p className="character-full-bio">{character.bio}</p>
              <div className="character-meta">
                <p><strong>Member Since:</strong> {character.joineddate || character.joinedDate || 'Dreamer Since Launch'}</p>
              </div>
            </Card>

            {role && (
              <Card hover={false} className="path-member-card">
                <h3>Path: {role.singular}</h3>
                <p>{role.description}</p>
                <Link to={`/roles/${role.id}`} className="view-role-link">
                  Learn more about the {role.name} path →
                </Link>
              </Card>
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
