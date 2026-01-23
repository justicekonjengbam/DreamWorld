import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import ImageModal from '../components/ImageModal'
import './CharacterDetail.css'

function CharacterDetail() {
  const { id } = useParams()
  const { characters, roles, loading } = useContent()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [imgError, setImgError] = useState(false)

  if (loading) return <div className="loading-state">Syncing Member Info...</div>

  const character = characters.find(c => String(c.id) === String(id))

  if (!character) {
    return (
      <div className="character-detail page">
        <div className="container">
          <h2>Character not found</h2>
          <p style={{ color: 'var(--color-gray)', marginBottom: '20px' }}>ID: {id}</p>
          <Link to="/characters"><Button>Back to Members</Button></Link>
        </div>
      </div>
    )
  }

  // Robustly find the avatar in case of hidden names
  const avatarUrl = character.avatar || character.avatar_url || character.photo || character.image
  const role = roles.find(r => r.id === character.role)

  const openLightbox = (src) => {
    setModalImage(src)
    setModalOpen(true)
  }

  return (
    <div className="character-detail page">
      <div className="container">
        <Link to="/characters" className="back-link">← Back to Members</Link>

        <div className="character-hero">
          <div
            className="character-avatar-large"
            onClick={() => avatarUrl && !imgError && openLightbox(avatarUrl)}
          >
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={character.name}
                className="avatar-img-actual"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="avatar-initial-fallback">
                {character.name ? character.name.charAt(0) : '?'}
              </span>
            )}
          </div>
          <div className="character-header">
            <h1>{character.name}</h1>
            <p className="character-role-large">{character.title}</p>
            {role && (
              <Link to={`/roles/${role.id}`} className="role-badge">
                {role.singular}
              </Link>
            )}
            <div className="character-themes-large">
              {character.themes && character.themes.map((theme, index) => (
                <Badge key={index}>{theme}</Badge>
              ))}
            </div>
          </div>
        </div>

        <ImageModal
          src={modalImage}
          alt={character.name}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="character-content">
          <Card hover={false}>
            <h2>About {character.name}</h2>
            <p className="character-full-bio">{character.bio}</p>
            <div className="character-meta" style={{ marginTop: '20px', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
              <p><strong>Joined:</strong> {character.joineddate || character.joinedDate || 'Dreamer Since Launch'}</p>
            </div>
          </Card>

          {role && (
            <Card hover={false}>
              <h3>Path: {role.singular}</h3>
              <p>{role.description}</p>
              <Link to={`/roles/${role.id}`} className="view-role-link">
                Learn more about {role.name} →
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default CharacterDetail
