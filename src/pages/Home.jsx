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
            A vision of a future civilization where nature, knowledge, technology, kindness, creativity, and human growth exist in harmony.
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
        <h2 className="animate-on-scroll mission-title">Our Vision & Core Lore</h2>
        <p className="animate-on-scroll delay-1 mission-subtitle">A fantasy-futuristic civilization where advanced technology blends beautifully with nature</p>
        <div className="mission-content animate-on-scroll delay-2">
          <p>
            DreamWorld is a vision of a future civilization where nature, knowledge, technology, kindness, creativity, and human growth exist in harmony. It is a peaceful, living world centered around a massive ancient World Tree, illuminated by bioluminescent forests and golden magical particles under a soft glowing atmosphere.
          </p>
          <p>
            In this world, we avoid the conflicts of generic fantasy RPGs—there are no swords, dragons, or combat. Instead, our society thrives on crystal-powered knowledge structures, living architecture integrated directly into the ecosystems, and floating islands that represent the heights of human imagination and technological benevolence.
          </p>
          <p>
            Every week, we embark on small "quests"—mindful acts of creation, environmental stewardship, learning, and mutual support. From nurturing a seed of bioluminescent flora to building open-source knowledge libraries, every step is designed to bring us closer to a beautiful dream.
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
                    <span className="icon-text">🌿</span>
                  </div>
                </div>
                <h3>The Lore</h3>
                <p>
                  Uncover the Vision. Read the chronicle of our future civilization where nature and advanced technology thrive in perfect symbiosis.
                </p>
                <span className="feature-cta">Read the Chronicle →</span>
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
                  Meet the Citizens. Explore profiles, check <strong>Dream Levels</strong>, and see who is anchoring the future of the civilization.
                </p>
                <span className="feature-cta">Meet the Citizens →</span>
              </Link>
            </div>

            {/* Card 3: The Journey */}
            <div className="animate-on-scroll delay-3 feature-wrapper">
              <Link to="/quests" className="feature-card journey-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon journey-icon">
                    <span className="icon-text">🌱</span>
                  </div>
                </div>
                <h3>The Journey</h3>
                <p>
                  Cultivate Growth. Embark on mindful quests to build your skills, nurture the environment, and uplift the community.
                </p>
                <span className="feature-cta">Cultivate Harmony →</span>
              </Link>
            </div>

            {/* Card 4: The Architect */}
            <div className="animate-on-scroll delay-1 feature-wrapper">
              <Link to="/creator" className="feature-card creator-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon creator-icon">
                    <span className="icon-text">🏛️</span>
                  </div>
                </div>
                <h3>The Architect</h3>
                <p>
                  Meet the Creator. Explore the blueprints of living architecture and the philosophy that shaped this beautiful dream.
                </p>
                <span className="feature-cta">Meet Justice →</span>
              </Link>
            </div>

            {/* Card 5: The Gathering */}
            <div className="animate-on-scroll delay-2 feature-wrapper">
              <Link to="/events" className="feature-card gathering-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon gathering-icon">
                    <span className="icon-text">🌟</span>
                  </div>
                </div>
                <h3>The Gathering</h3>
                <p>
                  Join the Assembly. Participate in collaborative circles, design labs, and celebrations of human growth.
                </p>
                <span className="feature-cta">View Gatherings →</span>
              </Link>
            </div>

            {/* Card 6: The Pillars */}
            <div className="animate-on-scroll delay-3 feature-wrapper">
              <Link to="/thanks" className="feature-card pillars-card">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon pillars-icon">
                    <span className="icon-text">🔮</span>
                  </div>
                </div>
                <h3>The Pillars</h3>
                <p>
                  Honor the Supporters. Discover the patrons and visionaries who are anchoring the foundations of this living world.
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
