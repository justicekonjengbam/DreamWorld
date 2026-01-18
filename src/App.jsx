import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
import './App.css'


function App() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  const [hasEntered, setHasEntered] = useState(false)
  const [shouldStartAudio, setShouldStartAudio] = useState(false)

  const handleEnterDreamWorld = () => {
    setHasEntered(true)
    setShouldStartAudio(true)
  }

  return (
    <div className="app">
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
          </Routes>
        </main>
        {!isHomePage && <Footer />}
      </div>
      
      <AudioPlayer shouldStart={shouldStartAudio} />
    </div>
  )
}


export default App
