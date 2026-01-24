import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableCertificate = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const [activeSide, setActiveSide] = useState('front') // 'front' or 'back'
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role }

    const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString())
    const [signatory, setSignatory] = useState('The Creator')

    const handlePrint = () => {
        window.print()
    }

    const bgStyle = dreamer.coverImage
        ? { backgroundImage: `linear-gradient(rgba(10,14,26,0.85), rgba(10,14,26,0.85)), url(${dreamer.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: '#0a0e1a' };

    return (
        <div className="printable-container preview-mode">
            <div className="printable-content-scroll">

                {activeSide === 'front' ? (
                    <div className="certificate-wrapper">
                        <div className="card-label">Front Side Preview</div>
                        <div className="certificate" style={bgStyle}>
                            <div className="cert-corner top-left"></div>
                            <div className="cert-corner top-right"></div>
                            <div className="cert-corner bottom-left"></div>
                            <div className="cert-corner bottom-right"></div>

                            <div className="cert-top-role">
                                <img src={roleObj.image || '/logo.png'} alt="Role" />
                            </div>
                            <div className="cert-title">DreamWorld</div>
                            <div className="cert-subtitle">Certificate of Citizenship</div>
                            <img src={dreamer.avatar || '/logo.png'} alt="Dreamer" className="cert-avatar" />

                            <div className="cert-body-compact">
                                <div className="cert-text-line">By the powers vested in the High Council, we hereby recognize and honor</div>
                                <span className="cert-name">{dreamer.name}</span>
                                <div className="cert-text-line">for their dedication and spirit. They are officially inducted into the realm as</div>
                                <strong className="cert-role-text">{roleObj.singular}</strong>
                            </div>

                            <div className="cert-footer">
                                <div className="sign-box">
                                    <div className="sign-label-top">Date of Issue</div>
                                    <div className="sign-line">
                                        <input className="editable-input" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="gold-seal">DW</div>
                                <div className="sign-box">
                                    <div className="sign-label-top">Certified by</div>
                                    <div className="sign-line">
                                        <input className="editable-input" value={signatory} onChange={(e) => setSignatory(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="certificate-wrapper">
                        <div className="card-label">Back Side Preview</div>
                        <div className="certificate back" style={bgStyle}>
                            <div className="cert-back-content">
                                <img src={roleObj.image || '/logo.png'} alt="Role" className="cert-back-role-img" />
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

export default PrintableCertificate
