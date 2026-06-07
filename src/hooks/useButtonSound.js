import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'

export const useButtonSound = () => {
  const { isSoundMuted, buttonVolume } = useAudio() || { isSoundMuted: false, buttonVolume: 0.7 }
  const location = useLocation()

  const playSound = useCallback((e) => {
    if (e) {
      e._soundPlayed = true
    }
    // Block button sound on Songs page
    if (location.pathname === '/songs') return
    
    if (isSoundMuted) return
    const audio = new Audio('/ButtonAudio.mp3')
    audio.volume = buttonVolume
    audio.play().catch(err => console.log('Audio play failed:', err))
  }, [isSoundMuted, buttonVolume, location.pathname])

  return playSound
}

