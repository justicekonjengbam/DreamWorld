import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Custom hook for GSAP scroll-driven animations.
 * Provides utilities for reveal animations, parallax, and text staggers.
 * All animations are cleaned up on unmount.
 */
export function useScrollAnimations(containerRef) {
  const triggersRef = useRef([])
  const tweensRef = useRef([])

  useEffect(() => {
    return () => {
      // Cleanup all ScrollTriggers and tweens
      triggersRef.current.forEach(st => st.kill())
      tweensRef.current.forEach(tw => tw.kill())
      triggersRef.current = []
      tweensRef.current = []
    }
  }, [])

  /**
   * Reveal elements when they enter the viewport.
   * Elements should start with opacity: 0 and translateY.
   */
  const revealOnScroll = (selector, options = {}) => {
    const {
      y = 60,
      duration = 1.2,
      stagger = 0.15,
      start = 'top 85%',
      ease = 'power3.out',
      delay = 0,
    } = options

    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    const tween = gsap.fromTo(
      elements,
      { opacity: 0, y, willChange: 'opacity, transform' },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: {
          trigger: elements[0].closest('.dw-section') || elements[0],
          start,
          toggleActions: 'play none none none',
        },
      }
    )
    tweensRef.current.push(tween)
    if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger)
    return tween
  }

  /**
   * Parallax effect - move element at different speed than scroll.
   */
  const parallax = (selector, options = {}) => {
    const {
      yPercent = -20,
      start = 'top bottom',
      end = 'bottom top',
      scrub = true,
    } = options

    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    elements.forEach(el => {
      const tween = gsap.to(el, {
        yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.dw-section') || el,
          start,
          end,
          scrub: scrub === true ? 1 : scrub,
        },
      })
      tweensRef.current.push(tween)
      if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger)
    })
  }

  /**
   * Fade background opacity based on scroll progress.
   */
  const fadeOnScroll = (selector, options = {}) => {
    const {
      fromOpacity = 0,
      toOpacity = 1,
      start = 'top bottom',
      end = 'top center',
      scrub = true,
    } = options

    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    elements.forEach(el => {
      const tween = gsap.fromTo(
        el,
        { opacity: fromOpacity },
        {
          opacity: toOpacity,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.dw-section') || el,
            start,
            end,
            scrub: scrub === true ? 1 : scrub,
          },
        }
      )
      tweensRef.current.push(tween)
      if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger)
    })
  }

  /**
   * Scale element on scroll (e.g., for hero zoom effect).
   */
  const scaleOnScroll = (selector, options = {}) => {
    const {
      fromScale = 1.15,
      toScale = 1,
      start = 'top top',
      end = 'bottom top',
      scrub = true,
    } = options

    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    elements.forEach(el => {
      const tween = gsap.fromTo(
        el,
        { scale: fromScale },
        {
          scale: toScale,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.dw-section') || el,
            start,
            end,
            scrub: scrub === true ? 1 : scrub,
          },
        }
      )
      tweensRef.current.push(tween)
      if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger)
    })
  }

  /**
   * Pin a section while animating content within it.
   */
  const pinSection = (triggerSelector, options = {}) => {
    const {
      start = 'top top',
      end = '+=100%',
      pin = true,
    } = options

    const container = containerRef?.current || document
    const trigger = container.querySelector(triggerSelector)
    if (!trigger) return

    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      pin,
    })
    triggersRef.current.push(st)
    return st
  }

  /**
   * Text lines stagger reveal with split-like animation.
   */
  const staggerText = (selector, options = {}) => {
    const {
      y = 40,
      duration = 0.8,
      stagger = 0.2,
      start = 'top 80%',
      ease = 'power2.out',
    } = options

    const container = containerRef?.current || document
    const elements = container.querySelectorAll(selector)
    if (!elements.length) return

    const tween = gsap.fromTo(
      elements,
      { opacity: 0, y, clipPath: 'inset(0 0 100% 0)' },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0 0 0% 0)',
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: elements[0].closest('.dw-section') || elements[0],
          start,
          toggleActions: 'play none none none',
        },
      }
    )
    tweensRef.current.push(tween)
    if (tween.scrollTrigger) triggersRef.current.push(tween.scrollTrigger)
    return tween
  }

  /**
   * Refresh all ScrollTriggers (call after layout changes).
   */
  const refresh = () => {
    ScrollTrigger.refresh()
  }

  return {
    revealOnScroll,
    parallax,
    fadeOnScroll,
    scaleOnScroll,
    pinSection,
    staggerText,
    refresh,
  }
}

export default useScrollAnimations
