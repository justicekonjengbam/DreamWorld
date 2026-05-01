import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Button from '../components/Button'
import ImageModal from '../components/ImageModal'
import StatGraph from '../components/StatGraph'
import './AcademyStudentDetail.css'

function AcademyStudentDetail() {
    const { id } = useParams()
    const { academyStudents, loading } = useContent()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState('')

    const openLightbox = (src) => {
        if (!src) return
        setModalImage(src)
        setModalOpen(true)
    }

    if (loading) return <div className="loading-state">Loading student profile...</div>

    const student = academyStudents.find(s => s.id === id)

    if (!student) {
        return (
            <div className="not-found page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
                    <h2>Student not found</h2>
                    <p>This student may no longer be in the Academy.</p>
                    <Link to="/academy/students"><Button variant="primary">← Back to Students</Button></Link>
                </div>
            </div>
        )
    }

    const level = Math.floor((student.points || 0) / 108)
    const xpInCurrentLevel = (student.points || 0) % 108

    return (
        <div className="academy-detail page">
            {/* Cover */}
            <div
                className="academy-detail-cover"
                style={{
                    backgroundImage: `url(/AcademyBackground.png)`,
                    cursor: 'zoom-in'
                }}
                onClick={() => openLightbox('/AcademyBackground.png')}
            >
                <div className="cover-overlay" />
            </div>

            <ImageModal
                src={modalImage}
                alt={student.name}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <div className="container">
                <div className="academy-detail-header">
                    <div className="academy-detail-avatar-wrap">
                        <img
                            src={student.avatar || '/DreamWorldAcademy.png'}
                            alt={student.name}
                            className="academy-detail-avatar"
                            style={{ cursor: 'zoom-in' }}
                            onClick={(e) => {
                                e.stopPropagation()
                                openLightbox(student.avatar || '/DreamWorldAcademy.png')
                            }}
                            onError={(e) => { e.target.src = '/DreamWorldAcademy.png' }}
                        />
                        <img src="/DreamWorldAcademy.png" alt="Academy" className="academy-detail-badge-icon" />
                    </div>

                    <div className="academy-detail-info">
                        <p className="detail-academy-label">DreamWorld Academy</p>
                        <h1 className="detail-name">{student.name}</h1>
                        <p className="detail-class">{student.class}{student.school_name ? ` · ${student.school_name}` : ''}</p>
                        <p className="detail-joined">
                            Enrolled: {student.joined_date ? new Date(student.joined_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently'}
                        </p>
                    </div>
                </div>

                {/* Level */}
                <div className="detail-level-card">
                    <div className="level-number">Dream Level {level}</div>
                    <div className="level-xp-bar">
                        <div className="level-xp-fill" style={{ width: `${(xpInCurrentLevel / 108) * 100}%` }} />
                    </div>
                    <p className="level-xp-text">{student.points || 0} XP total · {xpInCurrentLevel} / 108 XP to next level</p>
                </div>


                {/* Facts Grid */}
                <div className="detail-facts-grid">
                    <div className="detail-fact-card">
                        <div className="fact-icon">🎂</div>
                        <div className="fact-label">Age</div>
                        <div className="fact-value">{student.age || '—'}</div>
                    </div>
                    <div className="detail-fact-card">
                        <div className="fact-icon">⚧</div>
                        <div className="fact-label">Gender</div>
                        <div className="fact-value">{student.gender || '—'}</div>
                    </div>
                    <div className="detail-fact-card">
                        <div className="fact-icon">🎨</div>
                        <div className="fact-label">Favourite Colour</div>
                        <div className="fact-value">{student.favourite_colour || '—'}</div>
                    </div>
                    <div className="detail-fact-card">
                        <div className="fact-icon">🐾</div>
                        <div className="fact-label">Favourite Animal</div>
                        <div className="fact-value">{student.favourite_animal || '—'}</div>
                    </div>
                </div>

                {/* Hobbies */}
                {student.hobbies && (
                    <div className="detail-section">
                        <h2 className="detail-section-title">⚡ Interests & Hobbies</h2>
                        <p className="detail-section-text">{student.hobbies}</p>
                    </div>
                )}

                {/* Aim */}
                {student.aim_in_life && (
                    <div className="detail-section detail-aim">
                        <h2 className="detail-section-title">🌟 Dream & Aim in Life</h2>
                        <blockquote className="aim-quote">"{student.aim_in_life}"</blockquote>
                    </div>
                )}

                {/* Profile Stats */}
                <div className="detail-section" style={{ textAlign: 'center', marginTop: '40px' }}>
                    <h2 className="detail-section-title" style={{ color: 'var(--color-cyan)', fontSize: '1.4rem' }}>Profile Stats</h2>
                    <StatGraph stats={student.stats} />
                </div>

                <div className="detail-back-link">
                    <Link to="/academy/students">
                        <Button variant="secondary">← Back to Academy</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AcademyStudentDetail
