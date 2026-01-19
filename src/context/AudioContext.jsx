import { createContext, useContext, useState } from 'react'

const AudioContext = createContext()

export function AudioProvider({ children }) {
  const [isSoundMuted, setIsSoundMuted] = useState(false)

  return (
    <AudioContext.Provider value={{ isSoundMuted, setIsSoundMuted }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}
