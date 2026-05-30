import { createContext, useContext, useState, useEffect } from 'react'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [isSoundMuted, setIsSoundMuted] = useState(() => {
    return localStorage.getItem('dw_sound_muted') === 'true'
  })
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('dw_music_volume')
    return saved !== null ? parseFloat(saved) : 0.5
  })
  const [buttonVolume, setButtonVolume] = useState(() => {
    const saved = localStorage.getItem('dw_button_volume')
    return saved !== null ? parseFloat(saved) : 0.7
  })

  useEffect(() => {
    localStorage.setItem('dw_sound_muted', isSoundMuted)
  }, [isSoundMuted])

  useEffect(() => {
    localStorage.setItem('dw_music_volume', musicVolume)
  }, [musicVolume])

  useEffect(() => {
    localStorage.setItem('dw_button_volume', buttonVolume)
  }, [buttonVolume])

  return (
    <AudioContext.Provider value={{ 
      isSoundMuted, setIsSoundMuted,
      musicVolume, setMusicVolume,
      buttonVolume, setButtonVolume
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}
