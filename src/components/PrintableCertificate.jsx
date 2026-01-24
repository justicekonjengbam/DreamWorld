import React from 'react'
import { useContent } from '../context/ContentContext'
import './Printables.css'

const PrintableCertificate = ({ dreamer, onClose }) => {
    const { roles } = useContent()
    const roleObj = roles.find(r => r.id === dreamer.role) || { singular: dreamer.role }

    return (
        <div className="printable-container preview-mode">
            <button className="close-preview-btn" onClick={onClose}>Close Preview</button>

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
                        <h3>The Council</h3>
                        <p>Governing Body</p>
                    </div>

                    <div className="seal">DW</div>

                    <div className="signature-block">
                        <h3>{new Date().toLocaleDateString()}</h3>
                        <p>Date of Issue</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrintableCertificate
