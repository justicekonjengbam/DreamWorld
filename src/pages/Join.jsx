import { useState, useEffect } from 'react'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import './Join.css'

function Join() {
  const { submitDreamerApplication, roles, appSettings } = useContent()

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
    roleReason: '',
    website_hp: '', // Honeypot field (bots fill this, humans don't)
    captchaInput: ''
  })

  // Dynamic Math Verification Challenge
  const [mathPuzzle, setMathPuzzle] = useState({ a: 7, b: 5 })

  useEffect(() => {
    // Generate random math challenge on mount
    const numA = Math.floor(Math.random() * 9) + 2
    const numB = Math.floor(Math.random() * 9) + 1
    setMathPuzzle({ a: numA, b: numB })
  }, [])

  const [dreamerErrors, setDreamerErrors] = useState({})
  const [dreamerSubmitted, setDreamerSubmitted] = useState(false)

  // Sanitization utility against XSS/script injection
  const sanitizeInput = (text) => typeof text === 'string' ? text.replace(/<[^>]*>?/gm, '') : text

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

    if (!dreamerForm.role.trim()) {
      errors.role = 'Please write your role'
    }

    if (!dreamerForm.reason.trim()) {
      errors.reason = 'Please tell us why you want to join'
    }

    if (!dreamerForm.roleReason.trim()) {
      errors.roleReason = 'Please tell us why you chose this role'
    }

    // Bot Verification Check
    if (parseInt(dreamerForm.captchaInput) !== mathPuzzle.a + mathPuzzle.b) {
      errors.captchaInput = `Incorrect calculation. What is ${mathPuzzle.a} + ${mathPuzzle.b}?`
    }

    return errors
  }

  const handleDreamerSubmit = async (e) => {
    e.preventDefault()

    // 🛡️ ANTI-SPAM PROTECTION 1: Honeypot Check
    if (dreamerForm.website_hp && dreamerForm.website_hp.trim() !== '') {
      console.warn('Spam bot detected via honeypot field.')
      setDreamerSubmitted(true) // Silent rejection
      return
    }

    // 🛡️ ANTI-SPAM PROTECTION 2: Cooldown timer
    const lastSubmission = localStorage.getItem('dreamworld_last_submission')
    if (lastSubmission) {
      const timeSince = Date.now() - parseInt(lastSubmission)
      const COOLDOWN = 12 * 60 * 60 * 1000 // 12 hours
      if (timeSince < COOLDOWN) {
        alert("🛑 The Council requires patience. You have already sent a join petition recently. Please wait for admin review.")
        return
      }
    }

    const errors = validateDreamerForm()

    if (Object.keys(errors).length > 0) {
      setDreamerErrors(errors)
      return
    }

    // Sanitize all inputs before saving
    const sanitizedForm = {
      name: sanitizeInput(dreamerForm.name),
      email: sanitizeInput(dreamerForm.email),
      phone: sanitizeInput(dreamerForm.phone),
      age: sanitizeInput(dreamerForm.age),
      gender: sanitizeInput(dreamerForm.gender),
      role: sanitizeInput(dreamerForm.role),
      otherRole: sanitizeInput(dreamerForm.otherRole),
      reason: sanitizeInput(dreamerForm.reason),
      roleReason: sanitizeInput(dreamerForm.roleReason)
    }

    try {
      await submitDreamerApplication(sanitizedForm)

      // Set Spam Protection Timestamp
      localStorage.setItem('dreamworld_last_submission', Date.now().toString())

      setDreamerSubmitted(true)

      setTimeout(() => {
        setDreamerForm({ name: '', email: '', phone: '', age: '', gender: '', role: '', otherRole: '', reason: '', roleReason: '', website_hp: '', captchaInput: '' })
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
          subtitle="Apply to become a Dreamer and bring your character to life."
        />


        {/* DREAMER REGISTRATION */}
        <div className="join-section">
          <h2 className="section-title">⭐ Become a Dreamer</h2>
          <p className="section-description">Choose your role and become a Dreamer with a character in DreamWorld.</p>

          <div className="join-content">
            <Card className="join-form-card">
              {appSettings && appSettings.dreamworld_open === false ? (
                <div className="closed-applications-message" style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ fontSize: '3rem' }}>🔒</div>
                  <h3 style={{
                    fontFamily: 'var(--font-display), serif',
                    color: 'var(--color-primary)',
                    fontSize: '1.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>Applications Temporarily Closed</h3>
                  <p style={{
                    color: 'var(--color-text-sub)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    maxWidth: '320px',
                    margin: '0 auto'
                  }}>
                    The Gates of DreamWorld are currently closed to new applicant petitions. Feel free to explore our active quests or meet our current fellowship of Dreamers.
                  </p>
                  <div style={{
                    borderBottom: '1px solid rgba(255, 215, 120, 0.15)',
                    width: '100%',
                    margin: '10px 0'
                  }} />
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 215, 120, 0.65)',
                    fontStyle: 'italic'
                  }}>
                    The Council will reopen registration when the cosmic alignments shift. 🌌
                  </p>
                </div>
              ) : !dreamerSubmitted ? (
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

                  <div className="form-row">
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
                    <label htmlFor="dreamer-role">Write Your Desired Role *</label>
                    <input
                      type="text"
                      id="dreamer-role"
                      name="role"
                      value={dreamerForm.role}
                      onChange={handleDreamerChange}
                      className={dreamerErrors.role ? 'error' : ''}
                      placeholder="e.g. Visionary Architect, Music Composer, Software Engineer, Storyteller, Healer..."
                    />
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
                    <label htmlFor="dreamer-roleReason">Why did you choose this role? *</label>
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

                  {/* 🛡️ Anti-Bot Honeypot Field (Hidden from human eyes) */}
                  <div style={{ display: 'none', visibility: 'hidden' }}>
                    <label htmlFor="website_hp">Leave empty</label>
                    <input
                      type="text"
                      id="website_hp"
                      name="website_hp"
                      value={dreamerForm.website_hp}
                      onChange={handleDreamerChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* 🧠 Anti-Bot Math Challenge */}
                  <div className="form-group" style={{ background: 'rgba(76,161,175,0.08)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(76,161,175,0.25)' }}>
                    <label htmlFor="captchaInput" style={{ fontWeight: 700, color: '#4CA1AF' }}>
                      🤖 Anti-Bot Verification: What is {mathPuzzle.a} + {mathPuzzle.b}? *
                    </label>
                    <input
                      type="number"
                      id="captchaInput"
                      name="captchaInput"
                      value={dreamerForm.captchaInput}
                      onChange={handleDreamerChange}
                      placeholder="Enter the number..."
                      className={dreamerErrors.captchaInput ? 'error' : ''}
                      style={{ marginTop: 6 }}
                      required
                    />
                    {dreamerErrors.captchaInput && <span className="error-message">{dreamerErrors.captchaInput}</span>}
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
