import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePortal } from '../context/PortalContext'
import { useContent } from '../context/ContentContext'
import StatGraph from '../components/StatGraph'
import PrintableID from '../components/PrintableID'
import PrintableCertificate from '../components/PrintableCertificate'
import { useAudio } from '../context/AudioContext'
import { useTheme } from '../context/ThemeContext'

export default function PortalDashboard() {
    const { user, loading } = usePortal()
    const { quests, events, announcement } = useContent()
    const { 
        isSoundMuted, setIsSoundMuted, 
        musicVolume, setMusicVolume, 
        buttonVolume, setButtonVolume 
    } = useAudio()
    const { gradientTheme, setGradientTheme, themeMode, setThemeMode, resetTheme, themeGradients } = useTheme()

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    const [showID, setShowID] = useState(false)
    const [showCert, setShowCert] = useState(false)
    const [showAdminModal, setShowAdminModal] = useState(false)
    const [adminPassword, setAdminPassword] = useState('')
    const [adminPasswordError, setAdminPasswordError] = useState('')

    const handleMusicVolumeChange = (e) => {
        const val = parseFloat(e.target.value)
        setMusicVolume(val)
        if (val > 0 && isSoundMuted) {
            setIsSoundMuted(false)
        }
    }

    const handleButtonVolumeChange = (e) => {
        setButtonVolume(parseFloat(e.target.value))
    }

    const gradientDisplayNames = {
        nebula: 'Celestial Nebula',
        solar: 'Solar Flare',
        ocean: 'Deep Ocean',
        forest: 'Emerald Forest',
        void: 'Void Rift',
        crimson: 'Crimson Eclipse',
        silver: 'Lunar Dust'
    }


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

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    const handleAdminAccess = () => {
        const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'dreamworld2026'
        if (adminPassword === ADMIN_PASSWORD) {
            // Auto-set the admin token so AdminLogin is bypassed
            localStorage.setItem('dw_admin_token', 'logged_in_' + Date.now())
            sessionStorage.setItem('dw_admin_pass', adminPassword)
            setShowAdminModal(false)
            setAdminPassword('')
            setAdminPasswordError('')
            navigate('/admin/dashboard')
        } else {
            setAdminPasswordError('Incorrect password. Try again.')
        }
    }

    const tabs = [
        { id: 'profile', icon: '👤', label: 'Profile' },
        { id: 'daily', icon: '📜', label: 'Daily' },
        { id: 'quests', icon: '⚔️', label: 'Quests' },
        { id: 'events', icon: '📅', label: 'Events' },
        { id: 'notice', icon: '📣', label: 'Notice' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
        ...(user.isCreator ? [{ id: 'admin', icon: '👑', label: 'Admin' }] : [])
    ]

    return (
        <div className="portal-dashboard-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>


            {/* Fixed top-right website button */}
            <button
                onClick={() => window.open('https://abeautifuldream.in', '_blank')}
                title="Visit DreamWorld Website"
                style={{ position: 'fixed', top: 12, right: 14, zIndex: 200, background: 'rgba(0,0,0,0.5)', border: `1px solid ${themeColor}66`, color: themeColor, borderRadius: 8, padding: '5px 11px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
            >
                🌐 Go to DreamWorld
            </button>

            {/* ===== PROFILE TAB ===== */}
            {activeTab === 'profile' && (
                <div>
                    <div className="portal-profile-hero" style={{
                        backgroundImage: user.cover_image
                            ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(13,19,38,0.92)), url(${user.cover_image})`
                            : `linear-gradient(160deg, ${themeColor}55 0%, #0d1326 100%)`
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
                        <div className="portal-card">
                            <div className="portal-xp-row">
                                 <span style={{ color: themeColor, fontWeight: 700, fontSize: '1rem' }}>Dream Level {level}</span>
                                 <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{xpRemainder} / 108 XP</span>
                            </div>
                            <div className="portal-xp-track">
                                <div className="portal-xp-fill" style={{ width: `${xpPercent}%`, backgroundColor: xpBarColor, boxShadow: `0 0 10px ${xpBarColor}88` }} />
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'right' }}>Total XP: {user.points || 0}</p>
                        </div>

                        {bio && (
                            <div className="portal-card">
                                <p className="portal-card-title">📖 About</p>
                                <p style={{ lineHeight: 1.75, color: 'var(--color-text-semi)', fontSize: '0.93rem', margin: 0 }}>{bio}</p>
                            </div>
                        )}

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

                        <div className="portal-card">
                            <p className="portal-card-title">📊 Dreamer Stats</p>
                            <StatGraph stats={stats} />
                        </div>

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

            {/* ===== DAILY TASK TAB ===== */}
            {activeTab === 'daily' && (
                <div className="portal-content">
                    <h2 className="portal-tab-title" style={{ color: themeColor }}>📜 Daily Scroll</h2>
                    <div className="portal-scroll-wrap">
                        {user.daily_task ? (
                            <div className="portal-scroll">
                                <div className="portal-scroll-date">{today}</div>
                                <div className="portal-scroll-body">{user.daily_task}</div>
                                <div className="portal-scroll-seal">— The Creator, DreamWorld —</div>
                            </div>
                        ) : (
                            <div className="portal-empty-state">
                                <span>📜</span>
                                <p>No task has been assigned yet. Rest and prepare, Dreamer.</p>
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
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{q.timeNeeded || q.time_needed || ''}</span>
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
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>🗓 {ev.date || 'TBD'}</p>
                                </div>
                                <span className={`portal-event-type portal-event-${ev.type}`}>{ev.type}</span>
                            </div>
                            {ev.description && <p style={{ marginTop: 10, fontSize: '0.9rem', color: 'var(--color-text-semi)', lineHeight: 1.55, marginBottom: 0 }}>{ev.description}</p>}
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
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: 8, marginTop: 0 }}>{announcement.date}</p>
                            <h3 style={{ marginTop: 0, color: themeColor, fontSize: '1.1rem' }}>{announcement.title}</h3>
                            <p style={{ lineHeight: 1.72, color: 'var(--color-text-semi)', fontSize: '0.93rem', marginBottom: announcement.linkText ? 16 : 0 }}>{announcement.content}</p>
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
            {/* ===== SETTINGS TAB ===== */}
            {activeTab === 'settings' && (
                <div className="portal-content">
                    <h2 className="portal-tab-title" style={{ color: themeColor }}>⚙️ Settings</h2>
                    
                    {/* Light/Dark Toggle Card */}
                    <div className="portal-card">
                        <h3 className="portal-card-title">🌓 Theme Mode</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                            <div>
                                <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', color: 'var(--color-primary)' }}>Celestial Alignment</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Midnight Dark or Alabaster Light</span>
                            </div>
                            <button 
                                className="portal-doc-btn" 
                                style={{ 
                                    width: 'auto', 
                                    padding: '6px 14px', 
                                    borderColor: themeColor, 
                                    color: themeColor,
                                    background: 'transparent'
                                }}
                                onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                            >
                                {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
                            </button>
                        </div>
                    </div>

                    <div className="portal-card">
                        <h3 className="portal-card-title">🔮 Audio Configuration</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
                            
                            {/* Mute Control */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', color: 'var(--color-primary)' }}>Master Sound Mute</span>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Toggle all background sounds</span>
                                </div>
                                <button 
                                    className="portal-doc-btn" 
                                    style={{ 
                                        width: 'auto', 
                                        padding: '6px 14px', 
                                        borderColor: isSoundMuted ? '#ff6f61' : themeColor, 
                                        color: isSoundMuted ? '#ff6f61' : themeColor,
                                        background: isSoundMuted ? 'rgba(255,111,97,0.1)' : 'transparent'
                                    }}
                                    onClick={() => setIsSoundMuted(!isSoundMuted)}
                                >
                                    {isSoundMuted ? '🔇 Muted' : '🔊 Active'}
                                </button>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0' }} />

                            {/* Music Volume Slider */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', color: 'var(--color-primary)' }}>Melodic Volume</span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Ambient soundtrack level</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: themeColor }}>{Math.round(musicVolume * 100)}%</span>
                                        <button 
                                            onClick={() => setMusicVolume(0.5)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                                <div className="slider-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05" 
                                        value={musicVolume} 
                                        onChange={handleMusicVolumeChange}
                                        className="fantasy-slider"
                                        style={{ 
                                            width: '100%',
                                            '--slider-fill': `${musicVolume * 100}%` 
                                        }}
                                    />
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0' }} />

                            {/* Button Sound Volume Slider */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'block', color: 'var(--color-primary)' }}>Interface Clicks</span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Button feedback level</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: themeColor }}>{Math.round(buttonVolume * 100)}%</span>
                                        <button 
                                            onClick={() => setButtonVolume(0.7)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                                <div className="slider-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05" 
                                        value={buttonVolume} 
                                        onChange={handleButtonVolumeChange}
                                        className="fantasy-slider"
                                        style={{ 
                                            width: '100%',
                                            '--slider-fill': `${buttonVolume * 100}%` 
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="portal-card">
                        <h3 className="portal-card-title">🎨 Celestial Theme Gradient</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-semi)', lineHeight: '1.4', margin: '8px 0 16px' }}>
                            Repaint the overall atmosphere of DreamWorld. Select a preset below to instantly transform cards, borders, buttons, and backgrounds globally in real-time.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.keys(themeGradients).map((themeName) => {
                                const gradSet = themeGradients[themeName]
                                const grad = gradSet[themeMode] || gradSet.dark
                                return (
                                    <button 
                                        key={themeName}
                                        onClick={() => setGradientTheme(themeName)}
                                        style={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            width: '100%',
                                            padding: '10px 14px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: `1.5px solid ${gradientTheme === themeName ? grad['--color-accent'] : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: '12px',
                                            color: gradientTheme === themeName ? grad['--color-primary'] : 'var(--color-text-semi)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.3s ease',
                                            position: 'relative'
                                        }}
                                    >
                                        <div 
                                            style={{ 
                                                width: '28px', 
                                                height: '28px', 
                                                borderRadius: '50%', 
                                                background: grad['--gradient-body'],
                                                border: `1.5px solid ${grad['--color-primary']}`,
                                                flexShrink: 0
                                            }} 
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>{gradientDisplayNames[themeName]}</span>
                                        {gradientTheme === themeName && <span style={{ color: grad['--color-primary'], fontWeight: 'bold' }}>✦ Active</span>}
                                    </button>
                                )
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <button 
                                onClick={resetTheme}
                                style={{ 
                                    background: 'transparent', 
                                    border: `1px solid var(--color-text-muted)`, 
                                    borderRadius: '8px',
                                    color: 'var(--color-text-semi)', 
                                    fontSize: '0.8rem', 
                                    padding: '6px 12px',
                                    cursor: 'pointer', 
                                    transition: 'all 0.2s' 
                                }}
                            >
                                Reset Theme to Default
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className={`portal-bottom-nav ${tabs.length === 5 ? 'five-tabs' : tabs.length === 6 ? 'six-tabs' : tabs.length >= 7 ? 'seven-tabs' : ''}`}>
                {tabs.map(tab => (
                    <button key={tab.id}
                        className={`portal-nav-btn ${activeTab === tab.id ? 'portal-nav-active' : ''}`}
                        style={{ '--tab-color': tab.id === 'admin' ? '#ff6f61' : themeColor }}
                        onClick={() => {
                            if (tab.id === 'admin') {
                                setAdminPassword('')
                                setAdminPasswordError('')
                                setShowAdminModal(true)
                            } else {
                                setActiveTab(tab.id)
                            }
                        }}
                    >
                        <span className="portal-nav-icon">{tab.icon}</span>
                        <span className="portal-nav-label">{tab.label}</span>
                    </button>
                ))}
            </nav>

            {/* Admin Password Modal */}
            {showAdminModal && (
                <div className="portal-admin-modal" onClick={(e) => { if (e.target === e.currentTarget) { setShowAdminModal(false); setAdminPassword('') } }}>
                    <div className="portal-admin-modal-box">
                        <div style={{ fontSize: '2rem', marginBottom: 12 }}>👑</div>
                        <h3 style={{ color: '#ff6f61', marginBottom: 6, fontSize: '1.1rem' }}>Creator Access</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>Enter your admin password to continue.</p>
                        <input
                            type="password"
                            className="portal-input"
                            placeholder="Admin Password"
                            value={adminPassword}
                            onChange={e => { setAdminPassword(e.target.value); setAdminPasswordError('') }}
                            onKeyDown={e => e.key === 'Enter' && handleAdminAccess()}
                            autoFocus
                            style={{ letterSpacing: 2, marginBottom: 12 }}
                        />
                        {adminPasswordError && <p className="portal-error">{adminPasswordError}</p>}
                        <button
                            onClick={handleAdminAccess}
                            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #ff6f61, #ff9a8b)', border: 'none', borderRadius: 12, color: '#1a0a08', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', marginTop: 4 }}
                        >
                            Enter Admin Panel →
                        </button>
                        <button
                            onClick={() => { setShowAdminModal(false); setAdminPassword('') }}
                            style={{ marginTop: 12, background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showID && <PrintableID dreamer={dreamerForPrint} onClose={() => setShowID(false)} readOnly />}
            {showCert && <PrintableCertificate dreamer={dreamerForPrint} onClose={() => setShowCert(false)} readOnly />}
        </div>
    )
}
