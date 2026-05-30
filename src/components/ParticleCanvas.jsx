import { useEffect, useRef, useCallback } from 'react'
import './ParticleCanvas.css'

/**
 * Lightweight canvas-based golden particle system.
 * Renders floating, drifting particles with warm golden colors.
 * Performance-optimized: uses requestAnimationFrame, caps particle count.
 */
function ParticleCanvas({ 
  maxParticles = 80, 
  color = { r: 212, g: 168, b: 83 },
  speed = 0.3,
  opacity = 0.6,
  sizeRange = [1, 3],
  className = ''
}) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animFrameRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })

  const createParticle = useCallback((canvas, forceY) => {
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
    return {
      x: Math.random() * canvas.width,
      y: forceY !== undefined ? forceY : Math.random() * canvas.height,
      size,
      baseSize: size,
      speedX: (Math.random() - 0.5) * speed,
      speedY: -(Math.random() * speed + speed * 0.3),
      opacity: Math.random() * opacity * 0.6 + opacity * 0.2,
      baseOpacity: Math.random() * opacity * 0.6 + opacity * 0.2,
      life: 0,
      maxLife: 300 + Math.random() * 500,
      flickerSpeed: 0.005 + Math.random() * 0.015,
      flickerPhase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.02,
    }
  }, [speed, opacity, sizeRange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Initialize particles
    particlesRef.current = []
    for (let i = 0; i < maxParticles; i++) {
      particlesRef.current.push(createParticle(canvas))
    }

    // Mouse interaction
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p, i) => {
        p.life++
        
        // Lifecycle fade
        let lifeFactor = 1
        const fadeInDuration = 60
        const fadeOutStart = p.maxLife - 80
        if (p.life < fadeInDuration) {
          lifeFactor = p.life / fadeInDuration
        } else if (p.life > fadeOutStart) {
          lifeFactor = (p.maxLife - p.life) / 80
        }

        // Flicker
        const flicker = Math.sin(p.life * p.flickerSpeed + p.flickerPhase) * 0.3 + 0.7

        // Mouse repulsion (subtle)
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        // Movement
        p.speedX += p.drift
        p.x += p.speedX
        p.y += p.speedY
        p.speedX *= 0.999

        // Current opacity & size
        const currentOpacity = p.baseOpacity * lifeFactor * flicker
        const currentSize = p.baseSize * (0.8 + lifeFactor * 0.4)

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 4)
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.4})`)
        gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity * 0.15})`)
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw core
        ctx.fillStyle = `rgba(${color.r + 30}, ${color.g + 40}, ${color.b + 30}, ${currentOpacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()

        // Respawn if dead or offscreen
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particlesRef.current[i] = createParticle(canvas, canvas.height + 10)
        }
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [maxParticles, color, createParticle])

  return (
    <canvas
      ref={canvasRef}
      className={`dw-particle-canvas ${className}`}
      aria-hidden="true"
    />
  )
}

export default ParticleCanvas
