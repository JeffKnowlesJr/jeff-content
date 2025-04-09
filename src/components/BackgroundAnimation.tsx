'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { createPerspectiveBoxes } from './animations/perspectiveBoxes'
import { setupCanvas } from './animations/canvasUtils'

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Setup canvas with animation
    const cleanup = setupCanvas(canvas, createPerspectiveBoxes, theme)

    // Cleanup on unmount
    return cleanup
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 w-full h-full'
      style={{
        opacity: 0.7,
        pointerEvents: 'none'
      }}
    />
  )
}
