import { useEffect, useRef, useState } from 'react'
import './AudioPlayer.css'

function AudioPlayer({ shouldStart }) {
  const audio1Ref = useRef(null)
  const audio2Ref = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current

    // When Music1 ends, start Music2 on loop
    const handleMusic1End = () => {
      audio2.loop = true
      audio2.play().then(() => {
        setIsPlaying(true)
      })
    }

    audio1.addEventListener('ended', handleMusic1End)

    // Start music when shouldStart is true
    if (shouldStart) {
      audio1.play().then(() => {
        setIsPlaying(true)
      })
    }

    return () => {
      audio1.removeEventListener('ended', handleMusic1End)
    }
  }, [shouldStart])

  const togglePlay = () => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current

    if (isPlaying) {
      audio1.pause()
      audio2.pause()
      setIsPlaying(false)
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

  const toggleMute = () => {
    const audio1 = audio1Ref.current
    const audio2 = audio2Ref.current
    
    audio1.muted = !isMuted
    audio2.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio ref={audio1Ref} src="/Music1.mp3" preload="auto"></audio>
      <audio ref={audio2Ref} src="/Music2.mp3" preload="auto"></audio>
      
      <div className="audio-controls">
        <button 
          onClick={togglePlay} 
          className="audio-btn"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button 
          onClick={toggleMute} 
          className="audio-btn"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </>
  )
}

export default AudioPlayer
