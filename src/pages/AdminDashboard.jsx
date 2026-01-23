import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
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
    const [questFormData, setQuestFormData] = useState({ title: '', purpose: '', difficulty: 'easy', timeNeeded: '', steps: '', impact: '', sharePrompt: '' })
    const [roleFormData, setRoleFormData] = useState({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '' })
    const [memberFormData, setMemberFormData] = useState({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '' })
    const [eventFormData, setEventFormData] = useState({ title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '' })

    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('dw_admin_token')
        if (!token) navigate('/admin')
    }, [navigate])

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
            alert(`✅ Global Sync Successful! \nLast Synced: ${new Date(result.lastSynced).toLocaleString()}`)
        } catch (error) {
            alert(`❌ Sync Failed: ${error.message}`)
        } finally {
            setSyncing(false)
        }
    }

    const resetForms = () => {
        setEditingId(null)
        setQuestFormData({ title: '', purpose: '', difficulty: 'easy', timeNeeded: '', steps: '', impact: '', sharePrompt: '' })
        setRoleFormData({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '' })
        setMemberFormData({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '' })
        setEventFormData({ title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '' })
    }

    // Submit Handlers
    const handleAnnouncementSubmit = (e) => {
        e.preventDefault()
        updateAnnouncement(announcementFormData)
        alert('Announcement updated!')
    }

    const handleQuestSubmit = (e) => {
        e.preventDefault()
        const data = { ...questFormData, steps: questFormData.steps.split('\n').filter(s => s.trim()) }
        editingId ? updateQuest(editingId, data) : addQuest(data)
        resetForms()
        alert(editingId ? 'Quest updated!' : 'Quest added!')
    }

    const handleRoleSubmit = (e) => {
        e.preventDefault()
        const data = { ...roleFormData, traits: roleFormData.traits.split('\n').filter(t => t.trim()) }
        editingId ? updateRole(editingId, data) : addRole(data)
        resetForms()
        alert(editingId ? 'Role updated!' : 'Role added!')
    }

    const handleMemberSubmit = (e) => {
        e.preventDefault()
        const data = { ...memberFormData, themes: memberFormData.themes.split(',').map(t => t.trim()) }
        editingId ? updateCharacter(editingId, data) : addCharacter(data)
        resetForms()
        alert(editingId ? 'Member updated!' : 'Member added!')
    }

    const handleEventSubmit = (e) => {
        e.preventDefault()
        editingId ? updateEvent(editingId, eventFormData) : addEvent(eventFormData)
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
                    <button className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => { setActiveTab('members'); resetForms() }}>👥 Members</button>
                    <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); resetForms() }}>📅 Events</button>
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={handleSync}
                        className={`sync-btn ${syncing ? 'syncing' : ''}`}
                        disabled={syncing}
                    >
                        {syncing ? '⌛ Syncing...' : '🔄 Sync Global Site'}
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
                                            <button onClick={() => deleteQuest(q.id)}>🗑️</button>
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
                                            <button onClick={() => deleteRole(r.id)}>🗑️</button>
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
                                <h3>{editingId ? 'Edit Member' : 'Add New Member'}</h3>
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
                                    <div className="form-row">
                                        <div className="form-group"><label>Avatar Image URL</label><input type="text" value={memberFormData.avatar} onChange={(e) => setMemberFormData({ ...memberFormData, avatar: e.target.value })} required /></div>
                                        <div className="form-group"><label>Cover Image URL</label><input type="text" value={memberFormData.coverImage} onChange={(e) => setMemberFormData({ ...memberFormData, coverImage: e.target.value })} /></div>
                                    </div>
                                    <div className="form-group-full"><label>Bio</label><textarea rows="3" value={memberFormData.bio} onChange={(e) => setMemberFormData({ ...memberFormData, bio: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Themes (Comma separated)</label><input type="text" placeholder="Future, Solar, Community" value={memberFormData.themes} onChange={(e) => setMemberFormData({ ...memberFormData, themes: e.target.value })} required /></div>
                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Member</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {characters.map(c => (
                                    <Card key={c.id} className="admin-item-card">
                                        <div className="admin-member-preview">
                                            <img src={c.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                            <div><h4>{c.name}</h4><Badge>{c.role}</Badge></div>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(c.id); setMemberFormData({ ...c, themes: c.themes.join(', ') }) }}>✏️</button>
                                            <button onClick={() => deleteCharacter(c.id)}>🗑️</button>
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
                                        <div className="form-group"><label>Type</label><select value={eventFormData.type} onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}><option value="online">Online</option><option value="offline">Offline</option><option value="hybrid">Hybrid</option></select></div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group"><label>Date (ISO Format)</label><input type="datetime-local" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} required /></div>
                                        <div className="form-group"><label>Location</label><input type="text" value={eventFormData.location} onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })} required /></div>
                                    </div>
                                    <div className="form-group-full"><label>Description</label><textarea rows="3" value={eventFormData.description} onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Registration Link</label><input type="text" value={eventFormData.registrationLink} onChange={(e) => setEventFormData({ ...eventFormData, registrationLink: e.target.value })} required /></div>
                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Event</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {events.map(e => (
                                    <Card key={e.id} className="admin-item-card">
                                        <div><h4>{e.title}</h4><Badge variant={e.type === 'online' ? 'default' : 'medium'}>{e.type}</Badge></div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(e.id); setEventFormData(e) }}>✏️</button>
                                            <button onClick={() => deleteEvent(e.id)}>🗑️</button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
