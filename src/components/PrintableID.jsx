import React from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableID = ({ dreamer, onClose }) => {
    const { roles } = useContent()

    // Find the full role object to get the image
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role, image: '', description: '' }

    // Fallback bio if none provided
    const bio = dreamer.bio || roleObj.description || "A dedicated dreamer exploring the wonders of this world."

    return (
        <div className="printable-container preview-mode">
            <button className="close-preview-btn" onClick={onClose}>Close Preview</button>

            <div className="id-card">
                <div className="id-photo-section">
                    {/* Use role image if personal photo is not available (assuming we might add user avatars later) */}
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
                        AUTHORIZED DREAMER • VALID 2026
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableID
