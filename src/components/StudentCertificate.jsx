import { useState } from 'react'
import './Printables.css'

const StudentCertificate = ({ student, onClose }) => {
    const [activeSide, setActiveSide] = useState('front')
    const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString())
    const [signatory, setSignatory] = useState('The Headmaster')

    const handlePrint = () => window.print()

    const bgStyle = student.cover_image
        ? { backgroundImage: `linear-gradient(rgba(8,18,40,0.88), rgba(8,18,40,0.88)), url(${student.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: 'linear-gradient(135deg, #08122e, #0d2040)' }

    return (
        <div className="printable-container preview-mode">
            <div className="printable-content-scroll">
                {activeSide === 'front' ? (
                    <div className="certificate-wrapper">
                        <div className="card-label">Front Side Preview</div>
                        <div className="certificate" style={bgStyle}>
                            <div className="cert-corner top-left" style={{ borderColor: '#4CA1AF' }} />
                            <div className="cert-corner top-right" style={{ borderColor: '#4CA1AF' }} />
                            <div className="cert-corner bottom-left" style={{ borderColor: '#4CA1AF' }} />
                            <div className="cert-corner bottom-right" style={{ borderColor: '#4CA1AF' }} />

                            <div className="cert-top-role">
                                <img src="/DreamWorldAcademy.png" alt="Academy Badge" />
                            </div>
                            <div className="cert-title" style={{ color: '#7ec8e3' }}>DreamWorld Academy</div>
                            <div className="cert-subtitle">Certificate of Enrollment</div>

                            <img
                                src={student.avatar || '/DreamWorldAcademy.png'}
                                alt={student.name}
                                className="cert-avatar"
                                onError={(e) => { e.target.src = '/DreamWorldAcademy.png' }}
                            />

                            <div className="cert-body-compact">
                                <div className="cert-text-line">
                                    By the authority of the High Council of DreamWorld, we hereby welcome and honor
                                </div>
                                <span className="cert-name">{student.name}</span>
                                <div className="cert-text-line">
                                    as an official student of the Academy. A young dreamer of {student.class}{student.school_name ? ` from ${student.school_name}` : ''}, whose aim is:
                                </div>
                                <strong className="cert-role-text" style={{ fontSize: '0.85rem', color: '#a8d8ea', fontStyle: 'italic', fontWeight: 'normal' }}>
                                    "{student.aim_in_life}"
                                </strong>
                            </div>

                            <div className="cert-footer">
                                <div className="sign-box">
                                    <div className="sign-label-top">Date of Enrollment</div>
                                    <div className="sign-line">
                                        <input
                                            className="editable-input"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="gold-seal" style={{ background: 'linear-gradient(135deg, #4CA1AF, #2e6b9e)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>DWA</div>
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
                ) : (
                    <div className="certificate-wrapper">
                        <div className="card-label">Back Side Preview</div>
                        <div className="certificate back" style={bgStyle}>
                            <div className="cert-back-content">
                                <img
                                    src="/DreamWorldAcademy.png"
                                    alt="Academy"
                                    className="cert-back-role-img"
                                    style={{ opacity: 0.2 }}
                                />
                                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', marginTop: '-60px' }}>
                                    <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#a8d8ea' }}>
                                        "The greatest adventure begins with a single dream."
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#7ec8e3', marginTop: '12px', letterSpacing: '2px' }}>
                                        DREAMWORLD ACADEMY
                                    </p>
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

export default StudentCertificate
