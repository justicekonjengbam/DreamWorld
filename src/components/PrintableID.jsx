import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableID = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const [validTill, setValidTill] = useState('2026')

    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role, image: '', description: '' }

    // Truncate Bio helper
    const truncate = (str, n) => {
        return (str?.length > n) ? str.substr(0, n - 1) + '...' : str;
    }

    const bio = truncate(dreamer.bio || roleObj.description || "A dedicated dreamer exploring the wonders of this world.", 80)

    const handlePrint = () => {
        window.print()
    }

    // Dynamic background style from cover image
    const cardStyle = dreamer.coverImage
        ? { backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.5)), url(${dreamer.coverImage})`, backgroundSize: 'cover' }
        : {};

    return (
        <div className="printable-container preview-mode">
            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <div style={{ color: 'white', fontWeight: 'bold' }}>ID PREVIEW</div>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print</button>
            </div>

            <div className="printable-content-scroll">
                {/* FRONT */}
                <div className="id-card-wrapper">
                    <div className="card-label">FRONT CARD</div>
                    <div className="id-card front" style={cardStyle}>
                        <div className="id-sidebar">
                            <div className="id-sidebar-text">DREAMWORLD ID</div>
                        </div>
                        <div className="id-main" style={{ background: 'rgba(10, 14, 26, 0.7)' }}>
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
                                    <div className="id-role">{roleObj.singular}</div>
                                    <div className="id-id">#{dreamer.id ? dreamer.id.substring(0, 6).toUpperCase() : '0000'}</div>
                                    <div className="id-bio">"{bio}"</div>
                                </div>
                            </div>
                        </div>
                        <div className="id-footer-strip">
                            VALID UNTIL <input className="editable-date" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div className="id-card-wrapper">
                    <div className="card-label">BACK CARD</div>
                    <div className="id-card back">
                        <img src="/logo.png" alt="DreamWorld" className="id-back-logo" />
                        <div className="id-back-role-large">{roleObj.singular}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableID
