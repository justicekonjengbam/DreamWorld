import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import Button from '../components/Button'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import HomeFooter from '../components/HomeFooter'
import './Home.css'


function Home() {
  const { announcement, loading } = useContent()

  if (loading) return <div className="loading-state">Syncing with DreamWorld...</div>

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }


    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)


    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach(el => observer.observe(el))


    return () => observer.disconnect()
  }, [])


  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="container hero-content">
          <p className="hero-subtitle animate-on-scroll">A Beautiful Dream presents</p>
          <img src="/logo.png" alt="DreamWorld Logo" className="hero-logo animate-on-scroll delay-1" />
          {/* <h1 className="hero-title animate-on-scroll delay-2">DreamWorld</h1> */}
          <p className="hero-description animate-on-scroll delay-3">
            A universe where nature, technology, and mystical wonder live in harmony.
            Learn together. Build together. Make the world better, one quest at a time.
          </p>
          <div className="hero-buttons animate-on-scroll delay-4">
            <Link to="/about"><Button variant="primary">Explore DreamWorld</Button></Link>
            <Link to="/join"><Button variant="secondary">Join the Community</Button></Link>
          </div>
          <div className="hero-academy-btn animate-on-scroll delay-5">
            <Link to="/academy">
              <button className="academy-explore-btn">
                <img src="/DreamWorldAcademy.png" alt="" className="acad-btn-icon" />
                Explore DreamWorld Academy
              </button>
            </Link>
          </div>
        </div>
      </section>


      <section className="mission container">
        <h2 className="animate-on-scroll mission-title">Our Mission</h2>
        <p className="animate-on-scroll delay-1 mission-subtitle">Education, community, and action—building a brighter future together</p>
        <div className="mission-content animate-on-scroll delay-2">
          <p>
            DreamWorld is more than a fantasy universe—it's a living community dedicated to
            continuous learning and positive impact. We believe that when people learn together,
            create together, and support each other, extraordinary things happen.
          </p>
          <p>
            Every week, we embark on small "quests"—simple actions that improve our skills,
            our spaces, and our communities. From planting a seed to learning a new skill
            to helping someone in need, every quest brings us closer to the world we want to live in.
          </p>
        </div>
      </section>


      <section className="features">
        <div className="features-ambient-bg">
          <div className="ambient-blob blob-1"></div>
          <div className="ambient-blob blob-2"></div>
          <div className="ambient-blob blob-3"></div>
        </div>

        <div className="container">
          <h2 className="animate-on-scroll features-title">Discover Your Path</h2>
          <div className="features-grid">
            {/* Card 1: The Lore */}
            <div className="animate-on-scroll delay-1 feature-wrapper">
              <Link to="/about" className="feature-card lore-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon lore-icon">
                    <span className="icon-text">📜</span>
                  </div>
                </div>
                <h3>The Lore</h3>
                <p>
                  Uncover the Vision. Read the story of DreamWorld, our philosophy, and the future we are building together.
                </p>
                <span className="feature-cta">Read the Story →</span>
              </Link>
            </div>

            {/* Card 2: The Dreamers */}
            <div className="animate-on-scroll delay-2 feature-wrapper">
              <Link to="/characters" className="feature-card dreamers-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon dreamers-icon">
                    <span className="icon-text">✨</span>
                  </div>
                </div>
                <h3>The Dreamers</h3>
                <p>
                  Meet the Community. Explore profiles, check <strong>Dream Levels</strong>, and see who is leading the change.
                </p>
                <span className="feature-cta">Meet the Members →</span>
              </Link>
            </div>

            {/* Card 3: The Journey */}
            <div className="animate-on-scroll delay-3 feature-wrapper">
              <Link to="/quests" className="feature-card journey-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon journey-icon">
                    <span className="icon-text">⚔️</span>
                  </div>
                </div>
                <h3>The Journey</h3>
                <p>
                  Start Your Adventure. Complete Quests to earn <strong>XP</strong>, level up, and make a real-world impact.
                </p>
                <span className="feature-cta">Start a Quest →</span>
              </Link>
            </div>

            {/* Card 4: The Architect */}
            <div className="animate-on-scroll delay-1 feature-wrapper">
              <Link to="/creator" className="feature-card creator-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon creator-icon">
                    <span className="icon-text">👁️</span>
                  </div>
                </div>
                <h3>The Architect</h3>
                <p>
                  Meet the Creator. Explore the mind behind the dream and the origin of this universe.
                </p>
                <span className="feature-cta">Meet Justice →</span>
              </Link>
            </div>

            {/* Card 5: The Gathering */}
            <div className="animate-on-scroll delay-2 feature-wrapper">
              <Link to="/events" className="feature-card gathering-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon gathering-icon">
                    <span className="icon-text">🔥</span>
                  </div>
                </div>
                <h3>The Gathering</h3>
                <p>
                  Join the Assembly. Participate in live events, workshops, and community celebrations.
                </p>
                <span className="feature-cta">View Events →</span>
              </Link>
            </div>

            {/* Card 6: The Pillars */}
            <div className="animate-on-scroll delay-3 feature-wrapper">
              <Link to="/thanks" className="feature-card pillars-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon pillars-icon">
                    <span className="icon-text">💎</span>
                  </div>
                </div>
                <h3>The Pillars</h3>
                <p>
                  Honor the Supporters. See the visionaries and patrons fueling the dream.
                </p>
                <span className="feature-cta">View Wall of Gratitude →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="latest-update container">
        <h2 className="animate-on-scroll update-title">Latest Update</h2>
        <div className="animate-on-scroll delay-1">
          <Card className="update-card" hover={false}>
            <div className="update-header">
              <h3>{announcement.title}</h3>
              <span className="update-date">{announcement.date}</span>
            </div>
            <p>{announcement.content}</p>
            <div className="update-actions">
              <Link to={announcement.linkTo}><Button variant="primary">{announcement.linkText}</Button></Link>
            </div>
          </Card>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}


export default Home
