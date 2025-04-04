'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'

/**
 * ENHANCED BACKGROUND ANIMATION COMPONENT
 * ======================================
 * This component renders a line art animation that spans the entire viewport.
 * It includes advanced features like:
 * - Adaptive node count based on screen size
 * - Mobile-specific optimizations
 * - Touch interaction support
 * - Performance optimizations with device pixel ratio
 * - Theme-aware colors
 */

interface EnhancedBackgroundAnimationProps {
  color?: string
  lineColor?: string
  nodeColor?: string
  nodeCount?: number
  speed?: number
  isHomePage?: boolean
}

interface Dimensions {
  width: number
  height: number
}

// Anomaly types for visual effects
enum AnomalyType {
  SHIMMER = 'shimmer',
  PULSE = 'pulse',
  BLUR = 'blur',
  DISTORTION = 'distortion',
  GLITCH = 'glitch',
  PHANTOM = 'phantom',
  SHADOW = 'shadow'
}

// Configuration for each anomaly type
const ANOMALY_CONFIG = {
  [AnomalyType.SHIMMER]: {
    frames: 8,
    color: 'rgba(200, 213, 255, 0.18)',
    size: 25,
    speed: 0.5,
    attractionStrength: 0.01,
    effectRadius: 50
  },
  [AnomalyType.PULSE]: {
    frames: 6,
    color: 'rgba(150, 130, 220, 0.15)',
    size: 35,
    speed: 0.4,
    attractionStrength: 0.005,
    effectRadius: 60
  },
  [AnomalyType.BLUR]: {
    frames: 12,
    color: 'rgba(124, 173, 255, 0.12)',
    size: 40,
    speed: 0.3,
    attractionStrength: 0.01,
    effectRadius: 65
  },
  [AnomalyType.DISTORTION]: {
    frames: 10,
    color: 'rgba(140, 255, 237, 0.12)',
    size: 30,
    speed: 0.6,
    attractionStrength: 0.02,
    effectRadius: 55
  },
  [AnomalyType.GLITCH]: {
    frames: 4,
    color: 'rgba(200, 200, 220, 0.15)',
    size: 20,
    speed: 0.7,
    attractionStrength: 0.01,
    effectRadius: 40
  },
  [AnomalyType.PHANTOM]: {
    frames: 8,
    color: 'rgba(100, 100, 150, 0.15)',
    size: 30,
    speed: 0.5,
    attractionStrength: 0.01,
    effectRadius: 50
  },
  [AnomalyType.SHADOW]: {
    frames: 6,
    color: 'rgba(50, 50, 100, 0.15)',
    size: 20,
    speed: 0.4,
    attractionStrength: 0.005,
    effectRadius: 40
  }
}

// Network data stream to track active nodes and connections
const NetworkDataStream = {
  activeNodes: new Map<
    number,
    { x: number; y: number; velocity: number; connections: number }
  >(),
  activeLines: new Map<string, { strength: number; length: number }>(),
  highActivityAreas: [] as { x: number; y: number; intensity: number }[],
  lastUpdate: 0,
  updateInterval: 500,

  registerNode(
    nodeIndex: number,
    x: number,
    y: number,
    vx: number,
    vy: number
  ) {
    const velocity = Math.sqrt(vx * vx + vy * vy)
    const existing = this.activeNodes.get(nodeIndex)

    if (!existing) {
      this.activeNodes.set(nodeIndex, {
        x,
        y,
        velocity,
        connections: 0
      })
    } else {
      existing.x = x
      existing.y = y
      existing.velocity = velocity
    }
  },

  registerLine(
    nodeIndex1: number,
    nodeIndex2: number,
    distance: number,
    opacity: number
  ) {
    const id =
      nodeIndex1 < nodeIndex2
        ? `${nodeIndex1}-${nodeIndex2}`
        : `${nodeIndex2}-${nodeIndex1}`

    this.activeLines.set(id, { strength: opacity, length: distance })

    // Increment connection count for both nodes
    const node1 = this.activeNodes.get(nodeIndex1)
    const node2 = this.activeNodes.get(nodeIndex2)

    if (node1) node1.connections++
    if (node2) node2.connections++
  },

  // Find areas with high activity (many connections, high velocity)
  updateHighActivityAreas() {
    const now = performance.now()
    if (now - this.lastUpdate < this.updateInterval) return

    this.highActivityAreas = []
    this.lastUpdate = now

    // Clear previous high activity areas
    if (this.activeNodes.size === 0) return

    // Find nodes with high connection counts
    let maxConnections = 0
    for (const node of this.activeNodes.values()) {
      maxConnections = Math.max(maxConnections, node.connections)
    }

    const connectionThreshold = Math.max(2, maxConnections * 0.6)

    // Create activity areas around high-connection nodes
    for (const node of this.activeNodes.values()) {
      if (node.connections >= connectionThreshold) {
        this.highActivityAreas.push({
          x: node.x,
          y: node.y,
          intensity: node.connections / maxConnections
        })
      }
    }

    // Reset connection counts for next cycle
    for (const node of this.activeNodes.values()) {
      node.connections = 0
    }
  },

  // Get nearest high activity area to a point
  getNearestActivityArea(
    x: number,
    y: number,
    maxDistance: number
  ): { position: { x: number; y: number }; intensity: number } | null {
    if (this.highActivityAreas.length === 0) return null

    let nearestDist = Number.MAX_VALUE
    let nearest = null

    for (const area of this.highActivityAreas) {
      const dx = area.x - x
      const dy = area.y - y
      const distSquared = dx * dx + dy * dy

      if (distSquared < nearestDist && Math.sqrt(distSquared) < maxDistance) {
        nearestDist = distSquared
        nearest = area
      }
    }

    if (nearest) {
      return {
        position: { x: nearest.x, y: nearest.y },
        intensity: nearest.intensity
      }
    }

    return null
  },

  clear() {
    this.activeNodes.clear()
    this.activeLines.clear()
    this.highActivityAreas = []
  }
}

export default function EnhancedBackgroundAnimation({
  color = 'transparent',
  lineColor = 'rgba(150, 130, 220, 0.40)',
  nodeColor = 'rgba(150, 130, 220, 0.55)',
  nodeCount = 100,
  speed = 0.1,
  isHomePage = false
}: EnhancedBackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const nodesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }>
  >([])

  const [initialDimensions] = useState<Dimensions>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  }))

  const viewportRef = useRef<Dimensions>({
    width: initialDimensions.width,
    height: initialDimensions.height
  })

  const lastInitTimeRef = useRef<number>(0)
  const previousDimensionsRef = useRef<Dimensions>(initialDimensions)
  const isMobileRef = useRef<boolean>(initialDimensions.width <= 768)
  const frameCountRef = useRef<number>(0)
  const lastFrameTimeRef = useRef<number>(0)
  const [connectionCountState, setConnectionCountState] = useState<number>(0)

  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Calculate adaptive node count based on screen size
  const calculateNodeCount = useCallback(
    (width: number, height: number): number => {
      const isMobile = width <= 768
      // Use much higher density to match original animation
      const baseDensity = isMobile
        ? (nodeCount * 15.0) / 1920000 // Much higher density for mobile
        : (nodeCount * 12.0) / 1920000 // Much higher density for desktop

      // Calculate area in pixels
      const area = width * height

      // Apply a non-linear scaling with density factor
      const scaledCount = Math.round(
        baseDensity * area * Math.sqrt(area / (isMobile ? 800000 : 850000))
      )

      // Adjust min/max for mobile/desktop - significantly increased
      return isMobile
        ? Math.max(300, Math.min(1000, scaledCount))
        : Math.max(500, Math.min(2000, scaledCount))
    },
    [nodeCount]
  )

  // Determine if a resize is significant enough to reinitialize
  const isSignificantResize = useCallback(
    (newWidth: number, newHeight: number): boolean => {
      if (isMobileRef.current) {
        const originalWidth = initialDimensions.width
        const originalHeight = initialDimensions.height
        const widthChangePct =
          Math.abs(newWidth - originalWidth) / originalWidth
        const heightChangePct =
          Math.abs(newHeight - originalHeight) / originalHeight
        const isOrientationChange =
          (originalWidth > originalHeight && newWidth < newHeight) ||
          (originalWidth < originalHeight && newWidth > newHeight)
        const timeSinceLastInit = Date.now() - lastInitTimeRef.current
        return (
          (isOrientationChange ||
            widthChangePct > 0.25 ||
            heightChangePct > 0.25) &&
          timeSinceLastInit > 1500
        )
      }
      return true
    },
    [initialDimensions, lastInitTimeRef]
  )

  // Track mouse position without re-rendering
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Throttle mouse movement updates
    let lastMouseUpdate = 0
    const mouseThrottleInterval = 16 // ~60fps

    const handleMouseMove = (event: MouseEvent) => {
      const now = performance.now()
      if (now - lastMouseUpdate >= mouseThrottleInterval) {
        mousePosRef.current = { x: event.clientX, y: event.clientY }
        lastMouseUpdate = now
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const now = performance.now()
        if (now - lastMouseUpdate >= mouseThrottleInterval) {
          mousePosRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          }
          lastMouseUpdate = now
        }
      }
    }

    const handleTouchEnd = () => {
      setTimeout(() => {
        mousePosRef.current = null
      }, 500)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Initialize nodes based on current viewport with adaptive node count
  const initializeNodes = useCallback(() => {
    try {
      const viewport = viewportRef.current
      lastInitTimeRef.current = Date.now()
      previousDimensionsRef.current = {
        width: viewport.width,
        height: viewport.height
      }

      const adaptiveNodeCount = calculateNodeCount(
        viewport.width,
        viewport.height
      )
      const isMobile = isMobileRef.current
      const finalNodeCount = isMobile
        ? Math.max(300, Math.min(1000, adaptiveNodeCount))
        : Math.max(500, Math.min(2000, adaptiveNodeCount))

      nodesRef.current = []
      for (let i = 0; i < finalNodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * viewport.width,
          y: Math.random() * viewport.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + (isMobile ? 0.8 : 1)
        })
      }

      console.log(
        'LineArt: Initialized',
        nodesRef.current.length,
        'nodes at viewport',
        viewport.width,
        'x',
        viewport.height,
        isMobile ? '(mobile)' : ''
      )
    } catch (error) {
      console.error('Error initializing nodes:', error)
    }
  }, [calculateNodeCount, speed])

  // Check if canvas is visible in the DOM
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkCanvasVisibility = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0

      console.log('LineArt: Canvas visibility check', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        isVisible
      })
    }

    // Check immediately and after a short delay to ensure the canvas has rendered
    checkCanvasVisibility()
    const timer = setTimeout(checkCanvasVisibility, 500)

    return () => clearTimeout(timer)
  }, [])

  // Draw an anomaly effect
  const drawAnomaly = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    type: AnomalyType,
    intensity: number
  ) => {
    const config = ANOMALY_CONFIG[type]
    const size = config.size * intensity
    const alpha = config.color.split(',')[3].split(')')[0].trim()
    const baseColor =
      config.color.split(',')[0] +
      ',' +
      config.color.split(',')[1] +
      ',' +
      config.color.split(',')[2]

    // Create gradient for the anomaly
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size)

    gradient.addColorStop(0, `${baseColor}, ${parseFloat(alpha) * intensity})`)
    gradient.addColorStop(1, `${baseColor}, 0)`)

    // Draw the anomaly
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Main component setup effect
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      console.log('LineArt: Component mounted, isMobile:', isMobileRef.current)

      const canvas = canvasRef.current
      if (!canvas) {
        console.error('LineArt: Canvas reference is null')
        return
      }

      const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
      if (!ctx) {
        console.error('LineArt: Failed to get 2d context')
        return
      }

      const dpr = window.devicePixelRatio || 1

      // Initialize canvas once with the current dimensions
      const setupCanvas = () => {
        try {
          if (!canvas || !ctx) return

          // Get actual viewport dimensions including any bottom scrollable areas
          const viewportWidth = window.innerWidth
          const viewportHeight = Math.max(
            window.innerHeight,
            document.documentElement.scrollHeight
          )

          viewportRef.current = {
            width: viewportWidth,
            height: viewportHeight
          }

          canvas.width = viewportWidth * dpr
          canvas.height = viewportHeight * dpr
          ctx.scale(dpr, dpr)

          console.log('LineArt: Canvas setup', {
            width: canvas.width,
            height: canvas.height,
            dpr,
            viewportWidth,
            viewportHeight
          })

          if (
            nodesRef.current.length === 0 ||
            isSignificantResize(viewportWidth, viewportHeight)
          ) {
            initializeNodes()
          }
        } catch (error) {
          console.error('Error setting up canvas:', error)
        }
      }

      setupCanvas()

      const handleResize = () => {
        setupCanvas()
      }

      window.addEventListener('resize', handleResize, { passive: true })

      // Track visibility state
      let isVisible = true
      let animationFrameId: number | undefined

      const handleVisibilityChange = () => {
        isVisible = document.visibilityState === 'visible'
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      // Animation loop
      const animate = () => {
        try {
          if (!canvas || !ctx || !isVisible) {
            // If not visible, request next frame but don't render
            animationFrameId = requestAnimationFrame(animate)
            return
          }

          // Track frame rate
          const now = performance.now()
          frameCountRef.current++

          // Log FPS every 60 frames
          if (frameCountRef.current % 60 === 0) {
            const elapsed = now - lastFrameTimeRef.current
            const fps = 60 / (elapsed / 1000)
            console.log(`LineArt: FPS: ${fps.toFixed(1)}`)
            lastFrameTimeRef.current = now
          }

          ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

          // Clear network data for this frame
          NetworkDataStream.clear()

          // Use theme-aware colors or fall back to props
          const currentLineColor = isDarkMode
            ? 'rgba(255, 255, 255, 0.03)'
            : lineColor

          const currentNodeColor = isDarkMode
            ? 'rgba(255, 255, 255, 0.05)'
            : nodeColor

          // Draw connections
          ctx.strokeStyle = currentLineColor
          ctx.lineWidth = 1

          let connectionCount = 0
          for (let i = 0; i < nodesRef.current.length; i++) {
            const node = nodesRef.current[i]

            // Update position
            node.x += node.vx
            node.y += node.vy

            // Bounce off edges
            if (node.x <= 0 || node.x >= viewportRef.current.width)
              node.vx *= -1
            if (node.y <= 0 || node.y >= viewportRef.current.height)
              node.vy *= -1

            // Register node in network data stream
            NetworkDataStream.registerNode(i, node.x, node.y, node.vx, node.vy)

            // Draw connections to other nodes
            for (let j = i + 1; j < nodesRef.current.length; j++) {
              const otherNode = nodesRef.current[j]
              const dx = node.x - otherNode.x
              const dy = node.y - otherNode.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              // Increase connection distance threshold for more connections
              if (distance < (isMobileRef.current ? 200 : 250)) {
                connectionCount++
                const opacity = 1 - distance / (isMobileRef.current ? 200 : 250)
                ctx.strokeStyle = isDarkMode
                  ? `rgba(255, 255, 255, ${opacity * 0.03})`
                  : `${lineColor.split(',')[0]}, ${lineColor.split(',')[1]}, ${
                      lineColor.split(',')[2]
                    }, ${opacity * 0.4})`

                ctx.beginPath()
                ctx.moveTo(node.x, node.y)
                ctx.lineTo(otherNode.x, otherNode.y)
                ctx.stroke()

                // Register line in network data stream
                NetworkDataStream.registerLine(i, j, distance, opacity)
              }
            }
          }

          // Update high activity areas
          NetworkDataStream.updateHighActivityAreas()

          // Draw nodes
          ctx.fillStyle = currentNodeColor
          for (const node of nodesRef.current) {
            ctx.beginPath()
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
            ctx.fill()
          }

          // Draw anomalies at high activity areas
          if (isHomePage) {
            const anomalyTypes = Object.values(AnomalyType)
            for (const area of NetworkDataStream.highActivityAreas) {
              // Only draw anomalies for areas with sufficient intensity
              if (area.intensity > 0.3) {
                // Choose a random anomaly type
                const type =
                  anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
                drawAnomaly(ctx, area.x, area.y, type, area.intensity)
              }
            }
          }

          // Mouse interaction
          if (mousePosRef.current) {
            const mouseX = mousePosRef.current.x
            const mouseY = mousePosRef.current.y

            const gradient = ctx.createRadialGradient(
              mouseX,
              mouseY,
              0,
              mouseX,
              mouseY,
              100
            )

            gradient.addColorStop(
              0,
              isDarkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(150, 130, 220, 0.05)'
            )
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)

            // Attract nearby nodes with force limiting
            const maxForce = 0.05 // Limit maximum force applied
            const maxNodesAffected = 20 // Limit number of nodes affected per frame

            // Sort nodes by distance to mouse
            const sortedNodes = [...nodesRef.current]
              .map((node) => {
                const dx = mouseX - node.x
                const dy = mouseY - node.y
                return {
                  node,
                  distance: Math.sqrt(dx * dx + dy * dy)
                }
              })
              .filter((item) => item.distance < 150)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, maxNodesAffected) // Only affect closest nodes

            // Apply forces to limited number of nodes
            for (const { node, distance } of sortedNodes) {
              const dx = mouseX - node.x
              const dy = mouseY - node.y

              // Calculate force with damping
              const force = Math.min((150 - distance) / 1500, maxForce)

              // Apply force with damping
              node.vx += dx * force
              node.vy += dy * force

              // Limit node velocity
              const maxSpeed = 2
              const currentSpeed = Math.sqrt(
                node.vx * node.vx + node.vy * node.vy
              )
              if (currentSpeed > maxSpeed) {
                node.vx = (node.vx / currentSpeed) * maxSpeed
                node.vy = (node.vy / currentSpeed) * maxSpeed
              }
            }
          }

          // Log detailed performance metrics every 60 frames
          if (frameCountRef.current % 60 === 0) {
            const elapsed = now - lastFrameTimeRef.current
            const fps = 60 / (elapsed / 1000)
            console.log(`LineArt: Performance Metrics:
  - FPS: ${fps.toFixed(1)}
  - Nodes: ${nodesRef.current.length}
  - Connections: ${connectionCount}
  - Viewport: ${viewportRef.current.width}x${viewportRef.current.height}
  - Device: ${isMobileRef.current ? 'Mobile' : 'Desktop'}
  - Theme: ${isDarkMode ? 'Dark' : 'Light'}`)
            lastFrameTimeRef.current = now
            setConnectionCountState(connectionCount)
          }

          // Request next frame
          animationFrameId = requestAnimationFrame(animate)
        } catch (error) {
          console.error('Animation error:', error)
          // Restart animation on error
          animationFrameId = requestAnimationFrame(animate)
        }
      }

      // Start animation
      animationFrameId = requestAnimationFrame(animate)

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    } catch (error) {
      console.error('Error in main effect:', error)
    }
  }, [
    isDarkMode,
    speed,
    nodeCount,
    lineColor,
    nodeColor,
    isHomePage,
    initializeNodes,
    isSignificantResize
  ])

  return (
    <>
      <canvas
        ref={canvasRef}
        className='fixed inset-0 w-full h-full pointer-events-none'
        aria-hidden='true'
        style={{
          backgroundColor: color
        }}
        key={`animation-${nodeCount}-${speed}`}
      />
      <div className='fixed bottom-4 right-4 bg-black/70 text-white text-xs p-2 rounded pointer-events-none z-50'>
        <div>Nodes: {nodesRef.current.length}</div>
        <div>Connections: {connectionCountState}</div>
        <div>
          FPS:{' '}
          {frameCountRef.current % 60 === 0
            ? (
                60 /
                ((performance.now() - lastFrameTimeRef.current) / 1000)
              ).toFixed(1)
            : '...'}
        </div>
      </div>
    </>
  )
}
