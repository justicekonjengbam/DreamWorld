import { useState } from 'react'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Badge from '../components/Badge'
import './Funders.css'


function Funders() {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: '',
    amount: '',
    type: 'one-time',
    showPublicly: true,
    message: '',
    paymentMethod: 'upi',
    upiId: ''
  })
  const [submitted, setSubmitted] = useState(false)

  // Hall of Fame - All-time impact leaders (static, celebrate achievements)
  const hallOfFame = [
    {
      id: 1,
      name: 'Innovation Labs',
      tier: 'Nebula',
      impact: 'Funded 12 community workshops',
      avatar: '🚀'
    },
    {
      id: 2,
      name: 'Tech for Good Foundation',
      tier: 'Comet',
      impact: 'Sponsored 50 student kits',
      avatar: '🏢'
    },
    {
      id: 3,
      name: 'Green Earth Collective',
      tier: 'Star',
      impact: 'Powered 8 nature quests',
      avatar: '🌍'
    }
  ]

  // This Month's Champions (resets monthly)
  const monthlyChampions = [
    {
      id: 1,
      name: 'Sarah Chen',
      impact: 'Funded Art Quest Workshop',
      avatar: '👩‍💻',
      tier: 'Star'
    },
    {
      id: 2,
      name: 'Community Tech Fund',
      impact: 'Sponsored 10 beginner coding kits',
      avatar: '💻',
      tier: 'Comet'
    },
    {
      id: 3,
      name: 'Alex Rivera',
      impact: 'Enabled Sustainability Quest',
      avatar: '🎨',
      tier: 'Star'
    }
  ]

  // Builders Circle - Monthly supporters (no ranking, just appreciation)
  const buildersCircle = [
    { id: 1, name: 'Maya Thompson', since: 'Jan 2025', avatar: '🌱' },
    { id: 2, name: 'Jordan Lee', since: 'Feb 2025', avatar: '🎯' },
    { id: 3, name: 'Sam Parker', since: 'Mar 2025', avatar: '✨' },
    { id: 4, name: 'Anonymous Friend', since: 'Jan 2025', avatar: '💫' }
  ]

  // First-Time Supporters (celebrates new people)
  const firstTimers = [
    { id: 1, name: 'Emma Wilson', impact: 'Helped fund Quest Platform', avatar: '🌟' },
    { id: 2, name: 'Dev Community', impact: 'Sponsored Coding Resources', avatar: '⚡' },
    { id: 3, name: 'Anonymous', impact: 'Supported General Fund', avatar: '💝' },
    { id: 4, name: 'Carlos Martinez', impact: 'Funded Art Supplies', avatar: '🎨' }
  ]

  // Quest Sponsors - Small sponsors can shine
  const questSponsors = [
    { id: 1, quest: 'Plant a Seed Quest', sponsor: 'Green Hearts Collective', avatar: '🌱' },
    { id: 2, quest: 'Code for Good Workshop', sponsor: 'Tech Buddies', avatar: '💻' },
    { id: 3, quest: 'Art & Expression Week', sponsor: 'Creative Minds Fund', avatar: '🎨' },
    { id: 4, quest: 'Community Cleanup', sponsor: 'Earth Warriors', avatar: '🌍' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Redirect to Subscription Page for Monthly/Auto-Pay
    if (formData.type === 'monthly') {
      window.open('https://rzp.io/rzp/VUIo0oZ', '_blank')
      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          name: '',
          displayName: '',
          email: '',
          amount: '',
          message: '',
          type: 'one-time',
          showPublicly: true,
          paymentMethod: 'upi',
          upiId: ''
        })
        setSubmitted(false)
      }, 5000)
      return
    }

    // RAZORPAY INTEGRATION (For One-Time Payments)
    // The Key ID is now stored in the .env file for security
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: formData.amount * 100, // Razorpay expects amount in paise (100 paise = 1 INR)
      currency: "INR",
      name: "DreamWorld",
      description: "Support Contribution",
      image: "/logo.png",
      handler: function (response) {
        console.log('Payment Successful:', response)
        setSubmitted(true)

        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            displayName: '',
            email: '',
            amount: '',
            message: '',
            type: 'one-time',
            showPublicly: true,
            paymentMethod: 'upi',
            upiId: ''
          })
          setSubmitted(false)
        }, 5000)
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: "", // Optional
        method: formData.paymentMethod === 'upi' ? 'upi' : (formData.paymentMethod === 'gpay' ? 'upi' : 'card')
      },
      notes: {
        contribution_type: formData.type,
        display_name: formData.displayName || formData.name,
        message: formData.message,
        show_publicly: formData.showPublicly
      },
      theme: {
        color: "#4CA1AF" // Site's Cyan color
      }
    }

    // Handle UPI ID if specifically selected in our UI
    if (formData.paymentMethod === 'upi' && formData.upiId) {
      options.prefill.vpa = formData.upiId
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description)
      })
      rzp.open()
    } else {
      alert("Razorpay SDK failed to load. Please check your internet connection.")
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
          <Card hover={false}>
            <div className="impact-stats">
              <div className="impact-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Quests Funded</div>
              </div>
              <div className="impact-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Kits Sponsored</div>
              </div>
              <div className="impact-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Workshops Hosted</div>
              </div>
            </div>
            <p className="impact-text">
              Your support doesn't just fund a project—it empowers learners, enables quests,
              and builds a community where everyone can grow together.
            </p>
          </Card>
        </div>

        {/* Donation Form */}
        <div className="donation-section">
          <h2 className="section-title">💝 Make an Impact</h2>
          <Card hover={false} className="donation-form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="donation-form">
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

                  <div className="form-group">
                    <label htmlFor="type">Contribution Schedule</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="one-time">One-Time Support</option>
                      <option value="monthly">Auto Pay (Monthly Subscription)</option>
                    </select>
                  </div>
                </div>

                <div className="payment-method-section">
                  <label className="section-label">Select Payment Method</label>
                  <div className="payment-methods-grid">
                    <div
                      className={`payment-method-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    >
                      <div className="method-icon">📱</div>
                      <div className="method-name">UPI</div>
                      <div className="method-sub">PhonePe, GPay, etc.</div>
                    </div>
                    <div
                      className={`payment-method-card ${formData.paymentMethod === 'gpay' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'gpay' }))}
                    >
                      <div className="method-icon">💳</div>
                      <div className="method-name">Google Pay</div>
                      <div className="method-sub">Fast & Secure</div>
                    </div>
                    <div
                      className={`payment-method-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    >
                      <div className="method-icon">🏛️</div>
                      <div className="method-name">Credit/Debit</div>
                      <div className="method-sub">All major cards</div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'upi' && (
                    <div className="form-group-full upi-input-field">
                      <label htmlFor="upiId">Your UPI ID</label>
                      <input
                        type="text"
                        id="upiId"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        required
                        placeholder="username@bank"
                      />
                    </div>
                  )}

                  {formData.paymentMethod === 'gpay' && (
                    <div className="gpay-container">
                      <div className="gpay-simulated-button clickable" onClick={handleSubmit}>
                        <span className="gpay-logo">Pay with Google Pay</span>
                      </div>
                      <p className="gpay-infoText">Razorpay will open to securely process your GPay request.</p>
                    </div>
                  )}
                </div>

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

                <Button type="submit" variant="primary">
                  {formData.paymentMethod === 'gpay' ? 'Pay Now' : 'Continue to Payment'}
                </Button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✨</div>
                <h3>Thank You for Your Impact!</h3>
                <p>
                  {formData.name}, you're now part of the community building DreamWorld.
                  Your {formData.type === 'monthly' ? 'Auto Pay subscription' : 'contribution'} via {formData.paymentMethod.toUpperCase()} will help create real opportunities for learning and growth!
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* This Month's Champions */}
        <div className="champions-section">
          <h2 className="section-title">🌟 This Month's Champions</h2>
          <p className="section-subtitle">January 2026 - Making the biggest impact this month</p>

          <div className="champions-podium">
            {monthlyChampions.map((champion, index) => {
              const badge = getTierBadge(champion.tier)
              return (
                <div key={champion.id} className={`champion-card rank-${index + 1}`}>
                  <div className="champion-tier" style={{ background: badge.color }}>
                    {badge.emoji}
                  </div>
                  <div className="champion-avatar">{champion.avatar}</div>
                  <h3 className="champion-name">{champion.name}</h3>
                  <p className="champion-impact">{champion.impact}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quest Sponsors */}
        <div className="quest-sponsors-section">
          <h2 className="section-title">🎯 Quest Sponsors</h2>
          <p className="section-subtitle">Powering specific quests and workshops</p>

          <div className="quest-sponsors-grid">
            {questSponsors.map((item) => (
              <Card key={item.id} className="quest-sponsor-card">
                <div className="quest-avatar">{item.avatar}</div>
                <h4 className="quest-title">{item.quest}</h4>
                <p className="quest-sponsor">Sponsored by <strong>{item.sponsor}</strong></p>
              </Card>
            ))}
          </div>
        </div>

        {/* Builders Circle */}
        <div className="builders-section">
          <h2 className="section-title">🛠️ Builders Circle</h2>
          <p className="section-subtitle">Monthly supporters sustaining DreamWorld</p>

          <div className="builders-grid">
            {buildersCircle.map((builder) => (
              <Card key={builder.id} className="builder-card">
                <div className="builder-avatar">{builder.avatar}</div>
                <h4 className="builder-name">{builder.name}</h4>
                <p className="builder-since">Building since {builder.since}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* First-Time Supporters */}
        <div className="firsttimers-section">
          <h2 className="section-title">🎉 First-Time Supporters</h2>
          <p className="section-subtitle">Welcome to our newest community champions!</p>

          <div className="firsttimers-list">
            {firstTimers.map((supporter) => (
              <Card key={supporter.id} className="firsttimer-card">
                <div className="firsttimer-avatar">{supporter.avatar}</div>
                <div className="firsttimer-info">
                  <h4>{supporter.name}</h4>
                  <p>{supporter.impact}</p>
                </div>
                <div className="welcome-badge">Welcome! 🎊</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="halloffame-section">
          <h2 className="section-title">🏆 All-Time Hall of Fame</h2>
          <p className="section-subtitle">Legendary supporters who've created lasting impact</p>

          <div className="halloffame-grid">
            {hallOfFame.map((legend) => {
              const badge = getTierBadge(legend.tier)
              return (
                <Card key={legend.id} className="legend-card">
                  <div className="legend-tier" style={{ background: badge.color }}>
                    <span className="tier-emoji">{badge.emoji}</span>
                    <span className="tier-name">{legend.tier}</span>
                  </div>
                  <div className="legend-avatar">{legend.avatar}</div>
                  <h3 className="legend-name">{legend.name}</h3>
                  <p className="legend-impact">{legend.impact}</p>
                </Card>
              )
            })}
          </div>
        </div>

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
