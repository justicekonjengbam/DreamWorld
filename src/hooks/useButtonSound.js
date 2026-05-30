import { useCallback } from 'react'
import { useAudio } from '../context/AudioContext'

export const useButtonSound = () => {
  const { isSoundMuted, buttonVolume } = useAudio() || { isSoundMuted: false, buttonVolume: 0.7 }

  const playSound = useCallback((e) => {
    if (e) {
      e._soundPlayed = true
    }
    if (isSoundMuted) return
    const audio = new Audio('/ButtonAudio.mp3')
    audio.volume = buttonVolume
    audio.play().catch(err => console.log('Audio play failed:', err))
  }, [isSoundMuted, buttonVolume])

  return playSound
}

