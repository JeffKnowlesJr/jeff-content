'use client'

import React, { useRef, useEffect, useState } from 'react'

const ServicesAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  // Use a ref instead of state for mouse position to prevent rerenders
  const mousePositionRef = useRef({ x: 0, y: 0 })
  // Add mouse velocity tracking for fluid motion effects
  const mouseVelocityRef = useRef({ x: 0, y: 0 })
  const prevMousePosRef = useRef({ x: 0, y: 0 })
  const mouseActiveRef = useRef(false)
  const mouseActiveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add spin physics state
  const sphereSpinRef = useRef({ x: 0, y: 0 }) // Current spin velocity
  const sphereRotationRef = useRef({ x: 0, y: 0 }) // Current rotation angle
  const sphereOffsetRef = useRef({ x: 0, y: 0 }) // Offset from center

  useEffect(() => {
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

    // Get 2D context for particle system
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('2D Canvas not supported')
      setLoaded(true)
      return
    }

    // Enhanced mouse interaction handlers with velocity tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top

      // Calculate velocity (movement speed and direction)
      mouseVelocityRef.current = {
        x: currentX - prevMousePosRef.current.x,
        y: currentY - prevMousePosRef.current.y
      }

      // Update positions
      mousePositionRef.current = { x: currentX, y: currentY }
      prevMousePosRef.current = { x: currentX, y: currentY }

      // Set mouse as active for ripple effect
      mouseActiveRef.current = true

      // Apply spin to the sphere based on mouse movement
      if (mouseActiveRef.current) {
        // Convert mouse velocity to spin
        sphereSpinRef.current.x += mouseVelocityRef.current.y * 0.0001
        sphereSpinRef.current.y -= mouseVelocityRef.current.x * 0.0001

        // Limit maximum spin speed
        const maxSpin = 0.01
        sphereSpinRef.current.x = Math.max(
          Math.min(sphereSpinRef.current.x, maxSpin),
          -maxSpin
        )
        sphereSpinRef.current.y = Math.max(
          Math.min(sphereSpinRef.current.y, maxSpin),
          -maxSpin
        )

        // Apply drag offset based on mouse position relative to center
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const dragFactor = 0.02
        sphereOffsetRef.current.x =
          (mousePositionRef.current.x - centerX) * dragFactor
        sphereOffsetRef.current.y =
          (mousePositionRef.current.y - centerY) * dragFactor
      }

      // Reset active state after some time of inactivity
      if (mouseActiveTimeoutRef.current) {
        clearTimeout(mouseActiveTimeoutRef.current)
      }
      mouseActiveTimeoutRef.current = setTimeout(() => {
        mouseActiveRef.current = false
      }, 100)
    }

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      prevMousePosRef.current = { ...mousePositionRef.current }
      mouseActiveRef.current = true
    }

    const handleMouseUp = () => {
      // Keep velocity but mark as inactive after a short delay
      setTimeout(() => {
        mouseActiveRef.current = false
      }, 50)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        const currentX = e.touches[0].clientX - rect.left
        const currentY = e.touches[0].clientY - rect.top

        // Calculate velocity
        mouseVelocityRef.current = {
          x: currentX - prevMousePosRef.current.x,
          y: currentY - prevMousePosRef.current.y
        }

        // Update positions
        mousePositionRef.current = { x: currentX, y: currentY }
        prevMousePosRef.current = { x: currentX, y: currentY }

        // Set as active
        mouseActiveRef.current = true

        // Apply spin based on touch movement
        if (mouseActiveRef.current) {
          // Convert touch velocity to spin
          sphereSpinRef.current.x += mouseVelocityRef.current.y * 0.0001
          sphereSpinRef.current.y -= mouseVelocityRef.current.x * 0.0001

          // Limit maximum spin speed
          const maxSpin = 0.01
          sphereSpinRef.current.x = Math.max(
            Math.min(sphereSpinRef.current.x, maxSpin),
            -maxSpin
          )
          sphereSpinRef.current.y = Math.max(
            Math.min(sphereSpinRef.current.y, maxSpin),
            -maxSpin
          )

          // Apply drag offset
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const dragFactor = 0.02
          sphereOffsetRef.current.x =
            (mousePositionRef.current.x - centerX) * dragFactor
          sphereOffsetRef.current.y =
            (mousePositionRef.current.y - centerY) * dragFactor
        }

        // Prevent scrolling when interacting with the canvas
        e.preventDefault()

        // Reset active state after a delay
        if (mouseActiveTimeoutRef.current) {
          clearTimeout(mouseActiveTimeoutRef.current)
        }
        mouseActiveTimeoutRef.current = setTimeout(() => {
          mouseActiveRef.current = false
        }, 100)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        mousePositionRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        }
        prevMousePosRef.current = { ...mousePositionRef.current }
        mouseActiveRef.current = true
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        mouseActiveRef.current = false
      }, 50)
    }

    // Add all event listeners
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    // Particle system
    class Particle {
      x: number
      y: number
      z: number
      size: number
      speedX: number
      speedY: number
      speedZ: number
      color: string
      originalX: number
      originalY: number
      originalZ: number
      pulseSpeed: number
      pulseFactor: number
      pulseOffset: number
      opacity: number
      velocityInfluenceX: number
      velocityInfluenceY: number
      velocityInfluenceZ: number

      constructor(x: number, y: number, z: number, size: number) {
        this.x = x
        this.y = y
        this.z = z
        this.originalX = x
        this.originalY = y
        this.originalZ = z
        this.size = Math.random() * size + 1.5 // Slightly larger base size
        // Slower speeds
        this.speedX = (Math.random() * 0.4 - 0.2) * 0.3
        this.speedY = (Math.random() * 0.4 - 0.2) * 0.3
        this.speedZ = (Math.random() * 0.4 - 0.2) * 0.3

        // More vibrant color range - wider spectrum
        const colorScheme = Math.random() > 0.5 ? 1 : 2 // Two color schemes
        let hue, saturation, lightness

        if (colorScheme === 1) {
          // Blues to purples with some cyan
          hue = Math.random() * 90 + 180
          saturation = 80 + Math.random() * 20
          lightness = 55 + Math.random() * 20
        } else {
          // Pinks to blues
          hue = Math.random() * 60 + 270
          saturation = 70 + Math.random() * 30
          lightness = 60 + Math.random() * 20
        }

        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%`
        this.opacity = 0.7 + Math.random() * 0.3

        // Pulsing properties
        this.pulseSpeed = 0.01 + Math.random() * 0.01 // slower pulsing
        this.pulseFactor = 0.2 + Math.random() * 0.4 // less extreme pulsing
        this.pulseOffset = Math.random() * Math.PI * 2

        // Properties for fluid motion effect
        this.velocityInfluenceX = 0
        this.velocityInfluenceY = 0
        this.velocityInfluenceZ = 0
      }

      update(
        mouseX: number,
        mouseY: number,
        time: number,
        sphereRotationX: number,
        sphereRotationY: number,
        offsetX: number,
        offsetY: number
      ) {
        // Add velocity influence decay
        this.velocityInfluenceX *= 0.95
        this.velocityInfluenceY *= 0.95
        this.velocityInfluenceZ *= 0.95

        // Add velocity influence to position
        this.x += this.velocityInfluenceX
        this.y += this.velocityInfluenceY
        this.z += this.velocityInfluenceZ

        // Basic movement - slower
        this.x += this.speedX * 0.5
        this.y += this.speedY * 0.5
        this.z += this.speedZ * 0.5

        // Boundary check - ensure canvas exists
        if (!canvas) return { pulse: 1, scale: 1, opacity: this.opacity }

        const centerX = canvas.width / 2 + offsetX
        const centerY = canvas.height / 2 + offsetY
        const centerZ = 0
        const radius = Math.min(canvas.width, canvas.height) / 1.6

        // Apply sphere rotation to get particle's transformed position
        // First translate to origin
        const relX = this.originalX - canvas.width / 2
        const relY = this.originalY - canvas.height / 2
        const relZ = this.originalZ

        // Apply rotation around X and Y axes
        const cosX = Math.cos(sphereRotationX)
        const sinX = Math.sin(sphereRotationX)
        const cosY = Math.cos(sphereRotationY)
        const sinY = Math.sin(sphereRotationY)

        // Rotate around Y axis first
        const rotY_x = relX * cosY - relZ * sinY
        const rotY_z = relX * sinY + relZ * cosY

        // Then rotate around X axis
        const rotX_y = relY * cosX - rotY_z * sinX
        const rotX_z = relY * sinX + rotY_z * cosX

        // Target position is rotation + center + offset
        const targetX = rotY_x + centerX
        const targetY = rotX_y + centerY
        const targetZ = rotX_z

        // Smooth transition to rotated position
        const transitionSpeed = 0.05
        this.x += (targetX - this.x) * transitionSpeed
        this.y += (targetY - this.y) * transitionSpeed
        this.z += (targetZ - this.z) * transitionSpeed

        // Calculate 3D distance from center
        const dx = this.x - centerX
        const dy = this.y - centerY
        const dz = this.z - centerZ
        const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz)

        // If particle is outside the sphere, push it back
        if (distance3D > radius) {
          // Calculate the 3D angle from center to particle
          const phi = Math.atan2(dy, dx)
          const theta = Math.acos(dz / Math.max(distance3D, 0.001)) // Avoid division by zero

          // Set the particle back on the sphere surface
          this.x = centerX + Math.sin(theta) * Math.cos(phi) * radius * 0.98
          this.y = centerY + Math.sin(theta) * Math.sin(phi) * radius * 0.98
          this.z = centerZ + Math.cos(theta) * radius * 0.98

          // Reverse direction slightly
          this.speedX = -this.speedX * 0.3
          this.speedY = -this.speedY * 0.3
          this.speedZ = -this.speedZ * 0.3
        }

        // Enhanced mouse interaction to create attractive force (pull toward cursor instead of push away)
        if (mouseX && mouseY && mouseActiveRef.current) {
          // Calculate distance in 2D (the visible plane)
          const mouseDistance = Math.sqrt(
            Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2)
          )

          // Particles within a wider area around the mouse
          const interactionRadius = 150 // Even wider area of effect

          if (mouseDistance < interactionRadius) {
            // Create a falloff based on distance (closer particles affected more)
            const falloff = 1 - mouseDistance / interactionRadius
            const falloffSquared = falloff * falloff * falloff // More natural falloff

            // Instead of direct position influence, add gentle attraction toward mouse
            const attractionFactor = 0.2 // Gentle attraction
            const angle = Math.atan2(mouseY - this.y, mouseX - this.x)

            // Pull toward cursor
            this.velocityInfluenceX +=
              Math.cos(angle) * falloffSquared * attractionFactor
            this.velocityInfluenceY +=
              Math.sin(angle) * falloffSquared * attractionFactor

            // Add a small z-axis turbulence for more 3D feel
            const zEffect = falloff * Math.sin(time * 2 + this.x + this.y) * 0.2
            this.velocityInfluenceZ += zEffect

            // Add color shifting on interaction (subtle hue shift)
            const hueShift = Math.sin(time * 0.5) * 10 // Subtle 10 degree hue shift
            if (this.color.startsWith('hsla')) {
              const hueMatch = this.color.match(/hsla\(([^,]+),/)
              if (hueMatch && hueMatch[1]) {
                const currentHue = parseFloat(hueMatch[1])
                const newHue = currentHue + hueShift * falloffSquared
                this.color = this.color.replace(
                  /hsla\([^,]+,/,
                  `hsla(${newHue},`
                )
              }
            }
          }
        }

        // Add damping
        this.speedX *= 0.98
        this.speedY *= 0.98
        this.speedZ *= 0.98

        // Smooth pulse based on time
        const pulse =
          Math.sin(time * this.pulseSpeed + this.pulseOffset) *
            this.pulseFactor +
          1

        // Calculate scale based on z position for 3D effect
        // Particles closer to viewer (higher z) appear larger
        const zRange = radius * 2
        const zNormalized = (this.z + radius) / zRange // normalize to 0-1
        const scale = 0.5 + zNormalized

        // Calculate opacity based on z position
        // Particles further back are more transparent
        const opacity = this.opacity * (0.4 + zNormalized * 0.6)

        return { pulse, scale, opacity }
      }

      draw(
        ctx: CanvasRenderingContext2D,
        displayData: { pulse: number; scale: number; opacity: number }
      ) {
        const { pulse, scale, opacity } = displayData
        const finalSize = this.size * pulse * scale

        // Draw particle with glow effect, considering z-position
        ctx.beginPath()
        ctx.arc(this.x, this.y, finalSize, 0, Math.PI * 2)
        ctx.fillStyle = `${this.color}, ${opacity})`
        ctx.fill()

        // Add glow with smaller, brighter center
        ctx.beginPath()
        ctx.arc(this.x, this.y, finalSize * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `${this.color}, ${opacity * 1.2})`
        ctx.fill()
      }

      connect(
        particles: Particle[],
        ctx: CanvasRenderingContext2D,
        time: number
      ) {
        // Connect to nearby particles with lines
        for (let i = 0; i < particles.length; i++) {
          const otherParticle = particles[i]

          // Calculate 3D distance between particles
          const distance = Math.sqrt(
            Math.pow(this.x - otherParticle.x, 2) +
              Math.pow(this.y - otherParticle.y, 2) +
              Math.pow(this.z - otherParticle.z, 2)
          )

          // Only connect if they're close in 3D space
          if (distance < 80) {
            // Calculate average Z position to determine opacity
            const avgZ = (this.z + otherParticle.z) / 2
            const maxZ = Math.min(canvas.width, canvas.height) / 2.5
            const zFactor = (avgZ + maxZ) / (maxZ * 2) // normalize to 0-1

            // Draw a line with opacity based on distance and z-position
            const opacity = ((80 - distance) / 80) * 0.3 * zFactor

            // Gentle pulse effect for connections
            const connectionPulse = Math.sin(time * 0.3) * 0.1 + 0.9

            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(120, 180, 255, ${
              opacity * connectionPulse
            })`
            ctx.lineWidth = 0.3 + zFactor * 0.4 // lines get thicker as they get closer
            ctx.stroke()
          }
        }
      }
    }

    // Initialize particles in a 3D sphere
    const particleCount = Math.min(
      180, // More particles
      Math.max(120, (canvas.width * canvas.height) / 1200)
    )
    const particles: Particle[] = []

    // Create particles in a 3D spherical pattern
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 1.6 // Much bigger sphere

    for (let i = 0; i < particleCount; i++) {
      // Use spherical coordinates to position particles in 3D space
      // This distributes particles evenly on a sphere
      const phi = Math.acos((2 * i) / particleCount - 1) // polar angle (0 to π)
      const theta = Math.sqrt(particleCount * Math.PI) * phi // azimuthal angle (0 to 2π)

      // Convert spherical to cartesian coordinates
      const x = centerX + radius * Math.sin(phi) * Math.cos(theta) * 0.92 // Even larger radius factor
      const y = centerY + radius * Math.sin(phi) * Math.sin(theta) * 0.92 // Even larger radius factor
      const z = radius * Math.cos(phi) * 0.92 // Even larger radius factor

      particles.push(new Particle(x, y, z, 4.5)) // Larger particles
    }

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Animation function
    const animate = () => {
      time += 0.005 // slower time progression

      // Apply friction to the spin
      sphereSpinRef.current.x *= 0.98
      sphereSpinRef.current.y *= 0.98

      // Update sphere rotation based on spin
      sphereRotationRef.current.x += sphereSpinRef.current.x
      sphereRotationRef.current.y += sphereSpinRef.current.y

      // Gradually return offset to center
      sphereOffsetRef.current.x *= 0.95
      sphereOffsetRef.current.y *= 0.95

      // Decay mouse velocity over time
      if (!mouseActiveRef.current) {
        mouseVelocityRef.current.x *= 0.95
        mouseVelocityRef.current.y *= 0.95
      }

      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // More colorful background with radial gradient
      const gradient = ctx.createRadialGradient(
        centerX + sphereOffsetRef.current.x,
        centerY + sphereOffsetRef.current.y,
        0,
        centerX + sphereOffsetRef.current.x,
        centerY + sphereOffsetRef.current.y,
        radius
      )
      gradient.addColorStop(0, 'rgba(30, 40, 90, 0.2)')
      gradient.addColorStop(0.5, 'rgba(25, 20, 80, 0.1)')
      gradient.addColorStop(1, 'rgba(10, 15, 40, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sort particles by z-coordinate for proper 3D rendering (back to front)
      particles.sort((a, b) => a.z - b.z)

      // First draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].connect(particles, ctx, time)
      }

      // Then draw the particles themselves
      for (let i = 0; i < particles.length; i++) {
        const displayData = particles[i].update(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          time,
          sphereRotationRef.current.x,
          sphereRotationRef.current.y,
          sphereOffsetRef.current.x,
          sphereOffsetRef.current.y
        )
        particles[i].draw(ctx, displayData)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start the animation
    animate()
    setLoaded(true)

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      if (mouseActiveTimeoutRef.current) {
        clearTimeout(mouseActiveTimeoutRef.current)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, []) // No dependencies to prevent re-initialization

  return (
    <div className='w-full h-full relative'>
      <div className='w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-900/10 to-purple-900/10'>
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
