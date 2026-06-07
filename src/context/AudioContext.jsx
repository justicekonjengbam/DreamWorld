import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { initialSongs } from '../data/songs'

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

  // Custom song player states
  const [songsList, setSongsList] = useState(initialSongs)
  const [activeSong, setActiveSong] = useState(null)
  const [isPlayingCustom, setIsPlayingCustom] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  const customAudioRef = useRef(null)
  
  // Keep refs for event listener closures to avoid stale state
  const activeSongRef = useRef(activeSong)
  const songsListRef = useRef(songsList)
  const isShuffleRef = useRef(isShuffle)
  const isRepeatRef = useRef(isRepeat)

  useEffect(() => {
    activeSongRef.current = activeSong
  }, [activeSong])

  useEffect(() => {
    songsListRef.current = songsList
  }, [songsList])

  useEffect(() => {
    isShuffleRef.current = isShuffle
  }, [isShuffle])

  useEffect(() => {
    isRepeatRef.current = isRepeat
  }, [isRepeat])

  // Initialize shared audio object
  useEffect(() => {
    customAudioRef.current = new Audio()
    customAudioRef.current.volume = musicVolume
    customAudioRef.current.muted = isSoundMuted

    const audio = customAudioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handleEnded = () => {
      setCurrentTime(0)
      const currentActive = activeSongRef.current
      const currentList = songsListRef.current
      const repeatVal = isRepeatRef.current
      const shuffleVal = isShuffleRef.current

      if (repeatVal) {
        audio.currentTime = 0
        audio.play().then(() => setIsPlayingCustom(true)).catch(() => {})
      } else if (shuffleVal && currentList.length > 0) {
        const randomIndex = Math.floor(Math.random() * currentList.length)
        playCustomSong(currentList[randomIndex])
      } else if (currentActive && currentList.length > 0) {
        const currentIndex = currentList.findIndex(s => s.id === currentActive.id)
        if (currentIndex !== -1 && currentIndex < currentList.length - 1) {
          playCustomSong(currentList[currentIndex + 1])
        } else {
          setIsPlayingCustom(false)
        }
      } else {
        setIsPlayingCustom(false)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Sync mute & volume changes
  useEffect(() => {
    if (customAudioRef.current) {
      customAudioRef.current.muted = isSoundMuted
      customAudioRef.current.volume = musicVolume
    }
  }, [isSoundMuted, musicVolume])

  useEffect(() => {
    localStorage.setItem('dw_sound_muted', isSoundMuted)
  }, [isSoundMuted])

  useEffect(() => {
    localStorage.setItem('dw_music_volume', musicVolume)
  }, [musicVolume])

  useEffect(() => {
    localStorage.setItem('dw_button_volume', buttonVolume)
  }, [buttonVolume])

  // Custom playback functions
  const playCustomSong = (song) => {
    if (!customAudioRef.current) return

    const isSameSong = activeSong && activeSong.id === song.id;

    if (!isSameSong) {
      customAudioRef.current.src = song.src
      customAudioRef.current.load()
      setActiveSong(song)
    }

    customAudioRef.current.play()
      .then(() => {
        setIsPlayingCustom(true)
      })
      .catch(err => {
        console.warn("Audio play blocked or failed:", err)
      })
  }

  const pauseCustomSong = () => {
    if (!customAudioRef.current) return
    customAudioRef.current.pause()
    setIsPlayingCustom(false)
  }

  const nextCustomSong = () => {
    if (songsList.length === 0) return
    
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songsList.length)
      playCustomSong(songsList[randomIndex])
      return
    }

    const currentIndex = activeSong ? songsList.findIndex(s => s.id === activeSong.id) : -1
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % songsList.length
    playCustomSong(songsList[nextIndex])
  }

  const prevCustomSong = () => {
    if (songsList.length === 0) return

    const currentIndex = activeSong ? songsList.findIndex(s => s.id === activeSong.id) : -1
    let prevIndex = currentIndex - 1
    if (prevIndex < 0) prevIndex = songsList.length - 1
    playCustomSong(songsList[prevIndex])
  }

  const seekCustomSong = (time) => {
    if (!customAudioRef.current) return
    customAudioRef.current.currentTime = time
    setCurrentTime(time)
  }

  return (
    <AudioContext.Provider value={{ 
      isSoundMuted, setIsSoundMuted,
      musicVolume, setMusicVolume,
      buttonVolume, setButtonVolume,
      
      // Custom songs attributes
      songsList, setSongsList,
      activeSong, setActiveSong,
      isPlayingCustom, setIsPlayingCustom,
      currentTime, duration,
      isShuffle, setIsShuffle,
      isRepeat, setIsRepeat,
      customAudioElement: customAudioRef.current,
      
      // Control methods
      playCustomSong, pauseCustomSong,
      nextCustomSong, prevCustomSong,
      seekCustomSong
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}

