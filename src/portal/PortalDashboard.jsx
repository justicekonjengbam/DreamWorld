import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usePortal } from '../context/PortalContext'
import SpiderGraph from '../components/SpiderGraph'

export default function PortalDashboard() {
    const { user, loading, logout } = usePortal()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/portal')
        }
    }, [user, loading, navigate])

    const handleLogout = () => {
        logout()
        navigate('/portal')
    }

    if (loading || !user) return <div className="portal-login">Loading...</div>

    // Common properties mapped for both Dreamers and Students
    const level = Math.floor((user.points || 0) / 108)
    const xpRemainder = (user.points || 0) % 108
    const statsData = [
        { subject: 'Knowledge', A: user.stat_knowledge || 50, fullMark: 100 },
        { subject: 'Discipline', A: user.stat_discipline || 50, fullMark: 100 },
        { subject: 'Charisma', A: user.stat_charisma || 50, fullMark: 100 },
        { subject: 'Creativity', A: user.stat_creativity || 50, fullMark: 100 },
        { subject: 'Courage', A: user.stat_courage || 50, fullMark: 100 },
        { subject: 'Physique', A: user.stat_physique || 50, fullMark: 100 },
        { subject: 'Empathy', A: user.stat_empathy || 50, fullMark: 100 },
        { subject: 'Essence', A: user.stat_essence || 50, fullMark: 100 },
    ]

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <header className="portal-header">
                <h2>DW Portal</h2>
                <button onClick={handleLogout} className="portal-logout">Logout</button>
            </header>

            <div className="portal-content">
                <div className="portal-welcome">
                    <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="portal-avatar" />
                    <div>
                        <h1>Welcome back, {user.name}</h1>
                        <p>Level {level} • {user.type === 'dreamer' ? user.title : user.class}</p>
                    </div>
                </div>

                {user.isCreator && (
                    <div className="portal-card" style={{ borderLeft: '4px solid #ff6f61' }}>
                        <h3 style={{ color: '#ff6f61' }}>👑 Creator Tools</h3>
                        <Link to="/admin" className="portal-admin-link">
                            <span>Open Admin Dashboard</span>
                            <span>→</span>
                        </Link>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>
                            Your Dreamer stats are shown below.
                        </p>
                    </div>
                )}

                <div className="portal-card">
                    <h3>📜 Your Daily Task</h3>
                    {user.daily_task ? (
                        <div className="portal-task">
                            {user.daily_task}
                        </div>
                    ) : (
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>No tasks assigned right now. Rest well!</p>
                    )}
                </div>

                <div className="portal-card">
                    <h3>📊 Profile Stats</h3>
                    <div style={{ padding: '20px 0' }}>
                        <SpiderGraph data={statsData} height={250} />
                    </div>
                    
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5 }}>
                            <span>Level {level}</span>
                            <span>{xpRemainder} / 108 XP</span>
                        </div>
                        <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', 
                                background: 'var(--color-accent)', 
                                width: `${(xpRemainder / 108) * 100}%`,
                                transition: 'width 1s ease-out' 
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
