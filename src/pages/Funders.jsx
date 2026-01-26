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

    // If user selects "monthly", auto-set amount to 399 and lock it
    if (name === 'type' && value === 'monthly') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        amount: '399' // Hardcoded to match your Razorpay Plan
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    // Common Razorpay Config
    const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

    try {
      // --- AUTO-PAY (MONTHLY) FLOW ---
      if (formData.type === 'monthly') {
        const PLAN_ID = import.meta.env.VITE_RAZORPAY_PLAN_ID; // Should be set in .env

        // If no Plan ID is configured, fallback to the redirect method but in same window
        if (!PLAN_ID) {
          console.warn("No VITE_RAZORPAY_PLAN_ID found. Falling back to redirect.");
          submitDonation(formData).catch(err => console.error("Failed to log monthly intent", err))
          window.location.href = import.meta.env.VITE_RAZORPAY_SUBSCRIPTION_URL || 'https://rzp.io/rzp/VUIo0oZ';
          return;
        }

        // Create a real subscription via our backend API
        const subRes = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: PLAN_ID,
            customerName: formData.name,
            customerEmail: formData.email
          })
        });

        const subData = await subRes.json();

        if (!subRes.ok) {
          // If the secret is missing, it will throw here
          throw new Error(subData.error || 'Check if RAZORPAY_SECRET is added to Vercel/Env');
        }

        const subOptions = {
          key: RAZORPAY_KEY_ID, // Use the public key here
          subscription_id: subData.subscriptionId,
          name: "DreamWorld",
          description: "Monthly Support Subscription",
          image: "/logo.png",
          handler: function (response) {
            submitDonation({
              ...formData,
              message: `[SUB_ID: ${response.razorpay_subscription_id}] ${formData.message}`,
              status: 'success',
              paymentMethod: formData.paymentMethod,
              transactionId: response.razorpay_subscription_id
            })
            setSubmitted(true)
          },
          prefill: {
            name: formData.name,
            email: formData.email
          },
          theme: { color: "#4CA1AF" },
          modal: {
            ondismiss: function () {
              // Log payment cancellation
              submitDonation({
                ...formData,
                status: 'failed',
                paymentMethod: formData.paymentMethod,
                transactionId: '',
                message: 'Payment cancelled by user'
              }).catch(err => console.error("Failed to log cancellation", err))
              setIsProcessing(false)
            }
          }
        };

        const rzpSub = new window.Razorpay(subOptions);
        rzpSub.open();
        setIsProcessing(false);
        return;
      }

      // --- ONE-TIME PAYMENT FLOW ---
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: formData.amount * 100,
        currency: "INR",
        name: "DreamWorld",
        description: "Support Contribution",
        image: "/logo.png",
        handler: function (response) {
          submitDonation({
            ...formData,
            status: 'success',
            paymentMethod: formData.paymentMethod,
            transactionId: response.razorpay_payment_id
          }).catch(err => console.error("Failed to log donation", err))
          setSubmitted(true)
          setTimeout(() => {
            setFormData({
              name: '', displayName: '', email: '', amount: '',
              message: '', type: 'one-time', showPublicly: true,
              paymentMethod: 'upi', upiId: ''
            })
            setSubmitted(false)
          }, 5000)
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          method: formData.paymentMethod === 'upi' ? 'upi' : (formData.paymentMethod === 'gpay' ? 'upi' : 'card')
        },
        notes: {
          contribution_type: formData.type,
          display_name: formData.displayName || formData.name,
          message: formData.message
        },
        theme: { color: "#4CA1AF" },
        modal: {
          ondismiss: function () {
            // Log payment cancellation
            submitDonation({
              ...formData,
              status: 'failed',
              paymentMethod: formData.paymentMethod,
              transactionId: '',
              message: 'Payment cancelled by user'
            }).catch(err => console.error("Failed to log cancellation", err))
            setIsProcessing(false)
          }
        }
      }

      if (formData.paymentMethod === 'upi' && formData.upiId) {
        options.prefill.vpa = formData.upiId
      }

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        alert("Razorpay SDK failed to load.")
      }
    } catch (err) {
      console.error("Payment Error:", err);
      // Log payment initialization failure
      submitDonation({
        ...formData,
        status: 'failed',
        paymentMethod: formData.paymentMethod,
        transactionId: '',
        message: `Error: ${err.message}`
      }).catch(logErr => console.error("Failed to log error", logErr))
      alert("⚠️ Payment Initialization Failed: " + err.message + "\n\n(Ask Antigravity if you need help with the Secret Key!)");
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
                    <label htmlFor="amount">
                      {formData.type === 'monthly' ? 'Fixed Subscription Amount (INR)' : 'Amount (INR)'}
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required={formData.type !== 'monthly'}
                      disabled={formData.type === 'monthly'}
                      min="1"
                      placeholder={formData.type === 'monthly' ? '399' : 'Any amount helps'}
                      style={formData.type === 'monthly' ? { opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,215,0,0.1)', borderColor: 'var(--color-gold)' } : {}}
                    />
                    {formData.type === 'monthly' && (
                      <small style={{ color: 'var(--color-gold)', marginTop: '4px', fontSize: '0.75rem' }}>
                        ✨ Price is locked to ₹399/mo by your selected plan.
                      </small>
                    )}
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
                      {!formData.sponsorshipId && (
                        <option value="monthly">Auto Pay (₹399 Monthly)</option>
                      )}
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
                  {isProcessing ? '🔄 Processing...' : (formData.paymentMethod === 'gpay' ? 'Pay Now' : 'Continue to Payment')}
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
                {formData.sponsorshipId && (
                  <p className="sponsorship-thanks">
                    Your contribution has been directed to: <strong>{formData.sponsorshipMessage}</strong>
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
