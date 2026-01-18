import { useParams, Link } from 'react-router-dom'
import { characters, getRoleById } from '../data/characters'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import './CharacterDetail.css'

function CharacterDetail() {
  const { id } = useParams()
  const character = characters.find(c => c.id === id)

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

  const role = getRoleById(character.role)

  return (
    <div className="character-detail page">
      <div className="container">
        <Link to="/characters" className="back-link">← Back to Members</Link>

        <div className="character-hero">
          <img 
            src={character.avatar} 
            alt={character.name} 
            className="character-avatar-large"
          />
          <div className="character-header">
            <h1>{character.name}</h1>
            <p className="character-role-large">{character.title}</p>
            {role && (
              <Link to={`/roles/${role.id}`} className="role-badge">
                {role.singular}
              </Link>
            )}
            <div className="character-themes-large">
              {character.themes.map((theme, index) => (
                <Badge key={index}>{theme}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="character-content">
          <Card hover={false}>
            <h2>About {character.name}</h2>
            <p className="character-full-bio">{character.bio}</p>
            <div className="character-meta">
              <p><strong>Joined:</strong> {new Date(character.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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

          <Card hover={false}>
            <h3>Connect</h3>
            <div className="social-links">
              {Object.entries(character.socials).map(([platform, url]) => (
                <a key={platform} href={url} className="social-link" target="_blank" rel="noopener noreferrer">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CharacterDetail
