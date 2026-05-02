import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePortal } from '../context/PortalContext'
import { useContent } from '../context/ContentContext'
import StatGraph from '../components/StatGraph'
import PrintableID from '../components/PrintableID'
import PrintableCertificate from '../components/PrintableCertificate'

export default function PortalDashboard() {
    const { user, loading } = usePortal()
    const { quests, events, announcement } = useContent()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    const [showID, setShowID] = useState(false)
    const [showCert, setShowCert] = useState(false)

    useEffect(() => {
        if (!loading && !user) navigate('/portal')
    }, [user, loading, navigate])

    if (loading || !user) return <div className="portal-loading">✨ Loading your world...</div>

    const level = Math.floor((user.points || 0) / 108)
    const xpRemainder = (user.points || 0) % 108
    const xpPercent = Math.round((xpRemainder / 108) * 100)

    const stats = {
        knowledge: user.stat_knowledge || 0,
        discipline: user.stat_discipline || 0,
        charisma: user.stat_charisma || 0,
        creativity: user.stat_creativity || 0,
        courage: user.stat_courage || 0,
        physique: user.stat_physique || 0,
        empathy: user.stat_empathy || 0,
        essence: user.stat_essence || 0,
    }

    const bio = user.bio || user.aim_in_life || ''
    const title = user.type === 'dreamer' ? (user.title || '') : `${user.class || ''} • ${user.school_name || ''}`
    const rawThemes = user.type === 'dreamer'
        ? (Array.isArray(user.themes) ? user.themes : (user.themes || '').split(',').map(t => t.trim()).filter(Boolean))
        : [user.hobbies, user.favourite_colour ? `Fav: ${user.favourite_colour}` : ''].filter(Boolean)

    const themeColor = user.theme_color || '#4CA1AF'
    const xpBarColor = '#4CA1AF'

    const dreamerForPrint = {
        ...user,
        role: user.role || '',
        coverImage: user.cover_image || '',
        joinedDate: user.joined_date || user.joinedDate || '',
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px', background: '#0d1326' }}>

            {/* ===== PROFILE TAB ===== */}
            {/* Fixed website shortcut - top right, never overlaps bottom nav */}
            <button
                onClick={() => window.open('https://abeautifuldream.in', '_blank')}
                title="Visit DreamWorld Website"
                style={{ position: 'fixed', top: 12, right: 14, zIndex: 200, background: 'rgba(0,0,0,0.5)', border: `1px solid ${themeColor}66`, color: themeColor, borderRadius: 8, padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 5 }}
            >
                🌐 Website
            </button>

            {activeTab === 'profile' && (
                <div>
                    {/* Cover Hero */}
                    <div className="portal-profile-hero" style={{
                        backgroundImage: user.cover_image
                            ? `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(13,19,38,0.95)), url(${user.cover_image})`
                            : `linear-gradient(135deg, ${themeColor}66 0%, #0d1326 100%)`
                    }}>
                        <div className="portal-profile-hero-content">
                            <img src={user.avatar || '/logo.png'} alt={user.name} className="portal-profile-avatar" style={{ borderColor: themeColor }} />
                            <div>
                                <h1 className="portal-profile-name">{user.name}</h1>
                                <p className="portal-profile-title" style={{ color: themeColor }}>{title}</p>
                                {user.isCreator && <span className="portal-creator-badge">👑 Creator</span>}
                            </div>
                        </div>
                    </div>

                    <div className="portal-content">
                        {/* Level XP */}
                        <div className="portal-card">
                            <div className="portal-xp-row">
                                <span style={{ color: themeColor, fontWeight: 700, fontSize: '1rem' }}>Dream Level {level}</span>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{xpRemainder} / 108 XP</span>
                            </div>
                            <div className="portal-xp-track">
                                <div className="portal-xp-fill" style={{ width: `${xpPercent}%`, backgroundColor: xpBarColor, boxShadow: `0 0 10px ${xpBarColor}88` }} />
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 6, textAlign: 'right' }}>Total XP: {user.points || 0}</p>
                        </div>

                        {/* Creator Tools */}
                        {user.isCreator && (
                            <div className="portal-card" style={{ borderLeft: `3px solid ${themeColor}` }}>
                                <h3 style={{ color: themeColor, marginTop: 0, marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>👑 Creator Tools</h3>
                                <Link to="/admin/dashboard" className="portal-admin-link">
                                    <span>Open Admin Dashboard</span><span>→</span>
                                </Link>
                            </div>
                        )}

                        {/* Daily Task */}
                        <div className="portal-card">
                            <p className="portal-card-title">📜 Daily Task</p>
                            {user.daily_task
                                ? <div className="portal-task" style={{ borderLeftColor: themeColor }}>{user.daily_task}</div>
                                : <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', margin: 0 }}>No task assigned yet. Rest well, Dreamer!</p>
                            }
                        </div>

                        {/* Bio */}
                        {bio && (
                            <div className="portal-card">
                                <p className="portal-card-title">📖 About</p>
                                <p style={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.82)', fontSize: '0.93rem', margin: 0 }}>{bio}</p>
                            </div>
                        )}

                        {/* Themes */}
                        {rawThemes.length > 0 && (
                            <div className="portal-card">
                                <p className="portal-card-title">✨ Themes</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {rawThemes.map((t, i) => (
                                        <span key={i} className="portal-theme-tag" style={{ borderColor: themeColor + '66', color: themeColor }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="portal-card">
                            <p className="portal-card-title">📊 Dreamer Stats</p>
                            <StatGraph stats={stats} />
                        </div>

                        {/* ID & Certificate */}
                        {user.type === 'dreamer' && (
                            <div className="portal-card">
                                <p className="portal-card-title">🪪 Documents</p>
                                <button onClick={() => setShowID(true)} className="portal-doc-btn" style={{ borderColor: themeColor, color: themeColor }}>
                                    🪪 View & Print ID Card
                                </button>
                                <button onClick={() => setShowCert(true)} className="portal-doc-btn" style={{ borderColor: themeColor, color: themeColor, marginTop: 8 }}>
                                    🏅 View & Print Certificate
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== QUESTS TAB ===== */}
            {activeTab === 'quests' && (
                <div className="portal-content">
                    <h2 className="portal-tab-title" style={{ color: themeColor }}>⚔️ Active Quests</h2>
                    {quests && quests.length > 0 ? quests.map(q => (
                        <div key={q.id} className="portal-card portal-quest-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span className={`portal-quest-badge portal-quest-${q.difficulty}`}>{q.difficulty}</span>
                                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{q.timeNeeded || q.time_needed || ''}</span>
                            </div>
                            <h3 className="portal-quest-title">{q.title}</h3>
                            <p className="portal-quest-desc">{q.purpose}</p>
                            {q.impact && <p style={{ fontSize: '0.8rem', color: themeColor, marginTop: 8, marginBottom: 0 }}>💡 {q.impact}</p>}
                        </div>
                    )) : (
                        <div className="portal-empty-state"><span>⚔️</span><p>No quests available right now.</p></div>
                    )}
                </div>
            )}

            {/* ===== EVENTS TAB ===== */}
            {activeTab === 'events' && (
                <div className="portal-content">
                    <h2 className="portal-tab-title" style={{ color: themeColor }}>📅 Events</h2>
                    {events && events.length > 0 ? events.map(ev => (
                        <div key={ev.id} className="portal-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{ev.title}</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>🗓 {ev.date || 'TBD'}</p>
                                </div>
                                <span className={`portal-event-type portal-event-${ev.type}`}>{ev.type}</span>
                            </div>
                            {ev.description && <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, marginBottom: 0 }}>{ev.description}</p>}
                            {ev.location && <p style={{ fontSize: '0.8rem', color: themeColor, marginTop: 8, marginBottom: 0 }}>📍 {ev.location}</p>}
                            {ev.registrationLink && (
                                <a href={ev.registrationLink} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'block', textAlign: 'center', marginTop: 14, padding: '10px', background: themeColor, color: '#0d1326', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                                    Register →
                                </a>
                            )}
                        </div>
                    )) : (
                        <div className="portal-empty-state"><span>📅</span><p>No upcoming events yet.</p></div>
                    )}
                </div>
            )}

            {/* ===== NOTICE TAB ===== */}
            {activeTab === 'notice' && (
                <div className="portal-content">
                    <h2 className="portal-tab-title" style={{ color: themeColor }}>📣 Notice Board</h2>
                    {announcement ? (
                        <div className="portal-card" style={{ borderLeft: `3px solid ${themeColor}` }}>
                            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 8, marginTop: 0 }}>{announcement.date}</p>
                            <h3 style={{ marginTop: 0, color: themeColor, fontSize: '1.1rem' }}>{announcement.title}</h3>
                            <p style={{ lineHeight: 1.72, color: 'rgba(255,255,255,0.82)', fontSize: '0.93rem', marginBottom: announcement.linkText ? 16 : 0 }}>{announcement.content}</p>
                            {announcement.linkText && announcement.linkTo && (
                                <a href={announcement.linkTo}
                                    style={{ display: 'inline-block', padding: '10px 20px', background: themeColor, color: '#0d1326', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                                    {announcement.linkText}
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="portal-empty-state"><span>📣</span><p>No announcements at the moment.</p></div>
                    )}
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="portal-bottom-nav">
                {[
                    { id: 'profile', icon: '👤', label: 'My Profile' },
                    { id: 'quests', icon: '⚔️', label: 'Quests' },
                    { id: 'events', icon: '📅', label: 'Events' },
                    { id: 'notice', icon: '📣', label: 'Notice' },
                ].map(tab => (
                    <button key={tab.id}
                        className={`portal-nav-btn ${activeTab === tab.id ? 'portal-nav-active' : ''}`}
                        style={{ '--tab-color': themeColor }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="portal-nav-icon">{tab.icon}</span>
                        <span className="portal-nav-label">{tab.label}</span>
                    </button>
                ))}
            </nav>

            {showID && <PrintableID dreamer={dreamerForPrint} onClose={() => setShowID(false)} readOnly />}
            {showCert && <PrintableCertificate dreamer={dreamerForPrint} onClose={() => setShowCert(false)} readOnly />}
        </div>
    )
}
