import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import './Academy.css'
import './AcademyStudents.css'

function Academy() {
    const { academyStudents, loading } = useContent()

    return (
        <div className="academy page">

            {/* Hero Section */}
            <section className="academy-hero">
                <div className="academy-hero-bg" />
                <div className="container academy-hero-content">
                    <p className="academy-hero-tagline">A Beautiful Dream presents</p>
                    <img src="/DreamWorldAcademy.png" alt="DreamWorld Academy" className="academy-hero-logo" />
                    <h1 className="academy-hero-title">DreamWorld Academy</h1>
                    <p className="academy-hero-desc">
                        A mystical school where every young dreamer discovers their unique gifts
                        and begins their journey to shape a better world.
                        <br /><br />
                        Ancient knowledge. Character growth. Honour &amp; community.
                        Your legend starts here.
                    </p>
                    <div className="academy-hero-btns">
                        <Link to="/academy/enroll"><Button variant="primary">📜 Apply Now</Button></Link>
                        <Link to="/academy/students"><Button variant="secondary">🎓 Meet Our Students</Button></Link>
                    </div>
                </div>
            </section>


            {/* What is the Academy */}
            <section className="academy-about container">
                <SectionHeader
                    title="What is the Academy?"
                    subtitle="A place where young minds are awakened and destinies are forged"
                />
                <div className="academy-pillars-grid">
                    <div className="academy-pillar">
                        <div className="pillar-icon">📚</div>
                        <h3>Ancient Knowledge</h3>
                        <p>Dive into subjects that blend curiosity, creativity, and the timeless wisdom of the world.</p>
                    </div>
                    <div className="academy-pillar">
                        <div className="pillar-icon">🌱</div>
                        <h3>Character Growth</h3>
                        <p>Earn XP, level up your character, and build a profile that reflects who you truly are.</p>
                    </div>
                    <div className="academy-pillar">
                        <div className="pillar-icon">🏅</div>
                        <h3>Honours & Certificates</h3>
                        <p>Receive your official DreamWorld Academy ID card and certificate of enrollment.</p>
                    </div>
                    <div className="academy-pillar">
                        <div className="pillar-icon">🌍</div>
                        <h3>A Community of Dreamers</h3>
                        <p>Join a fellowship of young changemakers guided by the Dreamers of DreamWorld.</p>
                    </div>
                </div>
            </section>

            {/* Students */}
            <section className="container academy-students-section">
                <SectionHeader
                    title="🎓 Our Students"
                    subtitle={loading ? 'Loading...' : `${academyStudents.length} student${academyStudents.length !== 1 ? 's' : ''} currently enrolled`}
                />

                {!loading && academyStudents.length === 0 ? (
                    <div className="academy-empty">
                        <p>🏫 No students yet — be the first to enroll!</p>
                        <Link to="/academy/enroll" className="academy-enroll-link">📜 Apply Now</Link>
                    </div>

                ) : (
                    <div className="academy-students-grid">
                        {academyStudents.map(student => {
                            const level = Math.floor((student.points || 0) / 100)
                            return (
                                <Link
                                    to={`/academy/students/${student.id}`}
                                    key={student.id}
                                    className="student-card-link"
                                >
                                    <div className="student-card">
                                        <div
                                            className="student-card-cover"
                                            style={{ backgroundImage: `url(/AcademyBackground.png)` }}

                                        />
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
                                            {student.school_name && <p className="student-card-school">🏫 {student.school_name}</p>}
                                            <div className="student-card-badges">
                                                <span className="student-badge colour-badge">🎨 {student.favourite_colour}</span>
                                                <span className="student-badge animal-badge">🐾 {student.favourite_animal}</span>
                                            </div>
                                            <div className="student-level-bar">
                                                <div className="level-label">
                                                    <span>Dream Level {level}</span>
                                                    <span>{student.points || 0} XP</span>
                                                </div>
                                                <div className="level-track">
                                                    <div className="level-fill" style={{ width: `${(student.points || 0) % 100}%` }} />
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
                )}
            </section>
        </div>
    )
}

export default Academy
