import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import Button from '../components/Button'
import './AcademyEnroll.css'

function AcademyEnroll() {
    const { submitAcademyApplication } = useContent()

    const [form, setForm] = useState({
        name: '',
        class: '',
        schoolName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        hobbies: '',
        favouriteColour: '',
        favouriteAnimal: '',
        aimInLife: ''
    })
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [spamBlocked, setSpamBlocked] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        if (submitError) setSubmitError('')
    }

    const validate = () => {
        const err = {}
        if (!form.name.trim()) err.name = 'Name is required'
        if (!form.class) err.class = 'Class is required'
        if (!form.age) err.age = 'Age is required'
        if (!form.gender) err.gender = 'Gender is required'
        if (!form.hobbies.trim()) err.hobbies = 'Please share your interests'
        if (!form.favouriteColour.trim()) err.favouriteColour = 'Required'
        if (!form.favouriteAnimal.trim()) err.favouriteAnimal = 'Required'
        if (!form.aimInLife.trim()) err.aimInLife = 'Please share your dream'
        return err
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')
        setSpamBlocked(false)

        // Spam protection check
        const last = localStorage.getItem('dw_academy_last_submission')
        if (last && Date.now() - parseInt(last) < 24 * 60 * 60 * 1000) {
            setSpamBlocked(true)
            return
        }

        const err = validate()
        if (Object.keys(err).length > 0) {
            setErrors(err)
            return
        }

        setSubmitting(true)
        try {
            await submitAcademyApplication(form)
            // Only set the spam lock AFTER successful save
            localStorage.setItem('dw_academy_last_submission', Date.now().toString())
            setSubmitted(true)
        } catch (error) {
            setSubmitError('Failed to submit your application. Please try again. (' + error.message + ')')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success Screen ──────────────────────────────────────────
    if (submitted) {
        return (
            <div className="acad-enroll page">
                <div className="enroll-success-page">
                    <div className="enroll-success-inner">
                        <img src="/DreamWorldAcademy.png" alt="Academy" className="success-badge-img" />
                        <h2>Your Scroll Has Been Received!</h2>
                        <p>
                            Welcome to the gates of <strong>DreamWorld Academy</strong>, young dreamer.
                            <br />
                            The Council will review your enrollment scroll with great care.
                        </p>
                        <p className="success-note-sub">Await a formal decree regarding your acceptance. 📜</p>
                        <div className="success-actions">
                            <Link to="/academy"><Button variant="primary">← Back to Academy</Button></Link>
                            <Link to="/academy/students"><Button variant="secondary">Meet Our Students</Button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── Form ────────────────────────────────────────────────────
    return (
        <div className="acad-enroll page">
            <div className="acad-enroll-header">
                <div className="container acad-enroll-header-inner">
                    <img src="/DreamWorldAcademy.png" alt="Academy" className="enroll-badge" />
                    <p className="enroll-tagline">DreamWorld Academy</p>
                    <h1 className="enroll-title">Enrollment Scroll</h1>
                    <p className="enroll-desc">Fill in the scroll below to begin your Academy journey. The Council will review your application.</p>
                </div>
            </div>

            <div className="container acad-enroll-body">
                <div className="acad-enroll-layout">

                    {/* Form Card */}
                    <Card className="enroll-form-card" hover={false}>

                        {/* Spam block message */}
                        {spamBlocked && (
                            <div className="ef-inline-warn">
                                🕐 The Academy Scrolls require patience. You have already applied recently.
                                Please wait 24 hours before applying again.
                            </div>
                        )}

                        {/* Submit error */}
                        {submitError && (
                            <div className="ef-inline-error">
                                ⚠️ {submitError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="enroll-form">

                            <div className="ef-row">
                                <div className="ef-group">
                                    <label htmlFor="e-name">Full Name *</label>
                                    <input id="e-name" type="text" name="name" value={form.name} onChange={handleChange}
                                        placeholder="Your full name" className={errors.name ? 'ef-error' : ''} />
                                    {errors.name && <span className="ef-err-msg">{errors.name}</span>}
                                </div>
                                <div className="ef-group">
                                    <label htmlFor="e-class">Class / Grade *</label>
                                    <select id="e-class" name="class" value={form.class} onChange={handleChange}
                                        className={errors.class ? 'ef-error' : ''}>
                                        <option value="">Select class...</option>
                                        {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7',
                                            'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'College / University', 'Other']
                                            .map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.class && <span className="ef-err-msg">{errors.class}</span>}
                                </div>
                            </div>

                            <div className="ef-group">
                                <label htmlFor="e-school">School / Institution <span className="ef-optional">(Optional)</span></label>
                                <input id="e-school" type="text" name="schoolName" value={form.schoolName} onChange={handleChange}
                                    placeholder="Name of your school or college" />
                            </div>

                            <div className="ef-row">
                                <div className="ef-group">
                                    <label htmlFor="e-age">Age *</label>
                                    <input id="e-age" type="number" name="age" value={form.age} onChange={handleChange}
                                        placeholder="Your age" min="5" max="25" className={errors.age ? 'ef-error' : ''} />
                                    {errors.age && <span className="ef-err-msg">{errors.age}</span>}
                                </div>
                                <div className="ef-group">
                                    <label htmlFor="e-gender">Gender *</label>
                                    <select id="e-gender" name="gender" value={form.gender} onChange={handleChange}
                                        className={errors.gender ? 'ef-error' : ''}>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <span className="ef-err-msg">{errors.gender}</span>}
                                </div>
                            </div>

                            {/* Private contact */}
                            <div className="ef-contact-section">
                                <p className="ef-contact-note">🔒 Contact details are private — only the Academy admin can see them.</p>
                                <div className="ef-row">
                                    <div className="ef-group">
                                        <label htmlFor="e-phone">Phone Number <span className="ef-optional">(Optional)</span></label>
                                        <input id="e-phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                                            placeholder="e.g. +91 98765 43210" />
                                    </div>
                                    <div className="ef-group">
                                        <label htmlFor="e-email">Email Address <span className="ef-optional">(Optional)</span></label>
                                        <input id="e-email" type="email" name="email" value={form.email} onChange={handleChange}
                                            placeholder="your@email.com" />
                                    </div>
                                </div>
                            </div>

                            <div className="ef-group">
                                <label htmlFor="e-hobbies">Interests &amp; Hobbies *</label>
                                <textarea id="e-hobbies" name="hobbies" value={form.hobbies} onChange={handleChange}
                                    rows="3" placeholder="e.g. Drawing, reading, coding, football..."
                                    className={errors.hobbies ? 'ef-error' : ''} />
                                {errors.hobbies && <span className="ef-err-msg">{errors.hobbies}</span>}
                            </div>

                            <div className="ef-row">
                                <div className="ef-group">
                                    <label htmlFor="e-colour">Favourite Colour *</label>
                                    <input id="e-colour" type="text" name="favouriteColour" value={form.favouriteColour}
                                        onChange={handleChange} placeholder="e.g. Deep Blue, Violet"
                                        className={errors.favouriteColour ? 'ef-error' : ''} />
                                    {errors.favouriteColour && <span className="ef-err-msg">{errors.favouriteColour}</span>}
                                </div>
                                <div className="ef-group">
                                    <label htmlFor="e-animal">Favourite Animal *</label>
                                    <input id="e-animal" type="text" name="favouriteAnimal" value={form.favouriteAnimal}
                                        onChange={handleChange} placeholder="e.g. Wolf, Owl, Dragon"
                                        className={errors.favouriteAnimal ? 'ef-error' : ''} />
                                    {errors.favouriteAnimal && <span className="ef-err-msg">{errors.favouriteAnimal}</span>}
                                </div>
                            </div>

                            <div className="ef-group">
                                <label htmlFor="e-aim">Your Aim in Life / Dream *</label>
                                <textarea id="e-aim" name="aimInLife" value={form.aimInLife} onChange={handleChange}
                                    rows="3" placeholder="What do you want to be? What change do you want to bring to the world?"
                                    className={errors.aimInLife ? 'ef-error' : ''} />
                                {errors.aimInLife && <span className="ef-err-msg">{errors.aimInLife}</span>}
                            </div>

                            <Button type="submit" variant="primary" disabled={submitting || spamBlocked}>
                                {submitting ? '✨ Submitting Scroll...' : '📜 Submit My Enrollment'}
                            </Button>

                        </form>
                    </Card>

                    {/* Sidebar */}
                    <div className="enroll-sidebar">
                        <Card className="enroll-info-card" hover={false}>
                            <h3>🏫 Why Join?</h3>
                            <div className="enroll-benefit">
                                <span className="benefit-icon">📚</span>
                                <div>
                                    <h4>Learning &amp; Growth</h4>
                                    <p>Discover your unique gifts and begin your journey.</p>
                                </div>
                            </div>
                            <div className="enroll-benefit">
                                <span className="benefit-icon">🏅</span>
                                <div>
                                    <h4>ID Card &amp; Certificate</h4>
                                    <p>Receive your official Academy documents on acceptance.</p>
                                </div>
                            </div>
                            <div className="enroll-benefit">
                                <span className="benefit-icon">⭐</span>
                                <div>
                                    <h4>Dream Level System</h4>
                                    <p>Earn XP and watch your character grow.</p>
                                </div>
                            </div>
                            <div className="enroll-benefit">
                                <span className="benefit-icon">🌍</span>
                                <div>
                                    <h4>A Dreamer Community</h4>
                                    <p>Be part of a fellowship of young changemakers.</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="enroll-note-card" hover={false}>
                            <h4>📋 What happens next?</h4>
                            <ol className="enroll-steps">
                                <li>Submit your enrollment scroll</li>
                                <li>The Academy Council reviews your application</li>
                                <li>You receive a decision</li>
                                <li>Accepted students get their ID card &amp; certificate</li>
                            </ol>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AcademyEnroll
