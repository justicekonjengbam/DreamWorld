import { useCallback } from 'react'
import { useAudio } from '../context/AudioContext'

export const useButtonSound = () => {
  const { isSoundMuted } = useAudio() || { isSoundMuted: false }

  const playSound = useCallback(() => {
    if (isSoundMuted) return
    const audio = new Audio('/ButtonAudio.mp3')
    audio.volume = 0.7
    audio.play().catch(err => console.log('Audio play failed:', err))
  }, [isSoundMuted])

  return playSound
}
