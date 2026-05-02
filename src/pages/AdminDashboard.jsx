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
import StudentIDCard from '../components/StudentIDCard'
import StudentCertificate from '../components/StudentCertificate'
import './AdminDashboard.css'


function AdminDashboard() {
    const navigate = useNavigate()
    const {
        loading,
        quests, addQuest, updateQuest, deleteQuest,
        roles, addRole, updateRole, deleteRole,
        characters, addCharacter, updateCharacter, deleteCharacter, reorderCharacter,
        sponsors, addSponsor, updateSponsor, deleteSponsor,
        events, addEvent, updateEvent, deleteEvent,
        announcement, updateAnnouncement,
        syncGlobalData,
        submitDonation,
        donations, deleteDonation,
        academyApplications, academyStudents,
        acceptApplication, declineApplication,
        deleteAcademyApplication,
        updateAcademyStudent, deleteAcademyStudent
    } = useContent()


    const [activeTab, setActiveTab] = useState('announcement')

    // Form States
    const [announcementFormData, setAnnouncementFormData] = useState(announcement)
    const [questFormData, setQuestFormData] = useState({
        title: '', purpose: '', difficulty: 'easy', timeNeeded: '', steps: '', impact: '', sharePrompt: '',
        needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
    })
    const [roleFormData, setRoleFormData] = useState({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '', isExclusive: false })
    const [memberFormData, setMemberFormData] = useState({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '', joinedDate: '', order_index: 0, stat_knowledge: 50, stat_discipline: 50, stat_charisma: 50, stat_creativity: 50, stat_courage: 50, stat_physique: 50, stat_empathy: 50, stat_essence: 50, passcode: '', theme_color: '#141932', daily_task: '' })
    const [sponsorFormData, setSponsorFormData] = useState({ name: '', title: '', avatar: '', bio: '', themes: '' })
    const [eventFormData, setEventFormData] = useState({
        title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '',
        needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
    })
    const [donationFormData, setDonationFormData] = useState({
        name: '', amount: '', type: 'manual', sponsorshipId: '', sponsorshipType: 'general', message: ''
    })

    const [editingId, setEditingId] = useState(null)
    const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState(false)
    const [sheetData, setSheetData] = useState(null)

    // Printing State
    const [printingDreamer, setPrintingDreamer] = useState(null)
    const [printType, setPrintType] = useState(null) // 'id' or 'cert'
    const [syncing, setSyncing] = useState(false)

    // Academy printing state
    const [printingStudent, setPrintingStudent] = useState(null)
    const [studentPrintType, setStudentPrintType] = useState(null) // 'id' or 'cert'

    // Academy student edit form
    const [editingStudentId, setEditingStudentId] = useState(null)
    const [studentFormData, setStudentFormData] = useState({
        name: '', class: '', school_name: '', age: '', gender: '',
        hobbies: '', favourite_colour: '', favourite_animal: '', aim_in_life: '',
        avatar: '', coverImage: '', points: 0, order_index: 0, joined_date: '',
        stat_knowledge: 50, stat_discipline: 50, stat_charisma: 50, stat_creativity: 50, stat_courage: 50, stat_physique: 50, stat_empathy: 50, stat_essence: 50,
        passcode: '', theme_color: '#141932', daily_task: ''
    })
    const [appFilter, setAppFilter] = useState('pending') // 'pending', 'accepted', 'declined'
    const [xpAdjustAmount, setXpAdjustAmount] = useState(10);


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

    // Monitor Supabase Connectivity (System Health)
    useEffect(() => {
        if (activeTab === 'status') {
            const checkDatabase = async () => {
                try {
                    const { data, error } = await supabase.from('announcements').select('*').limit(1)
                    if (error) throw error

                    setSheetData({
                        summary: data[0] || 'No announcements yet',
                        count: data.length,
                        type: 'Supabase (Infinite)'
                    });
                } catch (e) {
                    setSheetData('error');
                }
            };
            checkDatabase();
        }
    }, [activeTab])

    if (loading) return <div className="loading-state">Connecting to Cloud Database...</div>

    const handleLogout = () => {
        localStorage.removeItem('dw_admin_token')
        navigate('/admin')
    }

    const handleSync = async () => {
        setSyncing(true)
        try {
            await syncGlobalData()
            setHasUnsyncedChanges(false)
            alert('✅ Data Refreshed! \n\nYour dashboard is now perfectly in sync with the cloud database.')
        } catch (error) {
            alert(`❌ Refresh Failed: ${error.message}`)
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
        setRoleFormData({ id: '', name: '', singular: '', description: '', color: '#4CA1AF', traits: '', philosophy: '', isExclusive: false })
        setMemberFormData({ name: '', role: '', title: '', avatar: '', coverImage: '', bio: '', themes: '', joinedDate: '', order_index: 0, stat_knowledge: 50, stat_discipline: 50, stat_charisma: 50, stat_creativity: 50, stat_courage: 50, stat_physique: 50, stat_empathy: 50, stat_essence: 50 })
        setSponsorFormData({ name: '', title: '', avatar: '', bio: '', themes: '' })
        setEventFormData({
            title: '', host: '', type: 'online', date: '', location: '', description: '', registrationLink: '',
            needsFunding: false, amountNeeded: '', galleryImages: [], completionImages: [], completionNote: ''
        })
        setDonationFormData({
            name: '', amount: '', type: 'manual', sponsorshipId: '', sponsorshipType: 'general', message: ''
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

    const handleSponsorSubmit = (e) => {
        e.preventDefault()
        const data = { ...sponsorFormData, themes: sponsorFormData.themes.split(',').map(t => t.trim()) }
        editingId ? updateSponsor(editingId, data) : addSponsor(data)
        setHasUnsyncedChanges(true)
        resetForms()
        alert(editingId ? 'Sponsor updated!' : 'Sponsor added!')
    }

    const handleQuestDelete = (id) => { if (window.confirm('Delete this quest?')) { deleteQuest(id); setHasUnsyncedChanges(true) } }
    const handleRoleDelete = (id) => { if (window.confirm('Delete this role?')) { deleteRole(id); setHasUnsyncedChanges(true) } }
    const handleMemberDelete = (id) => { if (window.confirm('Delete this member?')) { deleteCharacter(id); setHasUnsyncedChanges(true) } }
    const handleSponsorDelete = (id) => { if (window.confirm('Delete this sponsor?')) { deleteSponsor(id); setHasUnsyncedChanges(true) } }
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

    const handleDonationSubmit = async (e) => {
        e.preventDefault()
        try {
            await submitDonation({
                name: donationFormData.name,
                email: 'admin-manual@entry', // Placeholder for manual entries
                amount: donationFormData.amount,
                type: 'one-time', // Manual donations are single entries
                paymentMethod: 'manual', // Explicitly mark as manual/offline
                status: 'success',
                message: donationFormData.message || 'Manual entry via Admin Panel',
                transactionId: `MANUAL-${Date.now()}`,
                sponsorshipType: donationFormData.sponsorshipType,
                sponsorshipId: donationFormData.sponsorshipId
            })
            setHasUnsyncedChanges(true)
            resetForms()
            alert('✅ Manual Donation Recorded!')
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    return (
        <div className="admin-dashboard page">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                    <h3>Admin Panel</h3>
                </div>

                {localStorage.getItem('dw_portal_user_id') && (
                    <>
                        <div style={{ padding: '0 12px', marginBottom: '10px' }}>
                            <button
                                onClick={() => navigate('/portal/dashboard')}
                                style={{ 
                                    padding: '10px 14px', 
                                    background: 'rgba(76,161,175,0.1)', 
                                    border: '1px solid rgba(76,161,175,0.25)', 
                                    borderRadius: 12, 
                                    color: '#7ec8e3', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer', 
                                    width: '100%', 
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(76,161,175,0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(76,161,175,0.1)'}
                            >
                                <span style={{ fontSize: '1rem' }}>🏰</span> Back to Portal
                            </button>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 12px 15px' }} />
                    </>
                )}
                <nav className="admin-nav">
                    <button className={`nav-item ${activeTab === 'announcement' ? 'active' : ''}`} onClick={() => { setActiveTab('announcement'); resetForms() }}>📢 Announcement</button>
                    <button className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`} onClick={() => { setActiveTab('quests'); resetForms() }}>🎯 Quests</button>
                    <button className={`nav-item ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => { setActiveTab('roles'); resetForms() }}>🎭 Roles</button>
                    <button className={`nav-item ${activeTab === 'members' ? 'active' : ''}`} onClick={() => { setActiveTab('members'); resetForms() }}>👥 Dreamers</button>
                    <button className={`nav-item ${activeTab === 'sponsors' ? 'active' : ''}`} onClick={() => { setActiveTab('sponsors'); resetForms() }}>🤝 Sponsors</button>
                    <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); resetForms() }}>📅 Events</button>
                    <button className={`nav-item ${activeTab === 'donations' ? 'active' : ''}`} onClick={() => { setActiveTab('donations'); resetForms() }}>💰 Donations</button>
                    <div style={{ borderTop: '1px solid rgba(76,161,175,0.2)', margin: '8px 0' }} />
                    <button className={`nav-item ${activeTab === 'acad-apps' ? 'active' : ''}`} onClick={() => { setActiveTab('acad-apps'); resetForms() }}
                        style={{ color: '#7ec8e3' }}>🏫 Acad. Applications
                        {academyApplications.filter(a => a.status === 'pending').length > 0 && (
                            <span style={{ marginLeft: 6, background: '#4CA1AF', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                {academyApplications.filter(a => a.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button className={`nav-item ${activeTab === 'acad-students' ? 'active' : ''}`} onClick={() => { setActiveTab('acad-students'); resetForms() }}
                        style={{ color: '#7ec8e3' }}>🎓 Academy Students</button>
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
                        {syncing ? '⌛ Refreshing...' : '🔄 Refresh Data'}
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

                                    <div className="form-checkbox" style={{ margin: '15px 0', padding: '15px', background: 'rgba(255, 69, 0, 0.1)', border: '1px solid rgba(255, 69, 0, 0.3)', borderRadius: '8px' }}>
                                        <input
                                            type="checkbox"
                                            id="roleExclusive"
                                            checked={roleFormData.isExclusive || false}
                                            onChange={(e) => setRoleFormData({ ...roleFormData, isExclusive: e.target.checked })}
                                        />
                                        <label htmlFor="roleExclusive" style={{ color: '#ff6f61', fontWeight: 'bold' }}>
                                            🔒 Exclusive / Admin Only?
                                        </label>
                                        <p style={{ fontSize: '0.8rem', color: '#ccc', marginLeft: '25px', marginTop: '5px' }}>
                                            If checked, this role will NOT appear in the "Join" form. Use this for special roles like "Architect".
                                        </p>
                                    </div>

                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Role</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {roles.map(r => (
                                    <Card key={r.id} className="admin-item-card">
                                        <div><h4>{r.name}</h4><Badge>{r.singular}</Badge></div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => { setEditingId(r.id); setRoleFormData({ ...r, traits: r.traits.join('\n'), isExclusive: r.is_exclusive || false }) }}>✏️</button>
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
                                    <div className="form-row">
                                        <div className="form-group"><label>Dreaming Since</label><input type="date" value={memberFormData.joinedDate || ''} onChange={(e) => setMemberFormData(prev => ({ ...prev, joinedDate: e.target.value }))} required /></div>
                                        <div className="form-group">
                                            <label>Dream Level</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={Math.floor((parseInt(memberFormData.points) || 0) / 108)}
                                                onChange={(e) => {
                                                    let valStr = e.target.value;
                                                    if (valStr.startsWith('0') && valStr.length > 1) valStr = valStr.substring(1);
                                                    const newLevel = parseInt(valStr) || 0;
                                                    const currentXp = (parseInt(memberFormData.points) || 0) % 108;
                                                    setMemberFormData(prev => ({ ...prev, points: Math.max(0, (newLevel * 108) + currentXp) }));
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>XP (Current Level)</label>
                                            <input
                                                type="number"
                                                value={(parseInt(memberFormData.points) || 0) % 108}
                                                onChange={(e) => {
                                                    let valStr = e.target.value;
                                                    if (valStr.startsWith('0') && valStr.length > 1) valStr = valStr.substring(1);
                                                    const currentLevel = Math.floor((parseInt(memberFormData.points) || 0) / 108);
                                                    const newXp = parseInt(valStr) || 0;
                                                    setMemberFormData(prev => ({ ...prev, points: Math.max(0, (currentLevel * 108) + newXp) }));
                                                }}
                                            />
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '4px', textAlign: 'right' }}>
                                                Total XP: <strong style={{ color: 'var(--color-accent)' }}>{memberFormData.points || 0}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ alignItems: 'flex-end', marginTop: '-10px', marginBottom: '15px', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px' }}>
                                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                            <label style={{ color: 'rgba(255,255,255,0.6)' }}>Quick Adjust Total XP</label>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <input
                                                    type="number"
                                                    placeholder="Amount"
                                                    value={xpAdjustAmount}
                                                    onChange={(e) => setXpAdjustAmount(e.target.value)}
                                                    style={{ width: '100px', background: 'rgba(255,255,255,0.05)' }}
                                                />
                                                <button type="button" onClick={() => setMemberFormData(p => ({ ...p, points: (parseInt(p.points) || 0) + (parseInt(xpAdjustAmount) || 0) }))} style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', background: 'rgba(76, 161, 175, 0.1)', cursor: 'pointer', border: '1px solid rgba(76, 161, 175, 0.3)', color: '#7ec8e3', outline: 'none' }}>+ Add XP</button>
                                                <button type="button" onClick={() => setMemberFormData(p => ({ ...p, points: Math.max(0, (parseInt(p.points) || 0) - (parseInt(xpAdjustAmount) || 0)) }))} style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', background: 'rgba(255, 100, 100, 0.1)', cursor: 'pointer', border: '1px solid rgba(255, 100, 100, 0.3)', color: '#ff9090', outline: 'none' }}>- Subtract XP</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-stats-editor" style={{ background: 'rgba(76, 161, 175, 0.1)', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid rgba(76, 161, 175, 0.3)' }}>
                                        <h4 style={{ color: '#7ec8e3', marginBottom: '10px' }}>PWA Portal Access (Sandbox)</h4>
                                        <div className="form-row">
                                            <div className="form-group"><label>Portal Passcode</label><input type="text" placeholder="e.g. SECRET123" value={memberFormData.passcode || ''} onChange={(e) => setMemberFormData({ ...memberFormData, passcode: e.target.value })} /></div>
                                            <div className="form-group"><label>Theme Color (Hex)</label><input type="text" placeholder="#141932" value={memberFormData.theme_color || ''} onChange={(e) => setMemberFormData({ ...memberFormData, theme_color: e.target.value })} /></div>
                                        </div>
                                        <div className="form-group-full">
                                            <label>Daily Task / Letter for Portal</label>
                                            <textarea
                                                placeholder="Write a task or letter to this Dreamer...
You can write multiple lines here.
Each line will show as a new paragraph.

Example:
Dear Justice,
Your task today is to complete Chapter 2 of Advanced Magic. Focus on the breathing techniques."
                                                value={memberFormData.daily_task || ''}
                                                onChange={(e) => setMemberFormData({ ...memberFormData, daily_task: e.target.value })}
                                                rows={10}
                                                style={{ fontFamily: 'Georgia, serif', lineHeight: 1.8, resize: 'vertical', fontSize: '0.95rem' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="admin-stats-editor" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
                                        <h4 style={{ color: 'var(--color-cyan)', marginBottom: '10px' }}>Dreamer Stats (1-100)</h4>
                                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Knowledge</label><input type="number" min="0" max="100" value={memberFormData.stat_knowledge} onChange={(e) => setMemberFormData({ ...memberFormData, stat_knowledge: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Discipline</label><input type="number" min="0" max="100" value={memberFormData.stat_discipline} onChange={(e) => setMemberFormData({ ...memberFormData, stat_discipline: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Charisma</label><input type="number" min="0" max="100" value={memberFormData.stat_charisma} onChange={(e) => setMemberFormData({ ...memberFormData, stat_charisma: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Creativity</label><input type="number" min="0" max="100" value={memberFormData.stat_creativity} onChange={(e) => setMemberFormData({ ...memberFormData, stat_creativity: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Courage</label><input type="number" min="0" max="100" value={memberFormData.stat_courage} onChange={(e) => setMemberFormData({ ...memberFormData, stat_courage: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Physique</label><input type="number" min="0" max="100" value={memberFormData.stat_physique} onChange={(e) => setMemberFormData({ ...memberFormData, stat_physique: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Empathy</label><input type="number" min="0" max="100" value={memberFormData.stat_empathy} onChange={(e) => setMemberFormData({ ...memberFormData, stat_empathy: e.target.value })} /></div>
                                            <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Essence</label><input type="number" min="0" max="100" value={memberFormData.stat_essence} onChange={(e) => setMemberFormData({ ...memberFormData, stat_essence: e.target.value })} /></div>
                                        </div>
                                    </div>
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
                                            <div>
                                                <h4>{c.name}</h4>
                                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                    <Badge>{c.role}</Badge>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>Lvl {c.level || 0}</span>
                                                </div>
                                            </div>
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
                                                    twitter: c.socials?.twitter || '',
                                                    level: c.level || 0,
                                                    points: c.points || 0,
                                                    joinedDate: c.joinedDate || '',
                                                    order_index: c.order_index || 0,
                                                    stat_knowledge: c.stats?.knowledge || 50,
                                                    stat_discipline: c.stats?.discipline || 50,
                                                    stat_charisma: c.stats?.charisma || 50,
                                                    stat_creativity: c.stats?.creativity || 50,
                                                    stat_courage: c.stats?.courage || 50,
                                                    stat_physique: c.stats?.physique || 50,
                                                    stat_empathy: c.stats?.empathy || 50,
                                                    stat_essence: c.stats?.essence || 50
                                                })
                                            }}>✏️</button>
                                            <button onClick={() => handleMemberDelete(c.id)}>🗑️</button>
                                            <div className="order-controls" style={{ display: 'inline-flex', gap: '2px', marginLeft: '5px' }}>
                                                {characters.indexOf(c) > 0 && <button onClick={() => reorderCharacter(c.id, 'up')} title="Move Up">🔼</button>}
                                                {characters.indexOf(c) < characters.length - 1 && <button onClick={() => reorderCharacter(c.id, 'down')} title="Move Down">🔽</button>}
                                            </div>
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

                {activeTab === 'sponsors' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            <Card className="admin-form-card">
                                <h3>{editingId ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
                                <form onSubmit={handleSponsorSubmit} className="admin-form">
                                    <div className="form-group-full"><label>Organization / Name</label><input type="text" value={sponsorFormData.name} onChange={(e) => setSponsorFormData({ ...sponsorFormData, name: e.target.value })} required /></div>
                                    <div className="form-group-full"><label>Title (e.g. Director of Agriculture)</label><input type="text" value={sponsorFormData.title} onChange={(e) => setSponsorFormData({ ...sponsorFormData, title: e.target.value })} required /></div>

                                    <ImageUpload
                                        label="Sponsor Logo/Avatar"
                                        onUploadComplete={(url) => setSponsorFormData(prev => ({ ...prev, avatar: url }))}
                                        defaultImage={sponsorFormData.avatar}
                                        folder="sponsors"
                                    />

                                    <div className="form-group-full"><label>Bio/Description</label><textarea rows="3" value={sponsorFormData.bio} onChange={(e) => setSponsorFormData(prev => ({ ...prev, bio: e.target.value }))} required /></div>

                                    <div className="form-checkbox" style={{ margin: '15px 0', padding: '15px', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '8px' }}>
                                        <input
                                            type="checkbox"
                                            id="royalTribute"
                                            checked={sponsorFormData.themes.split(',').map(t => t.trim()).includes('Royal')}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                let currentThemes = sponsorFormData.themes.split(',').map(t => t.trim()).filter(Boolean);
                                                if (isChecked) {
                                                    if (!currentThemes.includes('Royal')) currentThemes.push('Royal');
                                                } else {
                                                    currentThemes = currentThemes.filter(t => t !== 'Royal');
                                                }
                                                setSponsorFormData({ ...sponsorFormData, themes: currentThemes.join(', ') });
                                            }}
                                        />
                                        <label htmlFor="royalTribute" style={{ color: '#FFD700', fontWeight: 'bold' }}>
                                            👑 Royal Tribute? (Display in Wall of Gratitude)
                                        </label>
                                        <p style={{ fontSize: '0.8rem', color: '#ccc', marginLeft: '25px', marginTop: '5px' }}>
                                            Check this box for top-tier sponsors like Peter Saam to give them a premium gold display.
                                        </p>
                                    </div>

                                    <Button type="submit" variant="primary">{editingId ? 'Update' : 'Add'} Sponsor</Button>
                                    {editingId && <Button type="button" variant="secondary" onClick={resetForms}>Cancel</Button>}
                                </form>
                            </Card>
                            <div className="admin-list">
                                {sponsors.map(s => (
                                    <Card key={s.id} className="admin-item-card">
                                        <div className="admin-member-preview">
                                            <Avatar
                                                src={s.avatar}
                                                name={s.name}
                                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                                            />
                                            <div>
                                                <h4>{s.name}</h4>
                                                <Badge variant={s.themes.includes('Royal') ? 'active' : 'secondary'}>
                                                    {s.themes.includes('Royal') ? '👑 Royal' : 'Sponsor'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => {
                                                setEditingId(s.id);
                                                setSponsorFormData({
                                                    ...s,
                                                    themes: Array.isArray(s.themes) ? s.themes.join(', ') : (s.themes || '')
                                                })
                                            }}>✏️</button>
                                            <button onClick={() => handleSponsorDelete(s.id)}>🗑️</button>
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
                                        <div className="form-group"><label>Date</label><input type="date" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} /></div>
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

                {activeTab === 'donations' && (
                    <div className="admin-section animate-fade">
                        <Card className="admin-form-card">
                            <h3>Record Manual Donation</h3>
                            <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', marginBottom: '15px' }}>
                                Use this to record offline payments (Cash, Direct UPI, Bank Transfer) so they reflect in the fundraising goals.
                            </p>
                            <form onSubmit={handleDonationSubmit} className="admin-form">
                                <div className="form-row">
                                    <div className="form-group"><label>Donor Name</label><input type="text" value={donationFormData.name} onChange={(e) => setDonationFormData({ ...donationFormData, name: e.target.value })} required /></div>
                                    <div className="form-group"><label>Amount (₹)</label><input type="number" value={donationFormData.amount} onChange={(e) => setDonationFormData({ ...donationFormData, amount: e.target.value })} required /></div>
                                </div>

                                <div className="form-group-full">
                                    <label>Contribution Target</label>
                                    <select
                                        value={donationFormData.sponsorshipId}
                                        onChange={(e) => {
                                            const id = e.target.value
                                            if (!id) {
                                                setDonationFormData(prev => ({ ...prev, sponsorshipId: '', sponsorshipType: 'general' }))
                                            } else {
                                                const quest = quests.find(q => q.id === id)
                                                const event = events.find(ev => ev.id === id)
                                                const type = quest ? 'quest' : (event ? 'event' : 'general')
                                                setDonationFormData(prev => ({ ...prev, sponsorshipId: id, sponsorshipType: type }))
                                            }
                                        }}
                                    >
                                        <option value="">General Fund (No specific target)</option>
                                        <optgroup label="Quests">
                                            {quests.filter(q => q.fundingStatus === 'active').map(q => (
                                                <option key={q.id} value={q.id}>{q.title}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Events">
                                            {events.filter(e => e.fundingStatus === 'active').map(e => (
                                                <option key={e.id} value={e.id}>{e.title}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="form-group-full"><label>Private Note (Optional)</label><textarea rows="2" value={donationFormData.message} onChange={(e) => setDonationFormData({ ...donationFormData, message: e.target.value })} /></div>

                                <Button type="submit" variant="primary">Record Donation</Button>
                            </form>
                        </Card>

                        <div className="admin-section-header" style={{ marginTop: '40px', marginBottom: '20px' }}>
                            <h3>Recent Donations (Last 50)</h3>
                            <p style={{ color: 'var(--color-gray)' }}>View and manage recent contributions. Deleting a record here will effectively "refund" it from the system.</p>
                        </div>

                        <div className="admin-list">
                            {donations.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray)', padding: '20px' }}>No donations recorded yet.</p>
                            ) : (
                                donations.map(d => (
                                    <Card key={d.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4>₹{d.amount} <span style={{ fontWeight: 'normal', color: 'var(--color-gray)' }}>from {d.name}</span></h4>
                                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', marginTop: '4px', flexWrap: 'wrap' }}>
                                                    <span style={{ color: 'var(--color-accent)' }}>{new Date(d.date).toLocaleDateString()}</span>
                                                    {d.sponsorship_type !== 'general' && (
                                                        <Badge variant="secondary">
                                                            For {d.sponsorship_type === 'quest' ? 'Quest' : 'Event'}
                                                        </Badge>
                                                    )}
                                                    {d.payment_method === 'manual' && <Badge variant="outline">Manual</Badge>}
                                                </div>
                                            </div>
                                            <div className="admin-item-actions">
                                                <button
                                                    onClick={() => {
                                                        const targetName = d.sponsorship_type === 'general' ? 'General Fund' : (
                                                            d.sponsorship_type === 'quest'
                                                                ? (quests.find(q => q.id === d.sponsorship_id)?.title || 'Unknown Quest')
                                                                : (events.find(e => e.id === d.sponsorship_id)?.title || 'Unknown Event')
                                                        );

                                                        if (window.confirm(`⚠️ DELETE DONATION?\n\nDonor: ${d.name}\nAmount: ₹${d.amount}\nTarget: ${targetName}\n\nDeleting this will REMOVE the record and DEDUCT ₹${d.amount} from the target fundraiser.\n\nAre you sure?`)) {
                                                            deleteDonation(d.id);
                                                            setHasUnsyncedChanges(true);
                                                        }
                                                    }}
                                                    title="Delete & Refund"
                                                    style={{ color: '#ff6f61', fontSize: '1rem' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        {d.message && (
                                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px', width: '100%' }}>
                                                "{d.message}"
                                            </div>
                                        )}
                                    </Card>
                                ))
                            )}
                        </div>
                        <div className="admin-section-header" style={{ marginTop: '40px', marginBottom: '20px' }}>
                            <h3>Manage Active Funds</h3>
                            <p style={{ color: 'var(--color-gray)' }}>Adjust or correct funding totals for active quests and events.</p>
                        </div>
                        <div className="admin-list">
                            {/* Quests with Funding */}
                            {quests.filter(q => q.amountNeeded && parseFloat(q.amountNeeded) > 0).map(q => (
                                <Card key={q.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>{q.title} <Badge variant="primary">Quest</Badge></h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-cyan)', marginTop: '5px' }}>
                                                Raised: ₹{q.amountRaised || 0} / ₹{q.amountNeeded}
                                            </p>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button
                                                onClick={() => {
                                                    const amount = prompt(`Subtract amount from "${q.title}":\nCurrent Total: ₹${q.amountRaised || 0}`);
                                                    if (amount && !isNaN(amount)) {
                                                        const newTotal = Math.max(0, parseFloat(q.amountRaised || 0) - parseFloat(amount));
                                                        if (window.confirm(`Reduce by ₹${amount}?\nNew Total will be: ₹${newTotal}`)) {
                                                            updateQuest(q.id, { ...q, amountRaised: newTotal.toString() });
                                                            setHasUnsyncedChanges(true); // Ensure sync warning triggers
                                                        }
                                                    }
                                                }}
                                                title="Subtract Funds"
                                                style={{ fontSize: '0.9rem', marginRight: '10px' }}
                                            >
                                                ➖ Subtract
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`⚠️ CLEAR ALL FUNDS for "${q.title}"?\n\nThis will reset the amount raised to ₹0.\nThis action cannot be undone.`)) {
                                                        updateQuest(q.id, { ...q, amountRaised: '0' });
                                                        setHasUnsyncedChanges(true);
                                                    }
                                                }}
                                                title="Reset to 0"
                                                style={{ fontSize: '0.9rem', color: '#ff6f61' }}
                                            >
                                                ❌ Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div className="fund-progress-bar" style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(100, (parseFloat(q.amountRaised || 0) / parseFloat(q.amountNeeded)) * 100)}%`,
                                            height: '100%',
                                            background: 'var(--color-gold)',
                                            transition: 'width 0.3s ease'
                                        }}></div>
                                    </div>
                                </Card>
                            ))}

                            {/* Events with Funding */}
                            {events.filter(e => e.amountNeeded && parseFloat(e.amountNeeded) > 0).map(e => (
                                <Card key={e.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4>{e.title} <Badge variant="secondary">Event</Badge></h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--color-cyan)', marginTop: '5px' }}>
                                                Raised: ₹{e.amountRaised || 0} / ₹{e.amountNeeded}
                                            </p>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button
                                                onClick={() => {
                                                    const amount = prompt(`Subtract amount from "${e.title}":\nCurrent Total: ₹${e.amountRaised || 0}`);
                                                    if (amount && !isNaN(amount)) {
                                                        const newTotal = Math.max(0, parseFloat(e.amountRaised || 0) - parseFloat(amount));
                                                        if (window.confirm(`Reduce by ₹${amount}?\nNew Total will be: ₹${newTotal}`)) {
                                                            updateEvent(e.id, { ...e, amountRaised: newTotal.toString() });
                                                            setHasUnsyncedChanges(true);
                                                        }
                                                    }
                                                }}
                                                title="Subtract Funds"
                                                style={{ fontSize: '0.9rem', marginRight: '10px' }}
                                            >
                                                ➖ Subtract
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`⚠️ CLEAR ALL FUNDS for "${e.title}"?\n\nThis will reset the amount raised to ₹0.\nThis action cannot be undone.`)) {
                                                        updateEvent(e.id, { ...e, amountRaised: '0' });
                                                        setHasUnsyncedChanges(true);
                                                    }
                                                }}
                                                title="Reset to 0"
                                                style={{ fontSize: '0.9rem', color: '#ff6f61' }}
                                            >
                                                ❌ Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div className="fund-progress-bar" style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(100, (parseFloat(e.amountRaised || 0) / parseFloat(e.amountNeeded)) * 100)}%`,
                                            height: '100%',
                                            background: 'var(--color-primary)',
                                            transition: 'width 0.3s ease'
                                        }}></div>
                                    </div>
                                </Card>
                            ))}

                            {/* Empty State */}
                            {quests.filter(q => q.amountNeeded && parseFloat(q.amountNeeded) > 0).length === 0 && events.filter(e => e.amountNeeded && parseFloat(e.amountNeeded) > 0).length === 0 && (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray)', padding: '20px' }}>
                                    No active fundraisers found. Enable "Needs Funding" on a Quest or Event to see it here.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ======= ACADEMY APPLICATIONS TAB ======= */}
                {activeTab === 'acad-apps' && (
                    <div className="admin-section animate-fade">
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {['pending', 'accepted', 'declined'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setAppFilter(f)}
                                    style={{
                                        padding: '6px 18px', borderRadius: '20px', border: '1px solid',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
                                        borderColor: appFilter === f ? '#4CA1AF' : 'rgba(76,161,175,0.3)',
                                        background: appFilter === f ? 'rgba(76,161,175,0.25)' : 'transparent',
                                        color: appFilter === f ? '#7ec8e3' : 'rgba(255,255,255,0.55)'
                                    }}
                                >
                                    {f === 'pending' ? '⏳' : f === 'accepted' ? '✅' : '❌'} {f.charAt(0).toUpperCase() + f.slice(1)}
                                    {' '}({academyApplications.filter(a => a.status === f).length})
                                </button>
                            ))}
                        </div>

                        <div className="admin-list">
                            {academyApplications.filter(a => a.status === appFilter).length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray)', padding: '40px' }}>
                                    No {appFilter} applications.
                                </p>
                            ) : academyApplications.filter(a => a.status === appFilter).map(app => (
                                <Card key={app.id} style={{ flexDirection: 'column', gap: 0, padding: '20px 22px', borderRadius: 14, marginBottom: 14 }}>

                                    {/* ── Row 1: Name + Buttons ── */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{app.name}</h4>
                                            <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                                                Submitted: {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                            {app.status === 'pending' ? (
                                                <>
                                                    <button onClick={async () => { if (window.confirm(`✅ Accept ${app.name} into DreamWorld Academy?`)) await acceptApplication(app.id) }}
                                                        style={{ background: 'rgba(100,200,100,0.18)', border: '1px solid rgba(100,200,100,0.4)', color: '#90e0a0', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.83rem', whiteSpace: 'nowrap' }}>
                                                        ✅ Accept
                                                    </button>
                                                    <button onClick={async () => { if (window.confirm(`❌ Decline ${app.name}'s application?`)) await declineApplication(app.id) }}
                                                        style={{ background: 'rgba(255,100,100,0.13)', border: '1px solid rgba(255,100,100,0.35)', color: '#ff9090', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.83rem', whiteSpace: 'nowrap' }}>
                                                        ❌ Decline
                                                    </button>
                                                </>
                                            ) : (
                                                <Badge variant={app.status === 'accepted' ? 'active' : 'secondary'}>
                                                    {app.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                                                </Badge>
                                            )}
                                            <button onClick={async () => { if (window.confirm(`🗑️ Permanently delete ${app.name}'s application?`)) await deleteAcademyApplication(app.id) }}
                                                title="Delete application"
                                                style={{ background: 'rgba(180,60,60,0.13)', border: '1px solid rgba(180,60,60,0.28)', color: 'rgba(255,120,120,0.7)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* ── Row 2: Info chips ── */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                                        {[
                                            `📚 ${app.class}`,
                                            app.school_name && `🏫 ${app.school_name}`,
                                            `🎂 Age ${app.age}`,
                                            `⚧ ${app.gender}`
                                        ].filter(Boolean).map((chip, i) => (
                                            <span key={i} style={{ background: 'rgba(76,161,175,0.1)', border: '1px solid rgba(76,161,175,0.18)', borderRadius: 20, padding: '3px 11px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                                                {chip}
                                            </span>
                                        ))}
                                    </div>

                                    {/* ── Row 3: Private contact ── */}
                                    {(app.phone || app.email) && (
                                        <div style={{ background: 'rgba(76,161,175,0.06)', border: '1px solid rgba(76,161,175,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.3)' }}>🔒 Private Contact</span>
                                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                                {app.phone && <a href={`tel:${app.phone}`} style={{ color: '#7ec8e3', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>📞 {app.phone}</a>}
                                                {app.email && <a href={`mailto:${app.email}`} style={{ color: '#a8d8ea', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>✉️ {app.email}</a>}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Row 4: Colour & Animal ── */}
                                    <div style={{ display: 'flex', gap: 20, marginBottom: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)' }}>🎨 <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{app.favourite_colour}</strong></span>
                                        <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)' }}>🐾 <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{app.favourite_animal}</strong></span>
                                    </div>

                                    {/* ── Row 5: Hobbies ── */}
                                    {app.hobbies && (
                                        <div style={{ marginBottom: 8 }}>
                                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 3 }}>Interests</span>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>⚡ {app.hobbies}</p>
                                        </div>
                                    )}

                                    {/* ── Row 6: Aim ── */}
                                    {app.aim_in_life && (
                                        <div style={{ background: 'rgba(120,80,200,0.06)', border: '1px solid rgba(120,80,200,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                                            <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 4 }}>Dream & Aim</span>
                                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#c4b5f5', fontStyle: 'italic', lineHeight: 1.6 }}>🌟 "{app.aim_in_life}"</p>
                                        </div>
                                    )}

                                </Card>
                            ))}


                        </div>
                    </div>
                )}

                {/* ======= ACADEMY STUDENTS TAB ======= */}
                {activeTab === 'acad-students' && (
                    <div className="admin-section animate-fade">
                        <div className="admin-split-layout">
                            {/* Edit Form */}
                            <Card className="admin-form-card">
                                <h3>{editingStudentId ? 'Edit Student' : 'Academy Students'}</h3>
                                {editingStudentId ? (
                                    <form className="admin-form" onSubmit={async (e) => {
                                        e.preventDefault()
                                        await updateAcademyStudent(editingStudentId, studentFormData)
                                        setEditingStudentId(null)
                                    }}>
                                        <div className="form-row">
                                            <div className="form-group"><label>Full Name</label><input type="text" value={studentFormData.name} onChange={e => setStudentFormData(p => ({ ...p, name: e.target.value }))} required /></div>
                                            <div className="form-group"><label>Class</label><input type="text" value={studentFormData.class} onChange={e => setStudentFormData(p => ({ ...p, class: e.target.value }))} required /></div>
                                        </div>
                                        <div className="form-group-full"><label>School Name</label><input type="text" value={studentFormData.school_name} onChange={e => setStudentFormData(p => ({ ...p, school_name: e.target.value }))} /></div>
                                        <div className="form-row">
                                            <div className="form-group"><label>Age</label><input type="number" value={studentFormData.age} onChange={e => setStudentFormData(p => ({ ...p, age: e.target.value }))} /></div>
                                            <div className="form-group">
                                                <label>Dream Level</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={Math.floor((parseInt(studentFormData.points) || 0) / 108)}
                                                    onChange={(e) => {
                                                        let valStr = e.target.value;
                                                        if (valStr.startsWith('0') && valStr.length > 1) valStr = valStr.substring(1);
                                                        const newLevel = parseInt(valStr) || 0;
                                                        const currentXp = (parseInt(studentFormData.points) || 0) % 108;
                                                        setStudentFormData(prev => ({ ...prev, points: Math.max(0, (newLevel * 108) + currentXp) }));
                                                    }}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>XP (Current Level)</label>
                                                <input
                                                    type="number"
                                                    value={(parseInt(studentFormData.points) || 0) % 108}
                                                    onChange={(e) => {
                                                        let valStr = e.target.value;
                                                        if (valStr.startsWith('0') && valStr.length > 1) valStr = valStr.substring(1);
                                                        const currentLevel = Math.floor((parseInt(studentFormData.points) || 0) / 108);
                                                        const newXp = parseInt(valStr) || 0;
                                                        setStudentFormData(prev => ({ ...prev, points: Math.max(0, (currentLevel * 108) + newXp) }));
                                                    }}
                                                />
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '4px', textAlign: 'right' }}>
                                                    Total XP: <strong style={{ color: 'var(--color-accent)' }}>{studentFormData.points || 0}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row" style={{ alignItems: 'flex-end', marginTop: '-10px', marginBottom: '15px', background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px' }}>
                                            <div className="form-group" style={{ flex: 1, margin: 0 }}>
                                                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Quick Adjust Total XP</label>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <input
                                                        type="number"
                                                        placeholder="Amount"
                                                        value={xpAdjustAmount}
                                                        onChange={(e) => setXpAdjustAmount(e.target.value)}
                                                        style={{ width: '100px', background: 'rgba(255,255,255,0.05)' }}
                                                    />
                                                    <button type="button" onClick={() => setStudentFormData(p => ({ ...p, points: (parseInt(p.points) || 0) + (parseInt(xpAdjustAmount) || 0) }))} style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', background: 'rgba(76, 161, 175, 0.1)', cursor: 'pointer', border: '1px solid rgba(76, 161, 175, 0.3)', color: '#7ec8e3', outline: 'none' }}>+ Add XP</button>
                                                    <button type="button" onClick={() => setStudentFormData(p => ({ ...p, points: Math.max(0, (parseInt(p.points) || 0) - (parseInt(xpAdjustAmount) || 0)) }))} style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', background: 'rgba(255, 100, 100, 0.1)', cursor: 'pointer', border: '1px solid rgba(255, 100, 100, 0.3)', color: '#ff9090', outline: 'none' }}>- Subtract XP</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row" style={{ gap: '20px' }}>
                                            <ImageUpload
                                                label="Student Avatar"
                                                onUploadComplete={(url) => setStudentFormData(p => ({ ...p, avatar: url }))}
                                                defaultImage={studentFormData.avatar}
                                                folder="academy/students"
                                            />
                                            <ImageUpload
                                                label="Cover Image"
                                                onUploadComplete={(url) => setStudentFormData(p => ({ ...p, coverImage: url }))}
                                                defaultImage={studentFormData.coverImage}
                                                folder="academy/covers"
                                            />
                                        </div>
                                        <div className="admin-member-visual-preview" style={{ margin: '10px 0', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, display: 'flex', gap: 16, alignItems: 'center' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)', marginBottom: 4 }}>Avatar</p>
                                                <Avatar src={studentFormData.avatar} name={studentFormData.name} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)', marginBottom: 4 }}>Cover</p>
                                                <div style={{ height: 50, width: '100%', borderRadius: 4, backgroundImage: studentFormData.coverImage ? `url("${studentFormData.coverImage}")` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(76,161,175,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray)', fontSize: '0.8rem' }}>
                                                    {!studentFormData.coverImage && 'No Cover'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-stats-editor" style={{ background: 'rgba(76, 161, 175, 0.1)', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid rgba(76, 161, 175, 0.3)' }}>
                                            <h4 style={{ color: '#7ec8e3', marginBottom: '10px' }}>PWA Portal Access (Sandbox)</h4>
                                            <div className="form-row">
                                                <div className="form-group"><label>Portal Passcode</label><input type="text" placeholder="e.g. SECRET123" value={studentFormData.passcode || ''} onChange={(e) => setStudentFormData({ ...studentFormData, passcode: e.target.value })} /></div>
                                                <div className="form-group"><label>Theme Color (Hex)</label><input type="text" placeholder="#141932" value={studentFormData.theme_color || ''} onChange={(e) => setStudentFormData({ ...studentFormData, theme_color: e.target.value })} /></div>
                                            </div>
                                            <div className="form-group-full">
                                                <label>Daily Task / Letter for Portal</label>
                                                <textarea
                                                    placeholder="Write a task or letter to this Student..."
                                                    value={studentFormData.daily_task || ''}
                                                    onChange={(e) => setStudentFormData({ ...studentFormData, daily_task: e.target.value })}
                                                    rows={8}
                                                    style={{ fontFamily: 'Georgia, serif', lineHeight: 1.8, resize: 'vertical', fontSize: '0.95rem' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="admin-stats-editor" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
                                            <h4 style={{ color: 'var(--color-cyan)', marginBottom: '10px' }}>Dreamer Stats (1-100)</h4>
                                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Knowledge</label><input type="number" min="0" max="100" value={studentFormData.stat_knowledge} onChange={(e) => setStudentFormData({ ...studentFormData, stat_knowledge: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Discipline</label><input type="number" min="0" max="100" value={studentFormData.stat_discipline} onChange={(e) => setStudentFormData({ ...studentFormData, stat_discipline: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Charisma</label><input type="number" min="0" max="100" value={studentFormData.stat_charisma} onChange={(e) => setStudentFormData({ ...studentFormData, stat_charisma: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Creativity</label><input type="number" min="0" max="100" value={studentFormData.stat_creativity} onChange={(e) => setStudentFormData({ ...studentFormData, stat_creativity: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Courage</label><input type="number" min="0" max="100" value={studentFormData.stat_courage} onChange={(e) => setStudentFormData({ ...studentFormData, stat_courage: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Physique</label><input type="number" min="0" max="100" value={studentFormData.stat_physique} onChange={(e) => setStudentFormData({ ...studentFormData, stat_physique: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Empathy</label><input type="number" min="0" max="100" value={studentFormData.stat_empathy} onChange={(e) => setStudentFormData({ ...studentFormData, stat_empathy: e.target.value })} /></div>
                                                <div className="form-group" style={{ margin: 0 }}><label style={{ fontSize: '0.75rem' }}>Essence</label><input type="number" min="0" max="100" value={studentFormData.stat_essence} onChange={(e) => setStudentFormData({ ...studentFormData, stat_essence: e.target.value })} /></div>
                                            </div>
                                        </div>
                                        <Button type="submit" variant="primary">💾 Save Student</Button>
                                        <Button type="button" variant="secondary" onClick={() => setEditingStudentId(null)}>Cancel</Button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray)' }}>
                                        <img src="/DreamWorldAcademy.png" alt="Academy" style={{ width: 60, marginBottom: 12, opacity: 0.6 }} />
                                        <p>Select a student from the list to edit their profile.</p>
                                        <p style={{ fontSize: '0.8rem', marginTop: 8, color: 'rgba(255,255,255,0.3)' }}>{academyStudents.length} student(s) enrolled</p>
                                    </div>
                                )}
                            </Card>

                            {/* Student List */}
                            <div className="admin-list">
                                {academyStudents.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--color-gray)', padding: '40px' }}>No students yet. Accept applications to see them here.</p>
                                ) : academyStudents.map(s => (
                                    <Card key={s.id} className="admin-item-card">
                                        <div className="admin-member-preview">
                                            <Avatar src={s.avatar} name={s.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                                            <div>
                                                <h4>{s.name}</h4>
                                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', fontSize: '0.8rem' }}>
                                                    <span style={{ color: 'var(--color-gray)' }}>{s.class}</span>
                                                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Lvl {s.level || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-item-actions">
                                            <button onClick={() => {
                                                setEditingStudentId(s.id)
                                                setStudentFormData({ 
                                                    ...s, 
                                                    coverImage: s.cover_image || '',
                                                    stat_knowledge: s.stats?.knowledge || 50,
                                                    stat_discipline: s.stats?.discipline || 50,
                                                    stat_charisma: s.stats?.charisma || 50,
                                                    stat_creativity: s.stats?.creativity || 50,
                                                    stat_courage: s.stats?.courage || 50,
                                                    stat_physique: s.stats?.physique || 50,
                                                    stat_empathy: s.stats?.empathy || 50,
                                                    stat_essence: s.stats?.essence || 50,
                                                    passcode: s.passcode || '',
                                                    theme_color: s.theme_color || '#141932',
                                                    daily_task: s.daily_task || ''
                                                })
                                            }}>✏️</button>
                                            <button onClick={() => {
                                                if (window.confirm(`Remove ${s.name} from the Academy?`)) deleteAcademyStudent(s.id)
                                            }}>🗑️</button>
                                            <button
                                                title="Generate Student ID Card"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => { setPrintingStudent(s); setStudentPrintType('id') }}
                                            >🪪</button>
                                            <button
                                                title="Generate Enrollment Certificate"
                                                style={{ marginLeft: 4 }}
                                                onClick={() => { setPrintingStudent(s); setStudentPrintType('cert') }}
                                            >📜</button>
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
                                <h3>📦 Layer 1: App Cache</h3>
                                <p className="status-desc">This is what your browser is currenty holding in memory.</p>
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
                                <h3>📊 Layer 2: Supabase DB</h3>
                                <p className="status-desc">This is your permanent, unlimited cloud database.</p>
                                <div className="status-data">
                                    {sheetData === 'error' ? (
                                        <p style={{ color: '#ff6f61' }}>❌ Supabase Connection Error. Check your Anon Key.</p>
                                    ) : sheetData ? (
                                        <div>
                                            <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✅ All Systems Operational</p>
                                            <pre>{JSON.stringify({
                                                "Database Type": sheetData.type,
                                                "Connection": "Direct SQL",
                                                "Status": "Online"
                                            }, null, 2)}</pre>
                                        </div>
                                    ) : (
                                        <p>⏳ Checking connection...</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="status-card">
                                <h3>⚡ Layer 3: Live Site</h3>
                                <p className="status-desc">All changes are now real-time! No manual production sync needed.</p>
                                <Button onClick={handleSync} variant="secondary" disabled={syncing}>
                                    {syncing ? '⌛ Refreshing...' : '🔄 Refresh UI'}
                                </Button>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Dreamer Print Overlays */}
            {
                printingDreamer && printType === 'id' && createPortal(
                    <PrintableID dreamer={printingDreamer} onClose={() => setPrintingDreamer(null)} />,
                    document.body
                )
            }
            {
                printingDreamer && printType === 'cert' && createPortal(
                    <PrintableCertificate dreamer={printingDreamer} onClose={() => setPrintingDreamer(null)} />,
                    document.body
                )
            }
            {/* Academy Student Print Overlays */}
            {
                printingStudent && studentPrintType === 'id' && createPortal(
                    <StudentIDCard student={printingStudent} onClose={() => setPrintingStudent(null)} />,
                    document.body
                )
            }
            {
                printingStudent && studentPrintType === 'cert' && createPortal(
                    <StudentCertificate student={printingStudent} onClose={() => setPrintingStudent(null)} />,
                    document.body
                )
            }
        </div >
    )
}

export default AdminDashboard
