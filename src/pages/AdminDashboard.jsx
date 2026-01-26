import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import ImageUpload from '../components/ImageUpload'
import Avatar from '../components/Avatar'
import PrintableID from '../components/PrintableID'
import PrintableCertificate from '../components/PrintableCertificate'
import './AdminDashboard.css'

function AdminDashboard() {
    const navigate = useNavigate()
    const {
        loading,
        quests, addQuest, updateQuest, deleteQuest,
        roles, addRole, updateRole, deleteRole,
        characters, addCharacter, updateCharacter, deleteCharacter,
        events, addEvent, updateEvent, deleteEvent,
        announcement, updateAnnouncement,
        syncGlobalData
    } = useContent()

    const [syncing, setSyncing] = useState(false)

    if (loading) return <div className="loading-state">Syncing Dashboard with Google Sheets...</div>

    const [activeTab, setActiveTab] = useState('announcement')

    // Form States
    const [announcementFormData, setAnnouncementFormData] = useState(announcement)
    const [questFormData, setQuestFormData] = useState({
        title: '', purpose: '', difficulty: 'easy', timeNeeded: '', steps: '', impact: '', sharePrompt: '',
        needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
    })
    const [roleFormData, setRoleFormData] = useState({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '' })
    const [memberFormData, setMemberFormData] = useState({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '' })
    const [eventFormData, setEventFormData] = useState({
        title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '',
        needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
    })

    const [editingId, setEditingId] = useState(null)
    const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false)
    const [sheetData, setSheetData] = useState(null)

    // Printing State
    const [printingDreamer, setPrintingDreamer] = useState(null)
    const [printType, setPrintType] = useState(null) // 'id' or 'cert'

    useEffect(() => {
        const token = localStorage.getItem('dw_admin_token')
        if (!token) navigate('/admin')
    }, [navigate])

    // Update form states when context data is loaded
    useEffect(() => {
        if (!loading && announcement) {
            setAnnouncementFormData(announcement)
        }
    }, [loading, announcement])

    // Live check for Google Sheets data (Layer 2)
    useEffect(() => {
        if (activeTab === 'status') {
            const checkSheet = async () => {
                const sheetApiUrl = import.meta.env.VITE_SHEET_API_URL;
                if (!sheetApiUrl) return;
                try {
                    const res = await fetch(`${sheetApiUrl}?sheet=announcements`);
                    if (!res.ok) throw new Error('API Error');
                    const data = await res.json();

                    if (Array.isArray(data) && data.length > 0) {
                        const rawRow = data[0];
                        // Normalize keys for the summary
                        const normalized = {};
                        Object.keys(rawRow).forEach(k => { normalized[k.toLowerCase().trim()] = rawRow[k] });

                        setSheetData({
                            summary: normalized,
                            rawKeys: Object.keys(rawRow),
                            count: data.length
                        });
                    } else {
                        setSheetData({ count: 0 });
                    }
                } catch (e) {
                    setSheetData('error');
                }
            };
            checkSheet();
        }
    }, [activeTab])

    const handleLogout = () => {
        localStorage.removeItem('dw_admin_token')
        navigate('/admin')
    }

    const handleSync = async () => {
        const pass = sessionStorage.getItem('dw_admin_pass')
        if (!pass) {
            alert('Session expired. Please log in again.')
            handleLogout()
            return
        }

        setSyncing(true)
        try {
            const result = await syncGlobalData(pass)
            const { details } = result
            setHasUnsyncedChanges(false)
            alert(`✅ Global Sync Successful! \n\nSynced:\n- ${details.quests} Quests\n- ${details.roles} Roles\n- ${details.members} Dreamers\n- ${details.events} Events\n\nLast Synced: ${new Date(result.lastSynced).toLocaleString()}`)
        } catch (error) {
            alert(`❌ Sync Failed: ${error.message}`)
        } finally {
            setSyncing(false)
        }
    }

    const resetForms = () => {
        setEditingId(null)
        setQuestFormData({
            title: '', purpose: '', difficulty: 'easy', timeNeeded: '', steps: '', impact: '', sharePrompt: '',
            needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
        })
        setRoleFormData({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '' })
        setMemberFormData({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '' })
        setEventFormData({
            title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '',
            needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
        })
    }

    // Submit Handlers
    const handleAnnouncementSubmit = (e) => {
        e.preventDefault()
        if (!announcementFormData.title || announcementFormData.title.trim() === '') {
            alert('❌ Please provide a Title for the announcement. It is required for the database.')
            return
        }
        updateAnnouncement(announcementFormData)
        setHasUnsyncedChanges(true)
        alert('Announcement updated! Don\'t forget to click "Sync Global Site" below.')
    }

    const handleQuestSubmit = (e) => {
        e.preventDefault()
        const data = {
            ...questFormData,
            steps: questFormData.steps.split('\n').filter(s => s.trim()),
            amountNeeded: questFormData.needsFunding ? questFormData.amountNeeded.toString() : '0',
            fundingStatus: questFormData.needsFunding ? (questFormData.fundingStatus || 'active') : 'not-funded'
        }
        editingId ? updateQuest(editingId, data) : addQuest(data)
        setHasUnsyncedChanges(true)
        resetForms()
        alert(editingId ? 'Quest updated!' : 'Quest added!')
    }

    const handleRoleSubmit = (e) => {
        e.preventDefault()
        const data = { ...roleFormData, traits: roleFormData.traits.split('\n').filter(t => t.trim()) }
        editingId ? updateRole(editingId, data) : addRole(data)
        setHasUnsyncedChanges(true)
        resetForms()
        alert(editingId ? 'Role updated!' : 'Role added!')
    }

    const handleMemberSubmit = (e) => {
        e.preventDefault()
        console.log('DEBUG - Submitting Member Data:', memberFormData)
        const data = { ...memberFormData, themes: memberFormData.themes.split(',').map(t => t.trim()) }
        editingId ? updateCharacter(editingId, data) : addCharacter(data)
        setHasUnsyncedChanges(true)
        resetForms()
        alert(editingId ? 'Member updated!' : 'Member added!')
    }

    const handleQuestDelete = (id) => { if (window.confirm('Delete this quest?')) { deleteQuest(id); setHasUnsyncedChanges(true) } }
    const handleRoleDelete = (id) => { if (window.confirm('Delete this role?')) { deleteRole(id); setHasUnsyncedChanges(true) } }
    const handleMemberDelete = (id) => { if (window.confirm('Delete this member?')) { deleteCharacter(id); setHasUnsyncedChanges(true) } }
    const handleEventDelete = (id) => {
        if (window.confirm('Delete this event?')) {
            deleteEvent(id);
            setHasUnsyncedChanges(true);
        }
    }

    const handleEventSubmit = (e) => {
        e.preventDefault()
        const data = {
            ...eventFormData,
            amountNeeded: eventFormData.needsFunding ? eventFormData.amountNeeded.toString() : '0',
            fundingStatus: eventFormData.needsFunding ? (eventFormData.fundingStatus || 'active') : 'not-funded'
        }
        editingId ? updateEvent(editingId, data) : addEvent(data)
        setHasUnsyncedChanges(true)
        resetForms()
        alert(editingId ? 'Event updated!' : 'Event added!')
    }

    return (
        <div className="admin-dashboard page">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                    <h3>Admin Panel</h3>
                </div>

                <nav className="admin-nav">
                    <button className={`nav-item ${activeTab === 'announcement' ? 'active' : ''}`} onClick={() => { setActiveTab('announcement'); resetForms() }}>📢 Announcement</button>
                    <button className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`} onClick={() => { setActiveTab('quests'); resetForms() }}>🎯 Quests</button>
                    <button className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => { setActiveTab('roles'); resetForms() }}>🎭 Roles</button>
                    <button className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => { setActiveTab('members'); resetForms() }}>👥 Dreamers</button>
                    <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); resetForms() }}>📅 Events</button>
                    <button className={`nav-item ${activeTab === 'status' ? 'active' : ''}`} onClick={() => { setActiveTab('status'); resetForms() }}>🛡️ System Health</button>
                </nav>

                <div className="sidebar-footer">
                    {hasUnsyncedChanges && (
                        <div className="sync-warning animate-pulse">
                            ⚠️ Changes pending sync
                        </div>
                    )}
                    <button
                        onClick={handleSync}
                        className={`sync-btn ${syncing ? 'syncing' : ''} ${hasUnsyncedChanges ? 'highlight' : ''}`}
                        disabled={syncing}
                    >
                        {syncing ? '⌛ Pulling...' : '⬇️ Pull from Google Sheets'}
                    </button>
                    <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                </div>
            </div>

            <div className="admin-dashboard-content">
                <header className="content-header">
                    <h2>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                </header>

                {activeTab === 'announcement' && (
                    <div className="admin-section animate-fade">
                        <Card className="admin-form-card">
                            <form onSubmit={handleAnnouncementSubmit} className="admin-form">
                                <div className="form-group-full"><label>Title</label><input type="text" value={announcementFormData.title} onChange={(e) => setAnnouncementFormData({ ...announcementFormData, title: e.target.value })} required /></div>
                                <div className="form-group-full"><label>Date Label</label><input type="text" value={announcementFormData.date} onChange={(e) => setAnnouncementFormData({ ...announcementFormData, date: e.target.value })} required /></div>
                                <div className="form-group-full"><label>Content</label><textarea rows="5" value={announcementFormData.content} onChange={(e) => setAnnouncementFormData({ ...announcementFormData, content: e.target.value })} required /></div>
                                <div className="form-row">
                                    <div className="form-group"><label>Button Text</label><input type="text" value={announcementFormData.linkText} onChange={(e) => setAnnouncementFormData({ ...announcementFormData, linkText: e.target.value })} required /></div>
                                    <div className="form-group"><label>Link (URL)</label><input type="text" value={announcementFormData.linkTo} onChange={(e) => setAnnouncementFormData({ ...announcementFormData, linkTo: e.target.value })} required /></div>
                                </div>
                                <Button type="submit" variant="primary">Update Announcement</Button>
                            </form>
                        </Card>
                    </div>
                )}

                {activeTab === 'quests' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            <Card className="admin-form-card">
                                <h3>{editingId ? 'Edit Quest' : 'Add New Quest'}</h3>
                                <form onSubmit={handleQuestSubmit} className="admin-form">
                                    <div className="form-group-full"><label>Title</label><input type="text" value={questFormData.title} onChange={(e) => setQuestFormData({ ...questFormData, title: e.target.value })} required /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Difficulty</label><select value={questFormData.difficulty} onChange={(e) => setQuestFormData({ ...questFormData, difficulty: e.target.value })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                                        <div className="form-group"><label>Time Needed</label><input type="text" value={questFormData.timeNeeded} onChange={(e) => setQuestFormData({ ...questFormData, timeNeeded: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-group-full"><label>Purpose</label><textarea rows="2" value={questFormData.purpose} onChange={(e) => setQuestFormData({ ...questFormData, purpose: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Steps (One per line)</label><textarea rows="4" value={questFormData.steps} onChange={(e) => setQuestFormData({ ...questFormData, steps: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Impact</label><input type="text" value={questFormData.impact} onChange={(e) => setQuestFormData({ ...questFormData, impact: e.target.value })} required /></div>

                                    <div className="funding-setup" style={{ borderTop: '1px solid rgba(76, 161, 175, 0.2)', paddingTop: '15px', marginTop: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={questFormData.needsFunding}
                                                onChange={(e) => setQuestFormData({ ...questFormData, needsFunding: e.target.checked })}
                                            />
                                            <span>Needs Funding?</span>
                                        </label>

                                        {questFormData.needsFunding && (
                                            <div className="form-group-full animate-fade">
                                                <label>Funding Goal (₹)</label>
                                                <input
                                                    type="number"
                                                    value={questFormData.amountNeeded || ''}
                                                    onChange={(e) => setQuestFormData({ ...questFormData, amountNeeded: e.target.value })}
                                                    placeholder="e.g. 5000"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Quest</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {quests.map(q => (
                                    <Card key={q.id} className="admin-item-card">
                                        <div><h4>{q.title}</h4><Badge variant={q.difficulty}>{q.difficulty}</Badge></div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(q.id); setQuestFormData({ ...q, steps: q.steps.join('\n') }) }}>✏️</button>
                                            <button onClick={() => handleQuestDelete(q.id)}>🗑️</button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            <Card className="admin-form-card">
                                <h3>{editingId ? 'Edit Role' : 'Add New Role'}</h3>
                                <form onSubmit={handleRoleSubmit} className="admin-form">
                                    <div className="form-row">
                                        <div className="form-group"><label>Role ID (lower-case)</label><input type="text" value={roleFormData.id} onChange={(e) => setRoleFormData({ ...roleFormData, id: e.target.value })} required /></div>
                                        <div className="form-group"><label>Name (Plural)</label><input type="text" value={roleFormData.name} onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Singular Name</label><input type="text" value={roleFormData.singular} onChange={(e) => setRoleFormData({ ...roleFormData, singular: e.target.value })} required /></div>
                                        <div className="form-group"><label>Brand Color</label><input type="text" value={roleFormData.color} onChange={(e) => setRoleFormData({ ...roleFormData, color: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-group-full">
                                        <label>Image URL (imgURL)</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={roleFormData.image || ''}
                                            onChange={(e) => setRoleFormData({ ...roleFormData, image: e.target.value })}
                                        />
                                        <small style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}>Paste a link here or use the uploader below.</small>
                                    </div>
                                    <ImageUpload
                                        label="Role Icon/Image"
                                        onUploadComplete={(url) => setRoleFormData(prev => ({ ...prev, image: url }))}
                                        defaultImage={roleFormData.image}
                                        folder="roles"
                                    />
                                    <div className="form-group-full"><label>Description</label><textarea rows="3" value={roleFormData.description} onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Traits (One per line)</label><textarea rows="4" value={roleFormData.traits} onChange={(e) => setRoleFormData({ ...roleFormData, traits: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Philosophy</label><textarea rows="3" value={roleFormData.philosophy} onChange={(e) => setRoleFormData({ ...roleFormData, philosophy: e.target.value })} required /></div>
                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Role</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {roles.map(r => (
                                    <Card key={r.id} className="admin-item-card">
                                        <div><h4>{r.name}</h4><Badge>{r.singular}</Badge></div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(r.id); setRoleFormData({ ...r, traits: r.traits.join('\n') }) }}>✏️</button>
                                            <button onClick={() => handleRoleDelete(r.id)}>🗑️</button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            <Card className="admin-form-card">
                                <h3>{editingId ? 'Edit Dreamer' : 'Add New Dreamer'}</h3>
                                <form onSubmit={handleMemberSubmit} className="admin-form">
                                    <div className="form-row">
                                        <div className="form-group"><label>Full Name</label><input type="text" value={memberFormData.name} onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })} required /></div>
                                        <div className="form-group">
                                            <label>Role</label>
                                            <select value={memberFormData.role} onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })} required>
                                                <option value="">Select Role</option>
                                                {roles.map(r => <option key={r.id} value={r.id}>{r.singular}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group-full"><label>Title (e.g. Lead Artist)</label><input type="text" value={memberFormData.title} onChange={(e) => setMemberFormData({ ...memberFormData, title: e.target.value })} required /></div>
                                    <div className="form-row" style={{ gap: '20px' }}>
                                        <ImageUpload
                                            label="Avatar Image"
                                            onUploadComplete={(url) => setMemberFormData(prev => ({ ...prev, avatar: url }))}
                                            defaultImage={memberFormData.avatar}
                                            folder="members"
                                        />
                                        <ImageUpload
                                            label="Cover Image"
                                            onUploadComplete={(url) => setMemberFormData(prev => ({ ...prev, coverImage: url }))}
                                            defaultImage={memberFormData.coverImage}
                                            folder="members/covers"
                                        />
                                    </div>
                                    <div className="admin-member-visual-preview" style={{
                                        margin: '15px 0',
                                        padding: '15px',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)', marginBottom: '5px' }}>Avatar</p>
                                            <Avatar src={memberFormData.avatar} name={memberFormData.name} style={{ width: 60, height: 60, borderRadius: '50%' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)', marginBottom: '5px' }}>Cover Background</p>
                                            <div style={{
                                                height: 60,
                                                width: '100%',
                                                borderRadius: '4px',
                                                backgroundImage: memberFormData.coverImage ? `url("${memberFormData.coverImage}")` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                border: '1px solid rgba(76, 161, 175, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--color-gray)',
                                                fontSize: '0.8rem'
                                            }}>
                                                {!memberFormData.coverImage && 'No Cover'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group-full"><label>Bio</label><textarea rows="3" value={memberFormData.bio} onChange={(e) => setMemberFormData(prev => ({ ...prev, bio: e.target.value }))} required /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>YouTube URL</label><input type="text" placeholder="https://youtube.com/..." value={memberFormData.youtube || ''} onChange={(e) => setMemberFormData(prev => ({ ...prev, youtube: e.target.value }))} /></div>
                                        <div className="form-group"><label>Instagram URL</label><input type="text" placeholder="https://instagram.com/..." value={memberFormData.instagram || ''} onChange={(e) => setMemberFormData(prev => ({ ...prev, instagram: e.target.value }))} /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Facebook URL</label><input type="text" placeholder="https://facebook.com/..." value={memberFormData.facebook || ''} onChange={(e) => setMemberFormData(prev => ({ ...prev, facebook: e.target.value }))} /></div>
                                        <div className="form-group"><label>Twitter URL</label><input type="text" placeholder="https://twitter.com/..." value={memberFormData.twitter || ''} onChange={(e) => setMemberFormData(prev => ({ ...prev, twitter: e.target.value }))} /></div>
                                    </div>
                                    <div className="form-group-full"><label>Themes (Comma separated)</label><input type="text" placeholder="Future, Solar, Community" value={memberFormData.themes} onChange={(e) => setMemberFormData(prev => ({ ...prev, themes: e.target.value }))} required /></div>
                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Dreamer</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {characters.map(c => (
                                    <Card key={c.id} className="admin-item-card">
                                        <div className="admin-member-preview">
                                            <Avatar
                                                src={c.avatar}
                                                name={c.name}
                                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                                            />
                                            <div><h4>{c.name}</h4><Badge>{c.role}</Badge></div>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => {
                                                setEditingId(c.id);
                                                setMemberFormData({
                                                    ...c,
                                                    themes: Array.isArray(c.themes) ? c.themes.join(', ') : (c.themes || ''),
                                                    youtube: c.socials?.youtube || '',
                                                    instagram: c.socials?.instagram || '',
                                                    facebook: c.socials?.facebook || '',
                                                    twitter: c.socials?.twitter || ''
                                                })
                                            }}>✏️</button>
                                            <button onClick={() => handleMemberDelete(c.id)}>🗑️</button>
                                            <button
                                                className="print-btn"
                                                onClick={() => { setPrintingDreamer(c); setPrintType('id'); }}
                                                title="Generate ID Card"
                                                style={{ marginLeft: '10px' }}
                                            >
                                                🪪
                                            </button>
                                            <button
                                                className="print-btn"
                                                onClick={() => { setPrintingDreamer(c); setPrintType('cert'); }}
                                                title="Generate Certificate"
                                                style={{ marginLeft: '5px' }}
                                            >
                                                📜
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            <Card className="admin-form-card">
                                <h3>{editingId ? 'Edit Event' : 'Add New Event'}</h3>
                                <form onSubmit={handleEventSubmit} className="admin-form">
                                    <div className="form-group-full"><label>Event Title</label><input type="text" value={eventFormData.title} onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })} required /></div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Host</label><input type="text" value={eventFormData.host} onChange={(e) => setEventFormData({ ...eventFormData, host: e.target.value })} required /></div>
                                        <div className="form-group"><label>Type (e.g. Online, Workshop)</label><input type="text" value={eventFormData.type} onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Date/Time</label><input type="text" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} required /></div>
                                        <div className="form-group"><label>Location</label><input type="text" value={eventFormData.location} onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-group-full"><label>Description</label><textarea rows="3" value={eventFormData.description} onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })} required /></div>

                                    <div className="funding-setup" style={{ borderTop: '1px solid rgba(76, 161, 175, 0.2)', paddingTop: '15px', marginTop: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={eventFormData.needsFunding}
                                                onChange={(e) => setEventFormData({ ...eventFormData, needsFunding: e.target.checked })}
                                            />
                                            <span>Needs Funding?</span>
                                        </label>

                                        {eventFormData.needsFunding && (
                                            <div className="form-group-full animate-fade">
                                                <label>Funding Goal (₹)</label>
                                                <input
                                                    type="number"
                                                    value={eventFormData.amountNeeded}
                                                    onChange={(e) => setEventFormData({ ...eventFormData, amountNeeded: e.target.value })}
                                                    placeholder="e.g. 10000"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Event</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {events.map(e => (
                                    <Card key={e.id} className="admin-item-card">
                                        <div>
                                            <h4>{e.title}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{e.date} • {e.host}</p>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(e.id); setEventFormData(e) }}>✏️</button>
                                            <button onClick={() => handleEventDelete(e.id)}>🗑️</button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'status' && (
                    <div className="admin-section animate-fade">
                        <div className="status-grid">
                            <Card className="status-card">
                                <h3>📦 Layer 1: Your Browser</h3>
                                <p className="status-desc">This is what YOU see right now. It is saved locally on your computer.</p>
                                <div className="status-data">
                                    <pre>{JSON.stringify({
                                        announcement: announcement.title || 'EMPTY',
                                        quests: quests.length,
                                        roles: roles.length,
                                        members: characters.length
                                    }, null, 2)}</pre>
                                </div>
                            </Card>

                            <Card className="status-card highlight">
                                <h3>📊 Layer 2: Google Sheets</h3>
                                <p className="status-desc">This is the "Source of Truth." If data is missing here, it won't show for visitors.</p>
                                <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noreferrer" className="status-link">Open My Google Sheet ↗</a>
                                <div className="status-data">
                                    {sheetData === 'error' ? (
                                        <p style={{ color: '#ff6f61' }}>❌ Connection Error. Check your API URL.</p>
                                    ) : sheetData && sheetData.count > 0 ? (
                                        <div>
                                            <pre>{JSON.stringify({
                                                "Sheet Headers Found": sheetData.rawKeys,
                                                "Live Data (Top Row)": sheetData.summary,
                                            }, null, 2)}</pre>
                                            <p className="status-mini-note">Found {sheetData.count} row(s) in sheet.</p>
                                        </div>
                                    ) : sheetData && sheetData.count === 0 ? (
                                        <p>📭 Sheet is empty (only headers exist).</p>
                                    ) : (
                                        <p>⏳ Loading sheet data...</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="status-card">
                                <h3>⚡ Layer 3: Global Cache</h3>
                                <p className="status-desc">This is what your VISITORS see. Keep this updated!</p>
                                <Button onClick={handleSync} variant="secondary" disabled={syncing}>
                                    {syncing ? '⌛ Syncing...' : '🔄 Push to Global Cache'}
                                </Button>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Print Overlays (Portals make them direct children of body for safe printing) */}
            {printingDreamer && printType === 'id' && createPortal(
                <PrintableID dreamer={printingDreamer} onClose={() => setPrintingDreamer(null)} />,
                document.body
            )}
            {printingDreamer && printType === 'cert' && createPortal(
                <PrintableCertificate dreamer={printingDreamer} onClose={() => setPrintingDreamer(null)} />,
                document.body
            )}
        </div>
    )
}

export default AdminDashboard
