import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableCertificate = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role }

    const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString())
    const [signatory, setSignatory] = useState('The High Council')

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="printable-container preview-mode">
            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <div style={{ color: 'white', fontWeight: 'bold' }}>CERTIFICATE PREVIEW</div>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print</button>
            </div>

            <div className="printable-content-scroll">
                <div className="certificate-wrapper">
                    <div className="certificate">
                        {/* Decorative Corners */}
                        <div className="cert-corner top-left"></div>
                        <div className="cert-corner top-right"></div>
                        <div className="cert-corner bottom-left"></div>
                        <div className="cert-corner bottom-right"></div>

                        <img src="/logo.png" alt="DW" className="cert-logo" />

                        <div className="cert-title">DreamWorld</div>
                        <div className="cert-subtitle">Certificate of Citizenship</div>

                        <div className="cert-body">
                            By the powers vested in the High Council, we hereby recognize and honor
                            <span className="cert-name">{dreamer.name}</span>
                            for their dedication and spirit. They are officially inducted into the realm as a
                            <br /><br />
                            <strong style={{ color: '#FFD700', fontSize: '1.8rem', textTransform: 'uppercase' }}>
                                {roleObj.singular}
                            </strong>
                        </div>

                        <div className="cert-footer">
                            <div className="sign-box">
                                <div className="sign-line">
                                    <input
                                        className="editable-input"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                    />
                                </div>
                                <div className="sign-label">Date of Issue</div>
                            </div>

                            <div className="gold-seal">DW</div>

                            <div className="sign-box">
                                <div className="sign-line">
                                    <input
                                        className="editable-input"
                                        value={signatory}
                                        onChange={(e) => setSignatory(e.target.value)}
                                    />
                                </div>
                                <div className="sign-label">Authorization</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableCertificate
