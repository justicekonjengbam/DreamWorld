import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import ImageModal from '../components/ImageModal'
import './Roles.css'


function Roles() {
  const { roles, loading } = useContent()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  if (loading) return <div className="loading-state">Syncing Roles with DreamWorld...</div>

  const openLightbox = (src) => {
    setModalImage(src)
    setModalOpen(true)
  }

  return (
    <div className="roles page">
      <div className="container">
        {/* Logo at top */}
        <div className="roles-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="roles-logo" />
        </div>

        <SectionHeader
          title="Character Roles"
          subtitle="Discover the different paths and philosophies in DreamWorld"
        />

        <ImageModal
          src={modalImage}
          alt="Role Icon"
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="roles-grid">
          {roles.map((role) => (
            <Link to={`/roles/${role.id}`} key={role.id} className="role-link" onClick={() => { }}>
              <Card>
                <div
                  className="role-icon"
                  style={{
                    background: role.color,
                    cursor: role.image ? 'zoom-in' : 'default'
                  }}
                  onClick={(e) => {
                    if (role.image) {
                      e.preventDefault();
                      e.stopPropagation();
                      openLightbox(role.image);
                    }
                  }}
                >
                  {role.image ? (
                    <img src={role.image} alt={role.singular} className="role-image" />
                  ) : (
                    <span className="role-initial">{role.singular.charAt(0)}</span>
                  )}
                </div>
                <h3>{role.name}</h3>
                <p className="role-description">{role.description}</p>
                <div className="role-traits">
                  <h4>Core Traits</h4>
                  <ul>
                    {role.traits.slice(0, 3).map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>
                <div className="role-cta">Explore this role →</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


export default Roles
