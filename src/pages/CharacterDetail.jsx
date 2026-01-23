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
      {/* Cover Image Hero */}
      <div
        className="character-full-cover"
        style={{
          backgroundImage: character.coverImage ? `url("${character.coverImage}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '350px',
          width: '100%',
          position: 'relative',
          cursor: character.coverImage ? 'zoom-in' : 'default',
          borderBottom: '1px solid rgba(76, 161, 175, 0.3)'
        }}
        onClick={() => character.coverImage && openLightbox(character.coverImage)}
      >
        <div className="cover-overlay"></div>
      </div>

      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 2 }}>
        <Link to="/characters" className="back-link" style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>← Back to Members</Link>

        <div className="character-hero" style={{ alignItems: 'flex-end' }}>
          <Avatar
            src={character.avatar}
            name={character.name}
            className="character-avatar-large"
            style={{
              cursor: character.avatar ? 'zoom-in' : 'default',
              border: '6px solid var(--color-background)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(character.avatar);
            }}
          />
          <div className="character-header" style={{ paddingBottom: '20px' }}>
            <h1 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{character.name}</h1>
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
