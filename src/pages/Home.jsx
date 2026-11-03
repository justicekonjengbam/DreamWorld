import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import './Home.css'

const CHAPTERS = ['Arrival', 'Vision', 'Paths', 'Latest']

const PATHS = [
  { to: '/about', sigil: '✧', name: 'The Lore', note: 'Explore the world we are building.' },
  { to: '/characters', sigil: '❋', name: 'The Dreamers', note: 'Meet the people bringing it to life.' },
  { to: '/quests', sigil: '☼', name: 'The Journey', note: 'Small acts. A brighter future.' },
  { to: '/creator', sigil: '⌂', name: 'The Architect', note: 'Discover the ideas behind the dream.' },
  { to: '/events', sigil: '◌', name: 'The Gathering', note: 'Make something good together.' },
  { to: '/thanks', sigil: '◇', name: 'The Pillars', note: 'Meet the friends who support this vision.' }
]

function Home() {
  const { announcement, loading, appSettings } = useContent()
  const [activeChapter, setActiveChapter] = useState(0)
  const lastWheelChange = useRef(0)
  const touchStart = useRef(null)

  const moveChapter = (direction) => {
    setActiveChapter((chapter) => (chapter + direction + CHAPTERS.length) % CHAPTERS.length)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') moveChapter(1)
    if (event.key === 'ArrowLeft') moveChapter(-1)
  }

  const handleWheel = (event) => {
    if (Math.abs(event.deltaY) < 32) return
    event.preventDefault()
    const now = Date.now()
    if (now - lastWheelChange.current < 950) return
    lastWheelChange.current = now
    moveChapter(event.deltaY > 0 ? 1 : -1)
  }

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event) => {
    if (!touchStart.current) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return
    moveChapter(deltaX < 0 ? 1 : -1)
  }

  if (loading) {
    return <div className="home-sync" role="status">Tuning the living world…</div>
  }

  return (
    <main
      className="home"
      aria-label="DreamWorld home"
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="home-background" aria-hidden="true" />
      <div className="home-atmosphere" aria-hidden="true" />

      <div className="home-stage" aria-live="polite">
        <section className={`home-slide home-slide-arrival ${activeChapter === 0 ? 'is-active' : ''}`} aria-hidden={activeChapter !== 0} aria-label="Welcome to DreamWorld">
          <div className="home-copy home-arrival-copy">
            <p className="home-eyebrow home-arrival-eyebrow"><span /> A BEAUTIFUL DREAM <span /></p>
            <img src="/logo.png" alt="DreamWorld" className="home-logo" />
            <p className="home-description">Each quest turns wonder into something real: a skill learned, a kindness shared, a little more life returned to the world.</p>
            <div className="home-actions">
              <Link to="/about" className="home-action home-action-primary" tabIndex={activeChapter === 0 ? 0 : -1}>Step into the world <span aria-hidden="true">↗</span></Link>
              <Link to="/join" className="home-action home-action-secondary" tabIndex={activeChapter === 0 ? 0 : -1}>
                {appSettings?.dreamworld_open === false ? 'Join the waitlist' : 'Join the community'}
              </Link>
            </div>
          </div>
        </section>

        <section className={`home-slide ${activeChapter === 1 ? 'is-active' : ''}`} aria-hidden={activeChapter !== 1} aria-label="DreamWorld vision">
          <div className="home-copy home-vision-copy">
            <p className="home-eyebrow"><span /> THE WORLD WE ARE GROWING <span /></p>
            <h2 className="home-title">A future in harmony.</h2>
            <p className="home-description">Powered by the sun. Nurtured by nature. Made brighter through shared knowledge, creativity, and kindness.</p>
            <div className="home-pillars">
              <article className="home-pillar"><span className="pillar-sigil">☼</span><h3>Energy in balance</h3><p>Clean power woven into everyday life.</p></article>
              <article className="home-pillar"><span className="pillar-sigil">❋</span><h3>Knowledge in bloom</h3><p>Ideas and learning made open to all.</p></article>
              <article className="home-pillar"><span className="pillar-sigil">⌁</span><h3>Growth together</h3><p>Small acts that help a whole world thrive.</p></article>
            </div>
          </div>
        </section>

        <section className={`home-slide home-slide-paths ${activeChapter === 2 ? 'is-active' : ''}`} aria-hidden={activeChapter !== 2} aria-label="Explore DreamWorld">
          <div className="home-copy home-paths-copy">
            <p className="home-eyebrow"><span /> FIND YOUR WAY <span /></p>
            <h2 className="home-title">A world of paths to follow.</h2>
            <div className="home-path-grid">
              {PATHS.map((path, index) => (
                <Link key={path.to} to={path.to} className="home-path" tabIndex={activeChapter === 2 ? 0 : -1}>
                  <span className="path-number">0{index + 1}</span>
                  <span className="path-sigil" aria-hidden="true">{path.sigil}</span>
                  <span className="path-copy"><strong>{path.name}</strong><small>{path.note}</small></span>
                  <span className="path-arrow" aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`home-slide ${activeChapter === 3 ? 'is-active' : ''}`} aria-hidden={activeChapter !== 3} aria-label="Latest from DreamWorld">
          <div className="home-copy home-update-copy">
            <p className="home-eyebrow"><span /> FROM THE LIVING WORLD <span /></p>
            <p className="home-update-date">{announcement?.date || 'A note from DreamWorld'}</p>
            <h2 className="home-title">{announcement?.title || 'The dream keeps growing.'}</h2>
            <p className="home-description home-update-description">{announcement?.content || 'New ideas, gatherings, and small acts of care are taking root.'}</p>
            <Link to={announcement?.linkTo || '/quests'} className="home-action home-action-primary" tabIndex={activeChapter === 3 ? 0 : -1}>
              {announcement?.linkText || 'Explore what is new'} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>
      <nav className="home-deck-controls" aria-label="Home chapters">
        <button className="deck-arrow" type="button" aria-label="Previous section" onClick={() => moveChapter(-1)}>←</button>
        <span className="deck-current" aria-live="polite">0{activeChapter + 1} <i /> {CHAPTERS[activeChapter]}</span>
        <button className="deck-arrow" type="button" aria-label="Next section" onClick={() => moveChapter(1)}>→</button>
      </nav>
      <p className="home-gesture-hint" aria-hidden="true">
        <span className="gesture-desktop"><b>↕</b> Scroll to explore</span>
        <span className="gesture-mobile"><b>↔</b> Swipe to explore</span>
      </p>
    </main>
  )
}

export default Home
