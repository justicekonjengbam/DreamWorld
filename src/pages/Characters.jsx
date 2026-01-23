import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import './Characters.css'

import { Link } from 'react-router-dom'

function Characters() {
  const { characters, loading } = useContent()

  if (loading) return <div className="loading-state">Syncing Members with DreamWorld...</div>
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

        <div className="characters-grid">
          {characters.map((character) => (
            <Link to={`/characters/${character.id}`} key={character.id} className="character-link">
              <Card>
                <div
                  className="character-cover-section"
                  style={{
                    backgroundImage: character.coverImage ? `url(${character.coverImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                    borderRadius: '8px 8px 0 0',
                    position: 'relative'
                  }}
                >
                  <div className="character-photo-wrapper">
                    <img src={character.avatar} alt={character.name} className="character-photo" />
                  </div>
                </div>
                <h3>{character.name}</h3>
                <p className="character-role-title">{character.title}</p>
                <p className="character-bio">{character.bio}</p>
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
