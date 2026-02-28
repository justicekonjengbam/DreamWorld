import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import Roles from './pages/Roles'
import RoleDetail from './pages/RoleDetail'
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
import Academy from './pages/Academy'
import AcademyStudents from './pages/AcademyStudents'
import AcademyStudentDetail from './pages/AcademyStudentDetail'
import AcademyEnroll from './pages/AcademyEnroll'
import './App.css'




import { useTheme } from './context/ThemeContext'

function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const [hasEntered, setHasEntered] = useState(false)
  const [shouldStartAudio, setShouldStartAudio] = useState(false)
  const { isSoundMuted } = useAudio()


  const handleEnterDreamWorld = () => {
    setHasEntered(true)
    setShouldStartAudio(true)
  }


  // Global click sound for all clickable elements
  useEffect(() => {
    const handleClick = (e) => {
      // ... existing click handler ...
      if (isSoundMuted) return // Don't play if muted

      const clickable = e.target.closest('a, button, [role="button"], .card, .character-link, .role-card')
      if (clickable) {
        const audio = new Audio('/ButtonAudio.mp3')
        audio.volume = 0.7
        audio.play().catch(err => console.log('Audio play failed:', err))
      }
    }


    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isSoundMuted])


  return (
    <ContentProvider>
      <div className="app">
        <ScrollToTop />
        {!hasEntered && <WelcomeOverlay onEnter={handleEnterDreamWorld} />}

        <ParticlesBackground />

        <div className={`main-app-content ${hasEntered ? 'fade-in' : ''}`}>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/:id" element={<CharacterDetail />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/roles/:id" element={<RoleDetail />} />
              <Route path="/creator" element={<Creator />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/events" element={<Events />} />
              <Route path="/join" element={<Join />} />
              <Route path="/funders" element={<Funders />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/thanks" element={<SpecialThanks />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/academy/enroll" element={<AcademyEnroll />} />
              <Route path="/academy/students" element={<AcademyStudents />} />
              <Route path="/academy/students/:id" element={<AcademyStudentDetail />} />


            </Routes>
          </main>
          {!isHomePage && <Footer />}
        </div>

        <AudioPlayer shouldStart={shouldStartAudio} />
      </div>
    </ContentProvider>
  )
}


export default App
