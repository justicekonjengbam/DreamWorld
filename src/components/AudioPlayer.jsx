import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../context/AudioContext'
import './AudioPlayer.css'

function AudioPlayer({ shouldStart, isSongsPage }) {
  const audio1Ref = useRef(null)
  const audio2Ref = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const hasStartedRef = useRef(false) // prevent double-play on re-renders
  const { isSoundMuted, setIsSoundMuted, musicVolume, isPlayingCustom } = useAudio()
  
  // Track if background music was playing before custom song started
  const wasPlayingRef = useRef(false)

  useEffect(() => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current

    // When Music1 ends, start Music2 on loop
    const handleMusic1End = () => {
      audio2.loop = true
      if (!isPlayingCustom && !isSongsPage) {
        audio2.play().then(() => {
          setIsPlaying(true)
        })
      } else {
        // If custom song or Songs page is active, don't play background music, but mark as isPlaying
        setIsPlaying(true)
        wasPlayingRef.current = true
      }
    }

    audio1.addEventListener('ended', handleMusic1End)

    // Start music when shouldStart becomes true, but only once
    if (shouldStart && !hasStartedRef.current) {
      hasStartedRef.current = true
      if (!isPlayingCustom && !isSongsPage) {
        audio1.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {}) // ignore autoplay block errors
      } else {
        wasPlayingRef.current = true
      }
    }

    return () => {
      audio1.removeEventListener('ended', handleMusic1End)
    }
  }, [shouldStart, isPlayingCustom, isSongsPage])

  // Coordinate background music with custom song playback and route
  useEffect(() => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current

    if (isPlayingCustom || isSongsPage) {
      if (isPlaying) {
        wasPlayingRef.current = true
        audio1.pause()
        audio2.pause()
        setIsPlaying(false)
      }
    } else {
      if (wasPlayingRef.current && shouldStart) {
        wasPlayingRef.current = false
        // Determine which background music was playing
        if (audio1.currentTime > 0 && audio1.currentTime < audio1.duration) {
          audio1.play().then(() => setIsPlaying(true)).catch(() => {})
        } else {
          audio2.loop = true
          audio2.play().then(() => setIsPlaying(true)).catch(() => {})
        }
      }
    }
  }, [isPlayingCustom, isPlaying, shouldStart, isSongsPage])

  // Update music mute & volume state when isSoundMuted or musicVolume changes
  useEffect(() => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current
    
    audio1.muted = isSoundMuted
    audio2.muted = isSoundMuted
    audio1.volume = musicVolume
    audio2.volume = musicVolume
  }, [isSoundMuted, musicVolume])

  const togglePlay = () => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current

    if (isPlaying) {
      audio1.pause()
      audio2.pause()
      setIsPlaying(false)
      wasPlayingRef.current = false
    } else {
      if (isPlayingCustom || isSongsPage) {
        // If custom song is playing, just mark background music as ready to play
        wasPlayingRef.current = true
      } else {
        if (audio1.currentTime > 0 && audio1.currentTime < audio1.duration) {
          audio1.play()
        } else {
          audio2.loop = true
          audio2.play()
        }
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    setIsSoundMuted(!isSoundMuted)
  }

  return (
    <>
      <audio ref={audio1Ref} src="/Music1.mp3" preload="auto"></audio>
      <audio ref={audio2Ref} src="/Music2.mp3" preload="auto"></audio>
      
      <div className="audio-controls">
        <button 
          onClick={toggleMute} 
          className="audio-btn"
          aria-label={isSoundMuted ? 'Unmute all sounds' : 'Mute all sounds'}
        >
          {isSoundMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </>
  )
}

export default AudioPlayer
