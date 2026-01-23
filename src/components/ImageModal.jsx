import { useEffect } from 'react'
import './ImageModal.css'

function ImageModal({ src, alt, isOpen, onClose }) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                <button className="image-modal-close" onClick={onClose}>×</button>
                <img src={src} alt={alt} className="image-modal-img" />
            </div>
        </div>
    )
}

export default ImageModal
