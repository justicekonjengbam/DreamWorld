import { useState, useEffect } from 'react'
import { useContent } from '../../context/ContentContext'
import Card from '../../components/Card'
import Button from '../../components/Button'
import './ManageSponsorships.css'

function ManageSponsorships() {
    const {
        sponsorships,
        addSponsorship,
        updateSponsorship,
        completeSponsorship,
        deleteSponsorship,
        fetchSponsorships
    } = useContent()

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        type: 'quest',
        name: '',
        description: '',
        amountNeeded: ''
    })

    const [completionModal, setCompletionModal] = useState(null)
    const [completionData, setCompletionData] = useState({
        completionImages: [],
        completionNote: ''
    })

    useEffect(() => {
        fetchSponsorships()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (editingId) {
            await updateSponsorship(editingId, formData)
        } else {
            await addSponsorship(formData)
        }

        setShowModal(false)
        setEditingId(null)
        setFormData({ type: 'quest', name: '', description: '', amountNeeded: '' })
    }

    const handleEdit = (sponsorship) => {
        setEditingId(sponsorship.id)
        setFormData({
            type: sponsorship.type,
            name: sponsorship.name,
            description: sponsorship.description,
            amountNeeded: sponsorship.amountNeeded
        })
        setShowModal(true)
    }

    const handleComplete = async (id) => {
        await completeSponsorship(id, completionData)
        setCompletionModal(null)
        setCompletionData({ completionImages: [], completionNote: '' })
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this sponsorship?')) {
            await deleteSponsorship(id)
        }
    }

    const handleImageUpload = async (e, sponsorship) => {
        const files = Array.from(e.target.files)
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`

        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

                const response = await fetch(cloudinaryUrl, {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                return data.secure_url
            })

            const imageUrls = await Promise.all(uploadPromises)
            const currentGallery = sponsorship.galleryImages || []

            await updateSponsorship(sponsorship.id, {
                galleryImages: [...currentGallery, ...imageUrls]
            })
        } catch (error) {
            alert('Failed to upload images: ' + error.message)
        }
    }

    const activeSponsors = sponsorships.filter(s => s.status === 'active')
    const completedSponsors = sponsorships.filter(s => s.status === 'completed')

    return (
        <div className="manage-sponsorships page">
            <div className="container">
                <div className="page-header">
                    <h1>Manage Quest & Event Sponsorships</h1>
                    <Button onClick={() => setShowModal(true)} variant="primary">
                        + Add New Sponsorship
                    </Button>
                </div>

                {/* Active Sponsorships */}
                <section>
                    <h2>🎯 Active Sponsorships</h2>
                    {activeSponsors.length === 0 ? (
                        <p style={{ opacity: 0.6 }}>No active sponsorships yet. Add one to get started!</p>
                    ) : (
                        <div className="sponsorships-grid">
                            {activeSponsors.map(sp => (
                                <Card key={sp.id} className="sponsorship-card">
                                    <div className="sp-header">
                                        <span className="sp-type">{sp.type === 'quest' ? '🎯' : '📅'} {sp.type}</span>
                                        <h3>{sp.name}</h3>
                                    </div>

                                    <p className="sp-description">{sp.description}</p>

                                    <div className="sp-progress">
                                        <div className="sp-amounts">
                                            <span className="raised">₹{sp.amountRaised || 0}</span>
                                            <span className="needed">/ ₹{sp.amountNeeded}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${Math.min((parseFloat(sp.amountRaised || 0) / parseFloat(sp.amountNeeded)) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="progress-percent">
                                            {Math.round((parseFloat(sp.amountRaised || 0) / parseFloat(sp.amountNeeded)) * 100)}% funded
                                        </span>
                                    </div>

                                    {sp.galleryImages && sp.galleryImages.length > 0 && (
                                        <div className="sp-gallery-preview">
                                            {sp.galleryImages.slice(0, 3).map((img, idx) => (
                                                <img key={idx} src={img} alt={`Gallery ${idx + 1}`} />
                                            ))}
                                        </div>
                                    )}

                                    <div className="sp-actions">
                                        <label className="upload-btn">
                                            📸 Add Photos
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, sp)}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <Button variant="secondary" onClick={() => handleEdit(sp)}>Edit</Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => setCompletionModal(sp.id)}
                                        >
                                            Mark Complete
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(sp.id)}>Delete</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* Completed Sponsorships */}
                {completedSponsors.length > 0 && (
                    <section style={{ marginTop: '60px' }}>
                        <h2>✅ Completed Sponsorships</h2>
                        <div className="sponsorships-grid">
                            {completedSponsors.map(sp => (
                                <Card key={sp.id} className="sponsorship-card completed">
                                    <div className="sp-header">
                                        <span className="sp-type">{sp.type === 'quest' ? '🎯' : '📅'} {sp.type}</span>
                                        <h3>{sp.name}</h3>
                                        <span className="completed-badge">✓ COMPLETED</span>
                                    </div>

                                    <p className="sp-description">{sp.description}</p>
                                    <p className="completion-note"><strong>Impact:</strong> {sp.completionNote}</p>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                        Completed: {sp.dateCompleted}
                                    </p>

                                    {sp.completionImages && sp.completionImages.length > 0 && (
                                        <div className="completion-images">
                                            {sp.completionImages.map((img, idx) => (
                                                <img key={idx} src={img} alt={`Completion ${idx + 1}`} />
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingId ? 'Edit' : 'Add New'} Sponsorship</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        required
                                    >
                                        <option value="quest">Quest</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g., Science Workshop"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description:</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        placeholder="What is this for?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Amount Needed (₹):</label>
                                    <input
                                        type="number"
                                        value={formData.amountNeeded}
                                        onChange={(e) => setFormData({ ...formData, amountNeeded: e.target.value })}
                                        required
                                        min="1"
                                        placeholder="5000"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        {editingId ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Completion Modal */}
                {completionModal && (
                    <div className="modal-overlay" onClick={() => setCompletionModal(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Mark as Completed</h2>
                            <div className="form-group">
                                <label>Completion Note (Impact/Results):</label>
                                <textarea
                                    value={completionData.completionNote}
                                    onChange={(e) => setCompletionData({ ...completionData, completionNote: e.target.value })}
                                    rows="3"
                                    placeholder="e.g., Built 3 classrooms, served 200 students"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <Button variant="secondary" onClick={() => setCompletionModal(null)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={() => handleComplete(completionModal)}>
                                    Complete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageSponsorships
