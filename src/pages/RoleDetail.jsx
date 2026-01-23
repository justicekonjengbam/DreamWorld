import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import ImageModal from '../components/ImageModal'
import Avatar from '../components/Avatar'
import './RoleDetail.css'

function RoleDetail() {
  const { id } = useParams()
  const { roles, characters, loading } = useContent()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState('')

  if (loading) return <div className="loading-state">Syncing Role Path...</div>

  const role = roles.find(r => r.id === id)
  const members = characters.filter(c => c.role === id)

  const openLightbox = (src) => {
    if (!src) return
    setModalImage(src)
    setModalOpen(true)
  }

  if (!role) {
    return (
      <div className="role-detail page">
        <div className="container">
          <h2>Role not found</h2>
          <Link to="/roles"><Button>Back to Roles</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="role-detail page">
      <div className="container">
        <Link to="/roles" className="back-link">← Back to Roles</Link>

        <div className="role-hero">
          <Avatar
            src={role.image}
            name={role.singular}
            className="role-icon-large"
            style={{
              background: role.color,
              cursor: role.image ? 'zoom-in' : 'default'
            }}
            onClick={() => openLightbox(role.image)}
          />
          <div className="role-header">
            <h1>{role.name}</h1>
            <p className="role-description-large">{role.description}</p>
          </div>
        </div>

        <ImageModal
          src={modalImage}
          alt={role.singular}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="role-content">
          <Card hover={false}>
            <h2>Philosophy</h2>
            <p className="role-philosophy">{role.philosophy}</p>
          </Card>

          <Card hover={false}>
            <h2>Core Traits & Skills</h2>
            <div className="traits-grid">
              {role.traits.map((trait, index) => (
                <div key={index} className="trait-item">
                  <span className="trait-icon">✦</span>
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </Card>

          <SectionHeader
            title={`Meet Our ${role.name}`}
            subtitle={`${members.length} member${members.length !== 1 ? 's' : ''} contributing to this path`}
          />

          <div className="members-grid">
            {members.map((member) => (
              <Link to={`/characters/${member.id}`} key={member.id} className="member-link">
                <Card>
                  <Avatar
                    src={member.avatar}
                    name={member.name}
                    className="member-photo"
                    onClick={(e) => {
                      e.preventDefault();
                      openLightbox(member.avatar);
                    }}
                  />
                  <h3>{member.name}</h3>
                  <p className="member-title">{member.title}</p>
                  <p className="member-bio">{member.bio}</p>
                  <div className="member-cta">View profile →</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleDetail
