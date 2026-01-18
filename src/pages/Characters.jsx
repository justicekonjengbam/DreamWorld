import { Link } from 'react-router-dom'
import { characters } from '../data/characters'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Badge from '../components/Badge'
import './Characters.css'


function Characters() {
  return (
    <div className="characters page">
      <div className="container">
        {/* Logo at top like homepage */}
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
                <div className="character-photo-wrapper">
                  <img src={character.avatar} alt={character.name} className="character-photo" />
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
