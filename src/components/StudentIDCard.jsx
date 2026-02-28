import { useState } from 'react'
import './Printables.css'

const StudentIDCard = ({ student, onClose }) => {
    const [validTill, setValidTill] = useState('2026')
    const [activeSide, setActiveSide] = useState('front')

    const [editableDream, setEditableDream] = useState(student.aim_in_life || 'A young dreamer forging their destiny.')

    const handlePrint = () => window.print()

    const cardStyle = student.cover_image
        ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${student.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: 'linear-gradient(135deg, #0d1b3e, #1a3a5c)' }

    return (
        <div className="printable-container preview-mode">
            <div className="printable-content-scroll">
                {activeSide === 'front' ? (
                    <div className="id-card-wrapper">
                        <div className="card-label">Front Side Preview</div>
                        <div className="id-card front" style={cardStyle}>
                            <div className="id-topbar" style={{ background: 'linear-gradient(90deg, #1a3a5c, #2e6b9e)' }}>
                                DREAMWORLD ACADEMY — STUDENT ID
                            </div>
                            <div className="id-main">
                                <div className="id-photo-section">
                                    <div className="id-photo-frame" style={{ borderColor: '#4CA1AF' }}>
                                        <img
                                            src={student.avatar || '/DreamWorldAcademy.png'}
                                            alt="Student"
                                            className="id-photo"
                                            onError={(e) => { e.target.src = '/DreamWorldAcademy.png' }}
                                        />
                                    </div>
                                </div>
                                <div className="id-info-section">
                                    <div className="id-header">
                                        <div className="id-brand" style={{ color: '#7ec8e3' }}>ACADEMY</div>
                                        <div className="id-name">{student.name}</div>
                                    </div>
                                    <div className="id-body">
                                        <div className="id-role-text" style={{ color: '#a8d8ea' }}>
                                            {student.class}{student.school_name ? ` · ${student.school_name}` : ''}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: '#ccc', margin: '4px 0' }}>
                                            🎨 {student.favourite_colour} &nbsp;|&nbsp; 🐾 {student.favourite_animal}
                                        </div>
                                        <textarea
                                            className="editable-bio-input"
                                            value={editableDream}
                                            onChange={(e) => setEditableDream(e.target.value)}
                                            rows="2"
                                            placeholder="Dream / Aim..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="id-footer-strip" style={{ background: 'linear-gradient(90deg, #1a3a5c, #2e6b9e)' }}>
                                VALID UNTIL{' '}
                                <input
                                    className="editable-date"
                                    value={validTill}
                                    onChange={(e) => setValidTill(e.target.value)}
                                />
                                &nbsp;· DreamWorld Academy
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="id-card-wrapper">
                        <div className="card-label">Back Side Preview</div>
                        <div className="id-card back" style={cardStyle}>
                            <div className="id-back-overlay">
                                <img
                                    src="/DreamWorldAcademy.png"
                                    alt="Academy"
                                    className="id-back-role-large"
                                    style={{ opacity: 0.25 }}
                                />
                                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '20px' }}>
                                    <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#a8d8ea', marginBottom: '12px' }}>
                                        "Every great dreamer was once a student who dared to imagine."
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#ccc' }}>dreamworld.example.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <div className="side-selectors">
                    <button
                        className={`side-btn ${activeSide === 'front' ? 'active' : ''}`}
                        onClick={() => setActiveSide('front')}
                    >Front Side</button>
                    <button
                        className={`side-btn ${activeSide === 'back' ? 'active' : ''}`}
                        onClick={() => setActiveSide('back')}
                    >Back Side</button>
                </div>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print Active Side</button>
            </div>
        </div>
    )
}

export default StudentIDCard
