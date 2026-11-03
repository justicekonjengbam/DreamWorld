import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAudio } from './context/AudioContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AudioPlayer from './components/AudioPlayer'
import WelcomeOverlay from './components/WelcomeOverlay'
import ParticlesBackground from './components/Particles'
import Home from './pages/Home'
import About from './pages/About'
import Characters from './pages/Characters'
import CharacterDetail from './pages/CharacterDetail'
import Creator from './pages/Creator'
import Quests from './pages/Quests'
import Events from './pages/Events'
import Join from './pages/Join'
import Funders from './pages/Funders'
import ScrollToTop from './components/ScrollToTop'
import { ContentProvider } from './context/ContentContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SpecialThanks from './pages/SpecialThanks'
import PortalLayout from './portal/PortalLayout'
import PortalLogin from './portal/PortalLogin'
import PortalDashboard from './portal/PortalDashboard'
import Settings from './pages/Settings'
import Songs from './pages/Songs'
import './App.css'

const PAGE_BACKDROPS = {
  about: ['/realm-art/about-wide.jpg', '/realm-art/about-tall.jpg'],
  characters: ['/realm-art/characters-wide.jpg', '/realm-art/characters-tall.jpg'],
  creator: ['/realm-art/creator-wide.jpg', '/realm-art/creator-tall.jpg'],
  quests: ['/realm-art/quests-wide.jpg', '/realm-art/quests-tall.jpg'],
  events: ['/realm-art/events-wide.jpg', '/realm-art/events-tall.jpg'],
  join: ['/realm-art/join-wide.jpg', '/realm-art/join-tall.jpg'],
  funders: ['/realm-art/funders-wide.jpg', '/realm-art/funders-tall.jpg'],
  thanks: ['/realm-art/thanks-wide.jpg', '/realm-art/thanks-tall.jpg'],
  settings: ['/realm-art/settings-wide.jpg', '/realm-art/settings-tall.jpg'],
  songs: ['/realm-art/songs-wide.jpg', '/realm-art/songs-tall.jpg'],
  admin: ['/realm-art/admin-wide.jpg', '/realm-art/admin-tall.jpg']
}

function getPageBackdrop(pathname) {
  const segment = pathname.split('/')[1]
  const route = pathname.startsWith('/characters/') ? 'characters' : segment === 'admin' ? 'admin' : segment
  const [desktop, mobile] = PAGE_BACKDROPS[route] || []
  return desktop ? { '--realm-art': `url('${desktop}')`, '--realm-art-mobile': `url('${mobile}')` } : undefined
}

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isPortal = location.pathname.startsWith('/portal')
  const isSongsPage = location.pathname === '/songs'

  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem('dreamworld_entered') === 'true'
  })
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(() => {
    return sessionStorage.getItem('dreamworld_entered') !== 'true'
  })
  const [shouldStartAudio, setShouldStartAudio] = useState(false)
  const { isSoundMuted, buttonVolume } = useAudio()

  const handleEnterDreamWorld = () => {
    sessionStorage.setItem('dreamworld_entered', 'true')
    const isMobile = window.matchMedia('(max-width: 900px)').matches
    const isPortraitPhone = window.matchMedia('(max-width: 900px) and (orientation: portrait)').matches
    const orientation = window.screen?.orientation
    if (isMobile) {
      const enterFullscreen = document.documentElement.requestFullscreen
      if (typeof enterFullscreen === 'function' && !document.fullscreenElement) {
        Promise.resolve(enterFullscreen.call(document.documentElement)).then(() => {
          if (isPortraitPhone && typeof orientation?.lock === 'function') {
            orientation.lock('landscape').catch(() => {})
          }
        }).catch(() => {
          if (isPortraitPhone && typeof orientation?.lock === 'function') orientation.lock('landscape').catch(() => {})
        })
      }
    }
    setHasEntered(true)
    setShouldStartAudio(true)
  }

  // Global click sound for all clickable elements
  useEffect(() => {
    const handleClick = (e) => {
      if (isSongsPage) return
      const isClickable = e.target.closest('button, a, input[type="button"], input[type="submit"], select, .clickable, .card, .nav-link, .interactive')
      if (isClickable) {
        if (!isSoundMuted && buttonVolume > 0) {
          const audio = new Audio('/ButtonAudio.mp3')
          audio.volume = buttonVolume
          audio.play().catch(() => {})
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isSoundMuted, buttonVolume, isSongsPage])

  return (
    <ContentProvider>
      <div className={`app${isHomePage ? ' app-home' : ''}`}>
        {!isHomePage && !isPortal && <div className="realm-backdrop" style={getPageBackdrop(location.pathname)} aria-hidden="true" />}
        <ScrollToTop />
        {!isPortal && showWelcomeOverlay && (
          <WelcomeOverlay
            onEnter={handleEnterDreamWorld}
            onExitComplete={() => setShowWelcomeOverlay(false)}
          />
        )}

        <ParticlesBackground />

        <div className={`main-app-content ${!isPortal && hasEntered ? 'fade-in' : ''} ${isPortal ? 'portal-visible' : ''}`}>
          {!isPortal && <Navbar />}
          <main className="main-content">
            <div className="realm-screen" key={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
              <Route path="/roles" element={<Navigate to="/characters" replace />} />
              <Route path="/roles/:id" element={<Navigate to="/characters" replace />} />
              <Route path="/creator" element={<Creator />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/events" element={<Events />} />
              <Route path="/join" element={<Join />} />
              <Route path="/funders" element={<Funders />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Sandbox PWA Portal Routes */}
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<PortalLogin />} />
                <Route path="dashboard" element={<PortalDashboard />} />
              </Route>

              <Route path="/thanks" element={<SpecialThanks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/songs" element={<Songs />} />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
          </main>
          {!isPortal && !isHomePage && <Footer />}
        </div>

        <AudioPlayer shouldStart={shouldStartAudio} isSongsPage={isSongsPage} />
      </div>
    </ContentProvider>
  )
}

export default App
