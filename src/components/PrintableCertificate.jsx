import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableCertificate = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role }

    const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString())
    const [signatory, setSignatory] = useState('The Creator')

    const handlePrint = () => {
        window.print()
    }

    // Background style
    const bgStyle = dreamer.coverImage
        ? { backgroundImage: `linear-gradient(rgba(10,14,26,0.9), rgba(10,14,26,0.9)), url(${dreamer.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};

    return (
        <div className="printable-container preview-mode">
            <div className="printable-content-scroll">
                <div className="certificate-wrapper">
                    <div className="certificate" style={bgStyle}>
                        {/* Decorative Corners */}
                        <div className="cert-corner top-left"></div>
                        <div className="cert-corner top-right"></div>
                        <div className="cert-corner bottom-left"></div>
                        <div className="cert-corner bottom-right"></div>

                        {/* 1. Role Logo Top */}
                        <div className="cert-top-role">
                            <img src={roleObj.image || '/logo.png'} alt="Role" />
                        </div>

                        {/* 2. Text Dreamworld Title */}
                        <div className="cert-title">DreamWorld</div>

                        {/* 3. Certificate of Citizenship */}
                        <div className="cert-subtitle">Certificate of Citizenship</div>

                        {/* 4. Photo (Avatar) */}
                        <img src={dreamer.avatar || '/logo.png'} alt="Dreamer" className="cert-avatar" />

                        {/* 5. Body Text Chain */}
                        <div className="cert-body-compact">
                            <div className="cert-text-line">By the powers vested in the High Council, we hereby recognize and honor</div>

                            <span className="cert-name">{dreamer.name}</span>

                            <div className="cert-text-line">for their dedication and spirit. They are officially inducted into the realm as</div>

                            <strong className="cert-role-text">
                                {roleObj.singular}
                            </strong>
                        </div>

                        {/* Footer: Date & Certified By */}
                        <div className="cert-footer">
                            <div className="sign-box">
                                <div className="sign-label-top">Date of Issue</div>
                                <div className="sign-line">
                                    <input
                                        className="editable-input"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="gold-seal">DW</div>

                            <div className="sign-box">
                                <div className="sign-label-top">Certified by</div>
                                <div className="sign-line">
                                    <input
                                        className="editable-input"
                                        value={signatory}
                                        onChange={(e) => setSignatory(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side: Cover Background + Role Image Only */}
                <div className="certificate-wrapper">
                    <div className="certificate back" style={bgStyle}>
                        <div className="cert-back-content">
                            <img src={roleObj.image || '/logo.png'} alt="Role" className="cert-back-role-img" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <div style={{ color: 'white', fontWeight: 'bold' }}>CERTIFICATE PREVIEW</div>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print</button>
            </div>
        </div>
    )
}

export default PrintableCertificate
