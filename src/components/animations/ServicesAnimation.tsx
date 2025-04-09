'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useIsClient } from '@/hooks/useIsClient'

const ServicesAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const isClient = useIsClient()

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas to be full size of container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Get 2D context
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('2D Canvas not supported')
      setLoaded(true)
      return
    }

    // Particle class for floating effects
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 0.2 - 0.1
        this.speedY = Math.random() * 0.2 - 0.1

        // Soft colors that work in both light and dark mode
        const hue = Math.random() * 60 + 200 // Blue to purple range
        this.color = `hsla(${hue}, 70%, 60%`
        this.alpha = Math.random() * 0.3 + 0.1 // Very subtle
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `${this.color}, ${this.alpha})`
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(
      40,
      Math.max(20, (canvas.width * canvas.height) / 20000)
    )

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation variables
    let animationFrameId: number
    let hue = 0

    // Animation function
    const animate = () => {
      // Create a very subtle gradient background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Very slow-changing gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      )

      // Soft gradient that works with both dark and light themes
      hue = (hue + 0.1) % 360
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.05)`)
      gradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 70%, 60%, 0.03)`)
      gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 70%, 60%, 0.05)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()
    setLoaded(true)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isClient])

  // Render a loading state or canvas based on client-side rendering status
  if (!isClient) {
    return (
      <div className='w-full h-full relative'>
        <div className='w-full h-full overflow-hidden bg-gradient-to-br from-blue-900/5 to-purple-900/5'>
          {/* Empty placeholder during SSR */}
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-full relative'>
      <div className='w-full h-full overflow-hidden'>
        <canvas ref={canvasRef} className='w-full h-full' />
      </div>

      {/* Fallback while loading */}
      {!loaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-gray-500 dark:text-gray-400'>
            Loading animation...
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesAnimation
