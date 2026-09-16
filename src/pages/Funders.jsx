import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import './Funders.css'



function Funders() {
  const { submitDonation, sponsorships } = useContent()
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: '',
    amount: '',
    type: 'one-time',
    showPublicly: true,
    message: '',
    paymentMethod: 'upi',
    upiId: '',
    sponsorshipType: 'general',  // 'general', 'quest', 'event'
    sponsorshipId: '',
    sponsorshipMessage: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const [searchParams] = useSearchParams()

  // Pre-load from URL params (Direct Sponsorship Link)
  useEffect(() => {
    const type = searchParams.get('type') // 'quest' or 'event'
    const id = searchParams.get('id')

    if (type && id && sponsorships.length > 0) {
      const sp = sponsorships.find(s => s.id === id && s.type === type)
      if (sp) {
        setFormData(prev => ({
          ...prev,
          sponsorshipType: type,
          sponsorshipId: id,
          sponsorshipMessage: `Supporting: ${sp.name || sp.title}`,
          type: 'one-time'
        }))

        // Short delay to ensure rendering before scroll
        setTimeout(() => {
          document.querySelector('.donation-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }, [searchParams, sponsorships])

  // Filter active quests and events
  const activeQuests = (sponsorships || []).filter(s => s.fundingStatus === 'active' && s.type === 'quest')
  const activeEvents = (sponsorships || []).filter(s => s.fundingStatus === 'active' && s.type === 'event')
  const completedSponsorships = (sponsorships || []).filter(s => s.fundingStatus === 'completed')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 🛡️ Anti-Spam Honeypot check
    if (formData.website_hp && formData.website_hp.trim() !== '') {
      console.warn('Spam bot blocked via honeypot field.')
      setSubmitted(true)
      return
    }

    if (!formData.name || !formData.email || !formData.amount) {
      alert('Please fill in your name, email, and amount.')
      return
    }

    setIsProcessing(true)

    try {
      // Log the donation intent to Supabase
      await submitDonation({
        ...formData,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        transactionId: `MANUAL-${Date.now()}`,
        message: formData.message || ''
      })

      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          name: '', displayName: '', email: '', amount: '',
          message: '', type: 'one-time', showPublicly: true,
          paymentMethod: 'upi', upiId: '',
          sponsorshipType: 'general', sponsorshipId: '', sponsorshipMessage: ''
        })
        setSubmitted(false)
      }, 8000)
    } catch (err) {
      console.error('Donation log error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getTierBadge = (tier) => {
    const badges = {
      'Nebula': { emoji: '🌌', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
      'Comet': { emoji: '☄️', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
      'Star': { emoji: '⭐', color: 'linear-gradient(135deg, #FFD700, #FFA500)' }
    }
    return badges[tier] || badges['Star']
  }

  return (
    <div className="funders page">
      <div className="container">
        {/* Logo */}
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>

        <SectionHeader
          title="Power the Dream Together"
          subtitle="Every contribution creates real impact in our community"
        />

        {/* Impact Mission */}
        <div className="impact-mission">
          {/* Active Sponsorship Opportunities */}
          <div className="sponsorship-opportunities">
            <h2 className="section-title">✨ Active Sponsorships</h2>
            {(activeQuests.length > 0 || activeEvents.length > 0) ? (
              <div className="opportunities-grid">
                {[...activeQuests, ...activeEvents].map(sp => (
                  <Card key={sp.id} className="opportunity-card">
                    <div className="opp-header">
                      <span className="opp-type">{sp.type === 'quest' ? '🎯 Quest' : '📅 Event'}</span>
                      <h3>{sp.name || sp.title}</h3>
                    </div>
                    <p className="opp-desc">{sp.description || sp.purpose}</p>

                    <div className="opp-funding">
                      <div className="opp-stats">
                        <span>₹{sp.amountRaised || 0} raised</span>
                        <span>Goal: ₹{sp.amountNeeded}</span>
                      </div>
                      <div className="opp-bar">
                        <div
                          className="opp-fill"
                          style={{ width: `${Math.min((parseFloat(sp.amountRaised || 0) / parseFloat(sp.amountNeeded)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          sponsorshipType: sp.type,
                          sponsorshipId: sp.id,
                          sponsorshipMessage: `Supporting: ${sp.name || sp.title}`
                        }))
                        document.querySelector('.donation-section').scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      💖 Support This Goal
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="no-opps">No active sponsorship goals at the moment. General donations still help us grow!</p>
            )}
          </div>
        </div>

        {/* Donation Form */}
        <div className="donation-section">
          <h2 className="section-title">💝 Make an Impact</h2>
          <Card hover={false} className="donation-form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="donation-form">

                {formData.sponsorshipId && (
                  <div className="selected-sponsorship-badge animate-fade">
                    <span>✨ Sponsoring: <strong>{formData.sponsorshipMessage}</strong></span>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, sponsorshipId: '', sponsorshipType: 'general', sponsorshipMessage: '' }))}>✕</button>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="amount">Amount (INR)</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="Any amount helps"
                    />
                  </div>
                </div>

                <div className="payment-method-section">
                  <label className="section-label">Pay via GPay / UPI</label>

                  {/* QR Code + UPI ID box */}
                  <div style={{
                    marginTop: '10px',
                    background: 'rgba(76,161,175,0.07)',
                    border: '1px solid rgba(76,161,175,0.25)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                    textAlign: 'center'
                  }}>
                    <img
                      src="/gpay.jpeg"
                      alt="GPay QR Code"
                      style={{ width: '180px', height: '180px', borderRadius: '12px', objectFit: 'cover', border: '2px solid rgba(76,161,175,0.3)' }}
                    />
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: 'var(--color-text-sub)' }}>Scan the QR code above or pay to:</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#ffd778', letterSpacing: '0.03em' }}>justicekonjengbam2002@okicici</p>
                    </div>
                  </div>
                </div>

                {!formData.sponsorshipId && formData.type === 'one-time' && (
                  <div className="form-group-full sponsorship-select-inline animate-fade">
                    <label>Direct my donation to:</label>
                    <select
                      value={formData.sponsorshipId}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (!id) {
                          setFormData(prev => ({ ...prev, sponsorshipId: '', sponsorshipType: 'general' }));
                          return;
                        }
                        const sp = sponsorships.find(s => s.id === id);
                        setFormData(prev => ({
                          ...prev,
                          sponsorshipId: id,
                          sponsorshipType: sp.type,
                          sponsorshipMessage: `Supporting: ${sp.name || sp.title}`,
                          type: 'one-time' // Logic fix: Force one-time when choosing a goal
                        }));
                      }}
                    >
                      <option value="">General Growth Fund (Default)</option>
                      {activeQuests.length > 0 && (
                        <optgroup label="Quests">
                          {activeQuests.map(q => <option key={q.id} value={q.id}>{q.name || q.title}</option>)}
                        </optgroup>
                      )}
                      {activeEvents.length > 0 && (
                        <optgroup label="Events">
                          {activeEvents.map(e => <option key={e.id} value={e.id}>{e.name || e.title}</option>)}
                        </optgroup>
                      )}
                    </select>
                  </div>
                )}

                <div className="form-group-full">
                  <label htmlFor="displayName">Display Name (if shown publicly)</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Leave blank to use your name, or enter 'Anonymous'"
                  />
                </div>

                <div className="form-group-full">
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Leave a message for the team..."
                    style={{ background: 'rgba(26, 31, 53, 0.8)', border: '1px solid rgba(76, 161, 175, 0.3)', borderRadius: '8px', color: 'white', padding: '12px', width: '100%' }}
                  />
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="showPublicly"
                    name="showPublicly"
                    checked={formData.showPublicly}
                    onChange={handleChange}
                  />
                  <label htmlFor="showPublicly">
                    Show my name publicly to celebrate my contribution
                  </label>
                </div>

                <Button type="submit" variant="primary" disabled={isProcessing}>
                  {isProcessing ? '🔄 Processing...' : '💝 Submit Donation Intent'}
                </Button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✨</div>
                <h3>Thank You for Your Support!</h3>
                <p>
                  {formData.name}, your donation of <strong>₹{formData.amount}</strong> means the world to us. 💙
                </p>
                {formData.sponsorshipId && (
                  <p className="sponsorship-thanks">
                    Your contribution will go toward: <strong>{formData.sponsorshipMessage}</strong>
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Completed Sponsorships Wall */}
        {completedSponsorships.length > 0 && (
          <div className="completed-wall">
            <h2 className="section-title">✓ Goals Achieved</h2>
            <div className="completed-grid">
              {completedSponsorships.map(sp => (
                <Card key={sp.id} className="completed-card">
                  <div className="completed-badge-top">SUCCESS</div>
                  <h3>{sp.name || sp.title}</h3>
                  <p className="completion-impact">{sp.completionNote || 'Fully funded and completed!'}</p>
                  {sp.completionImages && sp.completionImages.length > 0 && (
                    <div className="completion-gallery-mini">
                      {sp.completionImages.slice(0, 3).map((img, idx) => (
                        <img key={idx} src={img} alt="Impact" />
                      ))}
                    </div>
                  )}
                  <div className="completed-footer">
                    <span>{sp.type === 'quest' ? '🎯' : '📅'} {sp.type.toUpperCase()}</span>
                    <span>₹{sp.amountNeeded} RAISED</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}



        {/* Other Ways */}
        <div className="other-ways">
          <h2 className="section-title">🤝 Other Ways to Contribute</h2>
          <div className="ways-grid">
            <Card className="way-card">
              <div className="way-icon">🌱</div>
              <h4>Spread the Word</h4>
              <p>Share DreamWorld with your community</p>
            </Card>
            <Card className="way-card">
              <div className="way-icon">💻</div>
              <h4>Build Together</h4>
              <p>Contribute code or design</p>
            </Card>
            <Card className="way-card">
              <div className="way-icon">📝</div>
              <h4>Create Quests</h4>
              <p>Design challenges for others</p>
            </Card>
            <Card className="way-card">
              <div className="way-icon">🎓</div>
              <h4>Mentor & Guide</h4>
              <p>Share your knowledge</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Funders
