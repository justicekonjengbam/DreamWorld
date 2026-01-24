import React from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableCertificate = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role }

    const [issueDate, setIssueDate] = React.useState(new Date().toLocaleDateString())
    const [signatory, setSignatory] = React.useState('The Council')

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="printable-container preview-mode">
            <div className="printable-toolbar">
                <button className="toolbar-btn close-btn" onClick={onClose}>❌ Close</button>
                <button className="toolbar-btn print-btn" onClick={handlePrint}>🖨️ Print Certificate</button>
            </div>

            <div className="certificate-wrapper">
                <div className="certificate">
                    <div className="certificate-border-inner"></div>

                    <div className="cert-header">Certificate of Citizenship</div>
                    <div className="cert-subheader">This document hereby certifies that</div>

                    <div className="cert-body">
                        <span className="cert-name">{dreamer.name}</span>
                        has been officially recognized as a
                        <br />
                        <span className="cert-role">{roleObj.singular}</span>
                        <br />
                        in the realm of DreamWorld.
                    </div>

                    <div className="cert-footer">
                        <div className="signature-block">
                            <input
                                className="editable-input"
                                value={signatory}
                                onChange={(e) => setSignatory(e.target.value)}
                            />
                            <p>Governing Body</p>
                        </div>

                        <div className="seal">DW</div>

                        <div className="signature-block">
                            <input
                                className="editable-input"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                            />
                            <p>Date of Issue</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableCertificate
