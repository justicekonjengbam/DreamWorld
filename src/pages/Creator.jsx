import './Creator.css'


function Creator() {
  return (
    <div className="creator-page page">
      <div className="container">
        {/* Logo at top - moved outside creator-container */}
        <div className="page-hero">
          <img src="/logo.png" alt="DreamWorld Logo" className="page-logo" />
        </div>

        <div className="creator-container">
          <div className="creator-header">
            <img 
              src="/Creator.png" 
              alt="Creator Avatar" 
              className="creator-avatar"
            />
            <div className="creator-intro">
              <h1>Justice Konjengbam</h1>
              <p className="title">Project Assistant | CSC Dept | IIT Dharwad</p>
              <p className="bio">
                Building DreamWorld—where technology meets nature, and every quest brings us closer to the world we dream of creating.
              </p>
            </div>
          </div>

          <div className="creator-section">
            <h2>About Me</h2>
            <p>
              I'm Justice, working at IIT Dharwad as a Project Assistant in the Computer Science department. DreamWorld is my passion project—a universe where learning, building, and growing happen through weekly quests that make real impact.
            </p>
            <p>
              I believe in learning by doing, building in public, and creating communities that uplift everyone. This project combines my love for technology, storytelling, and making knowledge accessible to all.
            </p>
          </div>

          <div className="creator-section">
            <h2>What I'm Building</h2>
            <ul>
              <li>Weekly quest system that makes learning fun and practical</li>
              <li>Character guides inspired by real practices and wisdom</li>
              <li>Community space for dreamers and doers</li>
              <li>Tools that blend technology with sustainable living</li>
            </ul>
          </div>

          <div className="creator-section">
            <h2>My Journey</h2>
            <p>
              DreamWorld started as a simple idea: what if we could gamify personal growth in a way that actually matters? Not just points and badges, but real skills, real connections, and real change in the world.
            </p>
            <p>
              Every week, I craft new quests, design characters, and build features that bring this vision to life. It's a learning journey for me too—I'm growing alongside everyone who joins this world.
            </p>
          </div>

          <div className="creator-section">
            <h2>Connect With Me</h2>
            <div className="social-links">
              <a href="#" className="social-link">
                <span>📧</span>
                <span>Email</span>
              </a>
              <a href="#" className="social-link">
                <span>💼</span>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="social-link">
                <span>🐙</span>
                <span>GitHub</span>
              </a>
              <a href="#" className="social-link">
                <span>🐦</span>
                <span>Twitter</span>
              </a>
            </div>
          </div>

          <div className="creator-section">
            <h2>DreamWorld Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">52+</span>
                <span className="stat-label">Quests</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">8</span>
                <span className="stat-label">Roles</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">∞</span>
                <span className="stat-label">Possibilities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Creator
