import { useState, useRef } from 'react'
import Button from './Button'
import './ImageUpload.css'

function ImageUpload({ onUploadComplete, label, defaultImage, folder = 'dreamworld' }) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(defaultImage)
    const fileInputRef = useRef(null)

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Preview locally first
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)

        setUploading(true)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)
        formData.append('folder', folder)

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            })

            const data = await res.json()
            if (data.secure_url) {
                onUploadComplete(data.secure_url)
                setPreview(data.secure_url)
            } else {
                alert('Upload failed. Check your Cloudinary settings.')
            }
        } catch (err) {
            console.error('Upload Error:', err)
            alert('Error connecting to Cloudinary.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="image-upload-wrapper">
            {label && <label className="upload-label">{label}</label>}

            <div className="upload-container">
                <div className="preview-box">
                    {preview ? (
                        <img src={preview} alt="Preview" className="upload-preview" />
                    ) : (
                        <div className="preview-placeholder">No Image</div>
                    )}
                    {uploading && <div className="upload-overlay">⌛</div>}
                </div>

                <div className="upload-actions">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Choose Photo'}
                    </Button>
                    {preview && !uploading && (
                        <p className="upload-success">✅ Ready to save</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
