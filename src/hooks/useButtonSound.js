import { useCallback } from 'react'

export const useButtonSound = () => {
  const playSound = useCallback(() => {
    const audio = new Audio('/ButtonAudio.mp3')
    audio.volume = 0.7
    audio.play().catch(err => console.log('Audio play failed:', err))
  }, [])

  return playSound
}
