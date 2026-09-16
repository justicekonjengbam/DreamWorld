import { useState, useRef, useEffect } from 'react'
import Button from './Button'
import './ImageUpload.css'

function ImageUpload({ onUploadComplete, label, defaultImage, folder = 'dreamworld' }) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(defaultImage)
    const [mode, setMode] = useState('file') // 'file' or 'url'
    const [urlInput, setUrlInput] = useState('')
    const fileInputRef = useRef(null)

    // Sync preview if defaultImage changes from outside (e.g. on Edit)
    useEffect(() => {
        setPreview(defaultImage)
    }, [defaultImage])

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Preview and save locally via FileReader immediately
        const reader = new FileReader()
        reader.onloadend = async () => {
            const dataUrl = reader.result
            setPreview(dataUrl)
            onUploadComplete(dataUrl)

            // Try Cloudinary upload if configured, to get a persistent CDN URL
            if (cloudName && uploadPreset) {
                setUploading(true)
                try {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('upload_preset', uploadPreset)
                    formData.append('folder', folder)

                    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: 'POST',
                        body: formData
                    })
                    const data = await res.json()
                    if (data.secure_url) {
                        onUploadComplete(data.secure_url)
                        setPreview(data.secure_url)
                    }
                } catch (err) {
                    console.warn('Cloudinary upload skipped, using local image data:', err)
                } finally {
                    setUploading(false)
                }
            }
        }
        reader.readAsDataURL(file)
    }

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            setPreview(urlInput.trim())
            onUploadComplete(urlInput.trim())
        }
    }

    const handleClear = () => {
        setPreview('')
        setUrlInput('')
        onUploadComplete('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="image-upload-wrapper">
            {label && <label className="upload-label">{label}</label>}

            <div className="upload-container">
                <div className="preview-box">
                    {preview ? (
                        <img src={preview} alt="Preview" className="upload-preview" />
                    ) : (
                        <div className="preview-placeholder">📷 No Photo</div>
                    )}
                    {uploading && <div className="upload-overlay">⌛</div>}
                </div>

                <div className="upload-actions" style={{ flex: 1 }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    
                    {mode === 'file' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <Button
                                    type="button"
                                    variant="primary"
                                    size="small"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    📁 {preview ? 'Change Photo from Device' : 'Upload Photo from Device'}
                                </Button>
                                {preview && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        style={{
                                            background: 'rgba(255, 80, 80, 0.2)',
                                            border: '1px solid rgba(255, 80, 80, 0.4)',
                                            color: '#ff7777',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.78rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {preview && !uploading && (
                                    <span className="upload-success" style={{ margin: 0, fontSize: '0.78rem', color: '#6effaa' }}>
                                        ✓ Photo attached
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setMode('url')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-primary)',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        padding: 0
                                    }}
                                >
                                    Or paste image URL
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <input
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        fontSize: '0.82rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleUrlSubmit}
                                    style={{
                                        background: 'var(--color-primary)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Set
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMode('file')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: 0,
                                    textAlign: 'left'
                                }}
                            >
                                ← Switch to device file upload
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
