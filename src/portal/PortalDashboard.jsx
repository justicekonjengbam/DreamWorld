import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePortal } from '../context/PortalContext'
import { useContent } from '../context/ContentContext'
import StatGraph from '../components/StatGraph'

export default function PortalDashboard() {
    const { user, loading, logout } = usePortal()
    const { quests, events, announcement } = useContent()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(() => {
        if (!loading && !user) navigate('/portal')
    }, [user, loading, navigate])

    const handleLogout = () => { logout(); navigate('/portal') }

    if (loading || !user) return <div className="portal-loading">Loading your world...</div>

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
    const title = user.type === 'dreamer' ? user.title : `${user.class} • ${user.school_name || ''}`
    const themes = user.type === 'dreamer'
        ? (Array.isArray(user.themes) ? user.themes : (user.themes || '').split(',').map(t => t.trim()).filter(Boolean))
        : [user.hobbies, user.favourite_colour ? `Fav Color: ${user.favourite_colour}` : ''].filter(Boolean)

    const themeColor = user.theme_color || '#4CA1AF'

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>

            {/* Top Header */}
            <header className="portal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/logo.png" alt="DW" style={{ width: 32, mixBlendMode: 'screen', filter: 'brightness(1.2)' }} />
                    <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: 1 }}>DREAMWORLD</span>
                </div>
                <button onClick={handleLogout} className="portal-logout">Exit Portal</button>
            </header>

            {/* Tab Content */}
            <div className="portal-content">

                {/* ===== PROFILE TAB ===== */}
                {activeTab === 'profile' && (
                    <div>
                        {/* Cover + Avatar Hero */}
                        <div className="portal-profile-hero" style={{ backgroundImage: user.cover_image ? `url(${user.cover_image})` : `linear-gradient(135deg, ${themeColor}44, #0d1326)` }}>
                            <div className="portal-profile-hero-overlay" />
                            <div className="portal-profile-hero-content">
                                <img src={user.avatar || '/logo.png'} alt={user.name} className="portal-profile-avatar" />
                                <div>
                                    <h1 className="portal-profile-name">{user.name}</h1>
                                    <p className="portal-profile-title" style={{ color: themeColor }}>{title}</p>
                                    {user.isCreator && <span className="portal-creator-badge">👑 Creator</span>}
                                </div>
                            </div>
                        </div>

                        {/* Level & XP */}
                        <div className="portal-card">
                            <div className="portal-xp-row">
                                <span className="portal-xp-level" style={{ color: themeColor }}>Dream Level {level}</span>
                                <span className="portal-xp-count">{xpRemainder} / 108 XP</span>
                            </div>
                            <div className="portal-xp-track">
                                <div className="portal-xp-fill" style={{ width: `${xpPercent}%`, background: themeColor }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 6, textAlign: 'right' }}>
                                Total XP: {user.points || 0}
                            </p>
                        </div>

                        {/* Creator Tools */}
                        {user.isCreator && (
                            <div className="portal-card" style={{ borderLeft: `4px solid ${themeColor}` }}>
                                <h3 style={{ color: themeColor, marginTop: 0 }}>👑 Creator Tools</h3>
                                <Link to="/admin/dashboard" className="portal-admin-link">
                                    <span>Open Admin Dashboard</span><span>→</span>
                                </Link>
                            </div>
                        )}

                        {/* Daily Task */}
                        <div className="portal-card">
                            <h3 className="portal-card-title">📜 Daily Task</h3>
                            {user.daily_task
                                ? <div className="portal-task" style={{ borderLeftColor: themeColor }}>{user.daily_task}</div>
                                : <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No task assigned yet. Rest well, Dreamer!</p>
                            }
                        </div>

                        {/* Bio */}
                        {bio && (
                            <div className="portal-card">
                                <h3 className="portal-card-title">📖 Bio</h3>
                                <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{bio}</p>
                            </div>
                        )}

                        {/* Themes / Tags */}
                        {themes.length > 0 && (
                            <div className="portal-card">
                                <h3 className="portal-card-title">✨ Themes</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {themes.map((t, i) => (
                                        <span key={i} className="portal-theme-tag" style={{ borderColor: themeColor + '88', color: themeColor }}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dreamer Stats Spider Graph */}
                        <div className="portal-card">
                            <h3 className="portal-card-title">📊 Dreamer Stats</h3>
                            <StatGraph stats={stats} />
                        </div>
                    </div>
                )}

                {/* ===== QUESTS TAB ===== */}
                {activeTab === 'quests' && (
                    <div>
                        <h2 className="portal-tab-title">⚔️ Active Quests</h2>
                        {quests && quests.length > 0 ? quests.map(q => (
                            <div key={q.id} className="portal-card portal-quest-card">
                                <div className="portal-quest-header">
                                    <span className={`portal-quest-badge portal-quest-${q.difficulty}`}>{q.difficulty}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{q.timeNeeded || q.time_needed || ''}</span>
                                </div>
                                <h3 className="portal-quest-title">{q.title}</h3>
                                <p className="portal-quest-desc">{q.purpose}</p>
                                {q.impact && <p style={{ fontSize: '0.8rem', color: themeColor, marginTop: 6 }}>💡 {q.impact}</p>}
                            </div>
                        )) : (
                            <div className="portal-empty-state">
                                <span>⚔️</span>
                                <p>No quests available right now.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== EVENTS TAB ===== */}
                {activeTab === 'events' && (
                    <div>
                        <h2 className="portal-tab-title">📅 Events</h2>
                        {events && events.length > 0 ? events.map(ev => (
                            <div key={ev.id} className="portal-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{ev.title}</h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>🗓 {ev.date || 'TBD'} • {ev.type}</p>
                                    </div>
                                    <span className={`portal-event-type portal-event-${ev.type}`}>{ev.type}</span>
                                </div>
                                {ev.description && <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{ev.description}</p>}
                                {ev.location && <p style={{ fontSize: '0.8rem', color: themeColor, marginTop: 6 }}>📍 {ev.location}</p>}
                                {ev.registrationLink && (
                                    <a href={ev.registrationLink} target="_blank" rel="noopener noreferrer" className="portal-btn" style={{ display: 'block', textAlign: 'center', marginTop: 12, textDecoration: 'none' }}>Register →</a>
                                )}
                            </div>
                        )) : (
                            <div className="portal-empty-state">
                                <span>📅</span>
                                <p>No upcoming events yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== NOTICE TAB ===== */}
                {activeTab === 'notice' && (
                    <div>
                        <h2 className="portal-tab-title">📣 Notice Board</h2>
                        {announcement ? (
                            <div className="portal-card" style={{ borderLeft: `4px solid ${themeColor}` }}>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{announcement.date}</p>
                                <h3 style={{ marginTop: 0, color: themeColor }}>{announcement.title}</h3>
                                <p style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{announcement.content}</p>
                                {announcement.linkText && announcement.linkTo && (
                                    <Link to={announcement.linkTo} className="portal-btn" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none', padding: '10px 20px', borderRadius: 10, background: themeColor, color: '#0d1326', fontWeight: 700 }}>
                                        {announcement.linkText}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="portal-empty-state">
                                <span>📣</span>
                                <p>No announcements at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="portal-bottom-nav">
                {[
                    { id: 'profile', icon: '👤', label: 'My Profile' },
                    { id: 'quests', icon: '⚔️', label: 'Quests' },
                    { id: 'events', icon: '📅', label: 'Events' },
                    { id: 'notice', icon: '📣', label: 'Notice' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`portal-nav-btn ${activeTab === tab.id ? 'portal-nav-active' : ''}`}
                        style={{ '--tab-color': themeColor }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="portal-nav-icon">{tab.icon}</span>
                        <span className="portal-nav-label">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}
