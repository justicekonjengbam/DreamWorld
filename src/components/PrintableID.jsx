import React from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableID = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const [validTill, setValidTill] = React.useState('2026')

    // Find the full role object to get the image
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role, image: '', description: '' }

    // Fallback bio if none provided
    const bio = dreamer.bio || roleObj.description || "A dedicated dreamer exploring the wonders of this world."

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="printable-container preview-mode">
            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print ID Card</button>
            </div>

            <div className="printable-content-scroll">
                {/* FRONT SIDE */}
                <div className="id-card-wrapper">
                    <div className="card-label">FRONT</div>
                    <div className="id-card front">
                        <div className="id-photo-section">
                            <img
                                src={dreamer.avatar || roleObj.image || '/logo.png'}
                                alt="Profile"
                                className="id-photo"
                                onError={(e) => { e.target.src = '/logo.png' }}
                            />
                            <div className="id-role-icon">🌟</div>
                        </div>

                        <div className="id-info-section">
                            <div className="id-header">
                                <div className="id-title">DreamWorld Citizenship</div>
                                <div className="id-name">{dreamer.name}</div>
                            </div>

                            <div className="id-details">
                                <div>Role: <span className="id-role-name">{roleObj.singular}</span></div>
                                <div>ID: #{dreamer.id ? dreamer.id.substring(0, 8).toUpperCase() : 'UNKNOWN'}</div>
                                <div className="id-bio">"{bio}"</div>
                            </div>

                            <div className="id-footer">
                                AUTHORIZED DREAMER • VALID <input className="editable-date" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className="id-card-wrapper">
                    <div className="card-label">BACK</div>
                    <div className="id-card back">
                        <div className="id-back-content">
                            <img src={roleObj.image || '/logo.png'} alt="Role" className="id-back-role-img" />
                            <div className="id-back-text">{roleObj.singular}</div>
                            <div className="id-back-sub">DreamWorld</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableID
