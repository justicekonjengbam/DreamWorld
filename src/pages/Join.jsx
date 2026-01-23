import { useState, useEffect } from 'react'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import './Join.css'

function Join() {
  const { submitDreamerApplication, roles } = useContent()

  // Dreamer Form State
  const [dreamerForm, setDreamerForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    role: '',
    otherRole: '',
    reason: '',
    roleReason: ''
  })
  const [dreamerErrors, setDreamerErrors] = useState({})
  const [dreamerSubmitted, setDreamerSubmitted] = useState(false)

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

    if (!dreamerForm.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!dreamerForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dreamerForm.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!dreamerForm.age) {
      errors.age = 'Age is required'
    }

    if (!dreamerForm.gender) {
      errors.gender = 'Gender is required'
    }

    if (!dreamerForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!dreamerForm.role && !dreamerForm.otherRole.trim()) {
      errors.role = 'Please select a role or propose a new one'
    }

    if (!dreamerForm.reason.trim()) {
      errors.reason = 'Please tell us why you want to join'
    }

    if (!dreamerForm.roleReason.trim() && !dreamerForm.otherRole.trim()) {
      errors.roleReason = 'Please tell us why you chose this role'
    }

    return errors
  }

  const handleDreamerSubmit = async (e) => {
    e.preventDefault()

    // Spam Protection: check local storage
    const lastSubmission = localStorage.getItem('dreamworld_last_submission')
    if (lastSubmission) {
      const timeSince = Date.now() - parseInt(lastSubmission)
      const COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours
      if (timeSince < COOLDOWN) {
        alert("🛑 The Council requires patience. You have already sent a petition recently. Please wait for the decree.")
        return
      }
    }

    const errors = validateDreamerForm()

    if (Object.keys(errors).length > 0) {
      setDreamerErrors(errors)
      return
    }

    try {
      await submitDreamerApplication(dreamerForm)

      // Set Spam Protection Timestamp
      localStorage.setItem('dreamworld_last_submission', Date.now().toString())

      setDreamerSubmitted(true)

      setTimeout(() => {
        setDreamerForm({ name: '', email: '', phone: '', age: '', gender: '', role: '', otherRole: '', reason: '', roleReason: '' })
        setDreamerSubmitted(false)
      }, 6000)
    } catch (error) {
      alert("Failed to submit application: " + error.message)
    }
  }

  return (
    <div className="join page">
      <div className="container">
        <SectionHeader
          title="Join DreamWorld"
          subtitle="Start your journey with us. Choose your path below."
        />

        {/* DREAMER REGISTRATION */}
        <div className="join-section">
          <h2 className="section-title">⭐ Become a Dreamer</h2>
          <p className="section-description">
            Choose your role and become a Dreamer with a character in DreamWorld.
          </p>

          <div className="join-content">
            <Card className="join-form-card">
              {!dreamerSubmitted ? (
                <form onSubmit={handleDreamerSubmit} className="join-form">
                  <div className="form-group">
                    <label htmlFor="dreamer-name">Full Name *</label>
                    <input
                      type="text"
                      id="dreamer-name"
                      name="name"
                      value={dreamerForm.name}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {dreamerErrors.name && <span className="error-message">{dreamerErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-email">Email Address *</label>
                    <input
                      type="email"
                      id="dreamer-email"
                      name="email"
                      value={dreamerForm.email}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.email ? 'error' : ''}
                      placeholder="your.email@example.com"
                    />
                    {dreamerErrors.email && <span className="error-message">{dreamerErrors.email}</span>}
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                      <label htmlFor="dreamer-age">Age *</label>
                      <input
                        type="number"
                        id="dreamer-age"
                        name="age"
                        value={dreamerForm.age}
                        onChange={handleDreamerChange}
                        className={dreamerErrors.age ? 'error' : ''}
                        placeholder="Age"
                      />
                      {dreamerErrors.age && <span className="error-message">{dreamerErrors.age}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="dreamer-gender">Gender *</label>
                      <select
                        id="dreamer-gender"
                        name="gender"
                        value={dreamerForm.gender}
                        onChange={handleDreamerChange}
                        className={dreamerErrors.gender ? 'error' : ''}
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {dreamerErrors.gender && <span className="error-message">{dreamerErrors.gender}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="dreamer-phone"
                      name="phone"
                      value={dreamerForm.phone}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.phone ? 'error' : ''}
                      placeholder="+91 1234567890"
                    />
                    {dreamerErrors.phone && <span className="error-message">{dreamerErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-role">Choose Your Role (Optional if suggesting new)</label>
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

                  <div className="form-group">
                    <label htmlFor="dreamer-reason">Why do you want to become a Dreamer? *</label>
                    <textarea
                      id="dreamer-reason"
                      name="reason"
                      value={dreamerForm.reason}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.reason ? 'error' : ''}
                      placeholder="Share your motivation..."
                      rows="3"
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(26, 31, 53, 0.8)',
                        border: '1px solid rgba(76, 161, 175, 0.3)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    {dreamerErrors.reason && <span className="error-message">{dreamerErrors.reason}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-roleReason">Why did you choose this role? (Required if selected)</label>
                    <textarea
                      id="dreamer-roleReason"
                      name="roleReason"
                      value={dreamerForm.roleReason}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.roleReason ? 'error' : ''}
                      placeholder="What draws you to this specific path?"
                      rows="3"
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(26, 31, 53, 0.8)',
                        border: '1px solid rgba(76, 161, 175, 0.3)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    {dreamerErrors.roleReason && <span className="error-message">{dreamerErrors.roleReason}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="dreamer-otherRole">Have another role in mind? (Optional)</label>
                    <input
                      type="text"
                      id="dreamer-otherRole"
                      name="otherRole"
                      value={dreamerForm.otherRole}
                      onChange={handleDreamerChange}
                      placeholder="If you have an idea for a role not listed..."
                    />
                  </div>

                  <Button type="submit" variant="primary">
                    Become a Dreamer
                  </Button>
                </form>
              ) : (
                <div className="success-message">
                  <div className="success-icon">📜</div>
                  <h3>Application Submitted</h3>
                  <p>Your petition to join as a <strong>{roles && roles.find(r => r.id === dreamerForm.role)?.singular || 'Dreamer'}</strong> has been inscribed in the Archives.</p>
                  <p>The Council shall review your request with great care.</p>
                  <p className="success-note">
                    Await a formal decree via Email or WhatsApp regarding your acceptance into the DreamWorld.
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
