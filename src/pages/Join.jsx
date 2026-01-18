import { useState } from 'react'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import './Join.css'


function Join() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const interests = [
    'Learning & Education',
    'Technology & Coding',
    'Nature & Sustainability',
    'Community Building',
    'Art & Creativity',
    'Health & Wellness'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.interest) {
      newErrors.interest = 'Please select an interest area'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log('Form submitted:', formData)
    setSubmitted(true)
    
    setTimeout(() => {
      setFormData({ name: '', email: '', interest: '' })
      setSubmitted(false)
    }, 5000)
  }

  return (
    <div className="join page">
      <div className="container">
        {/* Logo at top */}
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>

        <SectionHeader 
          title="Join DreamWorld" 
          subtitle="Become part of a community building a better future together"
        />

        <div className="join-content">
          <Card hover={false} className="join-form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="join-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="interest">Primary Interest Area *</label>
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className={errors.interest ? 'error' : ''}
                  >
                    <option value="">Select an area...</option>
                    {interests.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                  {errors.interest && <span className="error-message">{errors.interest}</span>}
                </div>

                <Button type="submit" variant="primary">Join the Community</Button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✨</div>
                <h3>Welcome to DreamWorld!</h3>
                <p>
                  Thank you for joining our community, {formData.name}! We're excited to have you.
                  Check your email at {formData.email} for next steps.
                </p>
                <p className="success-note">
                  Your journey begins now. Start exploring quests and connecting with fellow dreamers.
                </p>
              </div>
            )}
          </Card>

          <Card hover={false} className="guidelines-card">
            <h3>Community Guidelines</h3>
            <div className="guideline">
              <h4>🌱 Be Kind & Respectful</h4>
              <p>We're all learning together. Treat everyone with respect and empathy.</p>
            </div>
            <div className="guideline">
              <h4>🤝 Share Generously</h4>
              <p>Knowledge grows when shared. Help others and ask for help when you need it.</p>
            </div>
            <div className="guideline">
              <h4>🎯 Stay Curious</h4>
              <p>Ask questions, explore new ideas, and embrace the learning process.</p>
            </div>
            <div className="guideline">
              <h4>🌍 Think Impact</h4>
              <p>Consider how your actions affect others and the world around you.</p>
            </div>
            <div className="guideline">
              <h4>✨ Celebrate Progress</h4>
              <p>Every small step matters. Celebrate your wins and those of others.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}


export default Join
