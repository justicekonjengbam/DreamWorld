import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import SectionHeader from '../components/SectionHeader'
import './AcademyStudents.css'

function AcademyStudents() {
    const { academyStudents, loading } = useContent()

    if (loading) return <div className="loading-state">Summoning the Academy Scrolls...</div>

    return (
        <div className="academy-students page">
            <div className="container">
                <div className="academy-students-hero">
                    <img src="/DreamWorldAcademy.png" alt="DreamWorld Academy" className="academy-students-badge" />
                    <h1>Academy Students</h1>
                    <p>Meet the young dreamers enrolled in DreamWorld Academy — each forging their own destiny.</p>
                </div>

                <SectionHeader
                    title="The Roll of Honor"
                    subtitle={`${academyStudents.length} student${academyStudents.length !== 1 ? 's' : ''} currently enrolled`}
                />

                {academyStudents.length === 0 ? (
                    <div className="academy-empty">
                        <p>🏫 No students yet. Be the first to enroll!</p>
                        <Link to="/academy" className="academy-enroll-link">📜 Enroll Now</Link>
                    </div>
                ) : (
                    <>
                        <div className="leaderboard-section">
                            <h2 className="leaderboard-title">Top Students</h2>
                            <div className="leaderboard-podium">
                                {[...academyStudents]
                                    .sort((a, b) => (b.points || 0) - (a.points || 0))
                                    .slice(0, 3)
                                    .map((student, index) => {
                                        const rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : 'rank-bronze';
                                        const xp = ((student.points || 0) % 108) / 108 * 100;
                                        return (
                                            <Link to={`/academy/students/${student.id}`} key={`top-${student.id}`} className={`leaderboard-card ${rankClass}`}>
                                                <div className="rank-badge">#{index + 1}</div>
                                                <img src={student.avatar || '/DreamWorldAcademy.png'} alt={student.name} className="leaderboard-avatar" onError={(e) => { e.target.src = '/DreamWorldAcademy.png' }} />
                                                <div className="leaderboard-info">
                                                    <h3>{student.name}</h3>
                                                    <p className="leaderboard-role">{student.class}</p>
                                                    <div className="leaderboard-level">Lvl {student.level || 0}</div>
                                                    <div className="xp-bar-container">
                                                        <div className="xp-bar-fill" style={{ width: `${xp}%` }}></div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className="academy-students-grid">
                        {academyStudents.map(student => {
                            return (
                                <Link
                                    to={`/academy/students/${student.id}`}
                                    key={student.id}
                                    className="student-card-link"
                                >
                                    <div className="student-card">
                                        {/* Cover banner */}
                                        <div
                                            className="student-card-cover"
                                            style={{ backgroundImage: `url(/AcademyBackground.png)` }}

                                        />

                                        {/* Avatar */}
                                        <div className="student-card-avatar-wrap">
                                            <img
                                                src={student.avatar || '/DreamWorldAcademy.png'}
                                                alt={student.name}
                                                className="student-card-avatar"
                                                onError={(e) => { e.target.src = '/DreamWorldAcademy.png' }}
                                            />
                                        </div>

                                        <div className="student-card-body">
                                            <h3 className="student-card-name">{student.name}</h3>
                                            <p className="student-card-class">{student.class}</p>
                                            {student.school_name && (
                                                <p className="student-card-school">🏫 {student.school_name}</p>
                                            )}

                                            <div className="student-card-badges">
                                                <span className="student-badge colour-badge">
                                                    🎨 {student.favourite_colour}
                                                </span>
                                                <span className="student-badge animal-badge">
                                                    🐾 {student.favourite_animal}
                                                </span>
                                            </div>

                                            {/* Level bar */}
                                            <div className="student-level-bar">
                                                <div className="level-label">
                                                    <span>Dream Level {student.level || 0}</span>
                                                    <span>{student.points || 0} XP</span>
                                                </div>
                                                <div className="level-track">
                                                    <div
                                                        className="level-fill"
                                                        style={{ width: `${(((student.points || 0) % 108) / 108) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="student-card-footer">
                                            <span className="view-profile">View Profile →</span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    </>
                )}

                <div className="academy-cta">
                    <Link to="/academy">
                        <button className="academy-join-btn">📜 Apply to the Academy</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AcademyStudents
