import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableID = ({ dreamer, onClose, readOnly = false }) => {
    const { roles } = useContent()
    const [validTill, setValidTill] = useState('2026')
    const [activeSide, setActiveSide] = useState('front') // 'front' or 'back'

    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role, image: '', description: '' }

    const initialBio = dreamer.bio || roleObj.description || "A dedicated dreamer exploring the wonders of this world."
    const [editableBio, setEditableBio] = useState(initialBio)

    const handlePrint = () => {
        window.print()
    }

    const cardStyle = dreamer.coverImage
        ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${dreamer.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: '#1a1f35' };

    return (
        <div className="printable-container preview-mode">
            <div className="printable-content-scroll">

                {activeSide === 'front' ? (
                    <div className="id-card-wrapper">
                        <div className="card-label">Front Side Preview</div>
                        <div className="id-card front" style={cardStyle}>
                            <div className="id-topbar">DREAMWORLD ID</div>
                            <div className="id-main">
                                <div className="id-photo-section">
                                    <div className="id-photo-frame">
                                        <img
                                            src={dreamer.avatar || roleObj.image || '/logo.png'}
                                            alt="Profile"
                                            className="id-photo"
                                            onError={(e) => { e.target.src = '/logo.png' }}
                                        />
                                    </div>
                                </div>
                                <div className="id-info-section">
                                    <div className="id-header">
                                        <div className="id-brand">DW ACCESS</div>
                                        <div className="id-name">{dreamer.name}</div>
                                    </div>
                                    <div className="id-body">
                                        <div className="id-role-text">{roleObj.singular}</div>
                                        {readOnly
                                            ? <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, margin: 0 }}>{editableBio}</p>
                                            : <textarea className="editable-bio-input" value={editableBio} onChange={(e) => setEditableBio(e.target.value)} rows="3" />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="id-footer-strip">
                                VALID UNTIL {readOnly
                                    ? <span style={{ marginLeft: 6, fontWeight: 700 }}>{validTill}</span>
                                    : <input className="editable-date" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="id-card-wrapper">
                        <div className="card-label">Back Side Preview</div>
                        <div className="id-card back" style={cardStyle}>
                            <div className="id-back-overlay">
                                <img src={roleObj.image || '/logo.png'} alt="Role" className="id-back-role-large" />
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
                    >
                        Front Side
                    </button>
                    <button
                        className={`side-btn ${activeSide === 'back' ? 'active' : ''}`}
                        onClick={() => setActiveSide('back')}
                    >
                        Back Side
                    </button>
                </div>

                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print Active Side</button>
            </div>
        </div>
    )
}

export default PrintableID
