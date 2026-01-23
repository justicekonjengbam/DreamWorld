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


      <section className="features container">
        <h2 className="animate-on-scroll features-title">Discover Your Path</h2>
        <div className="features-grid">
          <div className="animate-on-scroll delay-1">
            <Card>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #4CAF50, #4CA1AF)' }}>
                <span className="icon-text">📚</span>
              </div>
              <h3>Learn</h3>
              <p>
                Explore knowledge from technology to nature, from coding to gardening.
                Our community shares resources, tutorials, and guidance for beginners and experts alike.
              </p>
              <Link to="/about" className="feature-link">Discover the lore →</Link>
            </Card>
          </div>


          <div className="animate-on-scroll delay-2">
            <Card>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #FFD700, #FF6F61)' }}>
                <span className="icon-text">✨</span>
              </div>
              <h3>Characters</h3>
              <p>
                Meet the guides of DreamWorld—The Guardian, The Florist, The Hooper—each
                bringing unique wisdom and inspiration to our community.
              </p>
              <Link to="/characters" className="feature-link">Meet the characters →</Link>
            </Card>
          </div>


          <div className="animate-on-scroll delay-3">
            <Card>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #1D2671, #C33764)' }}>
                <span className="icon-text">🎯</span>
              </div>
              <h3>Quests & Events</h3>
              <p>
                Take on weekly quests and join live events. Small, achievable actions that build
                skills, strengthen community, and create positive change in the world.
              </p>
              <Link to="/quests" className="feature-link">See active quests →</Link>
            </Card>
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
