import { useState, useEffect } from 'react'
import { roles } from '../data/characters'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import './Join.css'

function Join() {
  // Member Form State
  const [memberForm, setMemberForm] = useState({
    name: '',
    age: '',
    phone: '',
    email: ''
  })
  const [memberErrors, setMemberErrors] = useState({})
  const [memberSubmitted, setMemberSubmitted] = useState(false)
  const [generatedMemberID, setGeneratedMemberID] = useState('')

  // Dreamer Form State
  const [dreamerForm, setDreamerForm] = useState({
    memberID: '',
    role: ''
  })
  const [dreamerErrors, setDreamerErrors] = useState({})
  const [dreamerSubmitted, setDreamerSubmitted] = useState(false)

  // Generate Member ID from name
  const generateMemberID = (name) => {
    const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '')
    let sum = 0
    
    for (let char of cleanName) {
      sum += char.charCodeAt(0) - 64 // A=1, B=2, etc.
    }
    
    return 10000000000 + sum
  }

  // Member Form Handlers
  const handleMemberChange = (e) => {
    const { name, value } = e.target
    setMemberForm(prev => ({
      ...prev,
      [name]: value
    }))

    if (memberErrors[name]) {
      setMemberErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateMemberForm = () => {
    const errors = {}

    if (!memberForm.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!memberForm.age) {
      errors.age = 'Age is required'
    } else if (memberForm.age < 1 || memberForm.age > 120) {
      errors.age = 'Please enter a valid age'
    }

    if (!memberForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{10,}$/.test(memberForm.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!memberForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) {
      errors.email = 'Please enter a valid email'
    }

    return errors
  }

  const handleMemberSubmit = (e) => {
    e.preventDefault()
    const errors = validateMemberForm()

    if (Object.keys(errors).length > 0) {
      setMemberErrors(errors)
      return
    }

    // Generate Member ID
    const memberID = generateMemberID(memberForm.name)
    setGeneratedMemberID(memberID)

    // Save to localStorage
    const members = JSON.parse(localStorage.getItem('dreamworld_members') || '[]')
    const newMember = {
      ...memberForm,
      memberID: memberID,
      joinDate: new Date().toISOString().split('T')[0]
    }
    members.push(newMember)
    localStorage.setItem('dreamworld_members', JSON.stringify(members))

    setMemberSubmitted(true)

    setTimeout(() => {
      setMemberForm({ name: '', age: '', phone: '', email: '' })
      setMemberSubmitted(false)
      setGeneratedMemberID('')
    }, 8000)
  }

  // Dreamer Form Handlers
  const handleDreamerChange = (e) => {
    const { name, value } = e.target
    setDreamerForm(prev => ({
      ...prev,
      [name]: value
    }))

    if (dreamerErrors[name]) {
      setDreamerErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateDreamerForm = () => {
    const errors = {}

    if (!dreamerForm.memberID.trim()) {
      errors.memberID = 'Member ID is required'
    } else {
      // Check if Member ID exists in localStorage
      const members = JSON.parse(localStorage.getItem('dreamworld_members') || '[]')
      const memberExists = members.find(m => m.memberID.toString() === dreamerForm.memberID.trim())
      
      if (!memberExists) {
        errors.memberID = 'Member ID not found. Please register as a member first.'
      }
    }

    if (!dreamerForm.role) {
      errors.role = 'Please select a role'
    }

    return errors
  }

  const handleDreamerSubmit = (e) => {
    e.preventDefault()
    const errors = validateDreamerForm()

    if (Object.keys(errors).length > 0) {
      setDreamerErrors(errors)
      return
    }

    // Save to localStorage
    const dreamers = JSON.parse(localStorage.getItem('dreamworld_dreamers') || '[]')
    const newDreamer = {
      ...dreamerForm,
      approvedDate: new Date().toISOString().split('T')[0]
    }
    dreamers.push(newDreamer)
    localStorage.setItem('dreamworld_dreamers', JSON.stringify(dreamers))

    setDreamerSubmitted(true)

    setTimeout(() => {
      setDreamerForm({ memberID: '', role: '' })
      setDreamerSubmitted(false)
    }, 6000)
  }

  return (
    <div className="join page">
      <div className="container">
        <SectionHeader 
          title="Join DreamWorld"
          subtitle="Start your journey with us. Choose your path below."
        />

        {/* MEMBER REGISTRATION */}
        <div className="join-section">
          <h2 className="section-title">👤 Become a Member</h2>
          <p className="section-description">
            Join the DreamWorld community. All members receive a unique Member ID.
          </p>

          <div className="join-content">
            <Card className="join-form-card">
              {!memberSubmitted ? (
                <form onSubmit={handleMemberSubmit} className="join-form">
                  <div className="form-group">
                    <label htmlFor="member-name">Full Name *</label>
                    <input
                      type="text"
                      id="member-name"
                      name="name"
                      value={memberForm.name}
                      onChange={handleMemberChange}
                      className={memberErrors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {memberErrors.name && <span className="error-message">{memberErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="member-age">Age *</label>
                    <input
                      type="number"
                      id="member-age"
                      name="age"
                      value={memberForm.age}
                      onChange={handleMemberChange}
                      className={memberErrors.age ? 'error' : ''}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                    {memberErrors.age && <span className="error-message">{memberErrors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="member-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="member-phone"
                      name="phone"
                      value={memberForm.phone}
                      onChange={handleMemberChange}
                      className={memberErrors.phone ? 'error' : ''}
                      placeholder="+91 1234567890"
                    />
                    {memberErrors.phone && <span className="error-message">{memberErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="member-email">Email Address *</label>
                    <input
                      type="email"
                      id="member-email"
                      name="email"
                      value={memberForm.email}
                      onChange={handleMemberChange}
                      className={memberErrors.email ? 'error' : ''}
                      placeholder="your.email@example.com"
                    />
                    {memberErrors.email && <span className="error-message">{memberErrors.email}</span>}
                  </div>

                  <Button type="submit" variant="primary">
                    Register as Member
                  </Button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✨</div>
                  <h3>Welcome, {memberForm.name}!</h3>
                  <p>You are now a member of DreamWorld.</p>
                  <div className="member-id-display">
                    <p className="id-label">Your Member ID:</p>
                    <p className="id-value">{generatedMemberID}</p>
                  </div>
                  <p className="success-note">
                    <strong>⚠️ Save this ID!</strong> You'll need it to become a Dreamer.
                  </p>
                </div>
              )}
            </Card>

            <Card className="guidelines-card">
              <h3>What is a Member?</h3>
              
              <div className="guideline">
                <h4>🌟 Community Access</h4>
                <p>Join our learning community and connect with fellow dreamers.</p>
              </div>

              <div className="guideline">
                <h4>📚 Learn Together</h4>
                <p>Access resources, participate in discussions, and grow with us.</p>
              </div>

              <div className="guideline">
                <h4>🎯 Complete Quests</h4>
                <p>Take on weekly quests and make positive impact in the world.</p>
              </div>

              <div className="guideline">
                <h4>💎 Unique ID</h4>
                <p>Get your unique Member ID to track your journey and become a Dreamer.</p>
              </div>
            </Card>
          </div>
        </div>

        {/* DREAMER REGISTRATION */}
        <div className="join-section">
          <h2 className="section-title">⭐ Become a Dreamer</h2>
          <p className="section-description">
            Already a member? Choose your role and become a Dreamer with a character in DreamWorld.
          </p>

          <div className="join-content">
            <Card className="join-form-card">
              {!dreamerSubmitted ? (
                <form onSubmit={handleDreamerSubmit} className="join-form">
                  <div className="form-group">
                    <label htmlFor="dreamer-memberID">Your Member ID *</label>
                    <input
                      type="text"
                      id="dreamer-memberID"
                      name="memberID"
                      value={dreamerForm.memberID}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.memberID ? 'error' : ''}
                      placeholder="Enter your Member ID (e.g., 10000000087)"
                    />
                    {dreamerErrors.memberID && <span className="error-message">{dreamerErrors.memberID}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-role">Choose Your Role *</label>
                    <select
                      id="dreamer-role"
                      name="role"
                      value={dreamerForm.role}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.role ? 'error' : ''}
                    >
                      <option value="">Select a role...</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.singular} - {role.description.substring(0, 50)}...
                        </option>
                      ))}
                    </select>
                    {dreamerErrors.role && <span className="error-message">{dreamerErrors.role}</span>}
                  </div>

                  <Button type="submit" variant="primary">
                    Become a Dreamer
                  </Button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">🌟</div>
                  <h3>You're now a Dreamer!</h3>
                  <p>Your role as <strong>{roles.find(r => r.id === dreamerForm.role)?.singular}</strong> has been registered.</p>
                  <p className="success-note">
                    Start exploring your character and begin creating content for DreamWorld!
                  </p>
                </div>
              )}
            </Card>

            <Card className="guidelines-card">
              <h3>What is a Dreamer?</h3>
              
              <div className="guideline">
                <h4>🎭 Character Role</h4>
                <p>Represent your chosen role and contribute unique content to DreamWorld.</p>
              </div>

              <div className="guideline">
                <h4>📱 Social Media</h4>
                <p>Manage character accounts and share your journey with the community.</p>
              </div>

              <div className="guideline">
                <h4>🌍 Lead Quests</h4>
                <p>Design and guide quests related to your role's expertise.</p>
              </div>

              <div className="guideline">
                <h4>✨ Build the Dream</h4>
                <p>Help shape the DreamWorld universe through your unique perspective.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Join
