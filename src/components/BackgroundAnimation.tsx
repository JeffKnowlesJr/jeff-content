'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Node class for line art
    class Node {
      x: number
      y: number
      vx: number
      vy: number
      width: number
      height: number

      constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.width = width
        this.height = height
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x <= 0 || this.x >= this.width) this.vx *= -1
        if (this.y <= 0 || this.y >= this.height) this.vy *= -1
      }
    }

    // Create nodes
    const nodes: Node[] = []
    const nodeCount = Math.floor((canvas.width * canvas.height) / 50000)
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new Node(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          canvas.width,
          canvas.height
        )
      )
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      const lineColor =
        theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update()

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 w-full h-full pointer-events-none'
      aria-hidden='true'
    />
  )
}
