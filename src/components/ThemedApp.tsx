'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

interface ThemedAppProps {
  children: React.ReactNode
}

/**
 * THEMEDAPP - ROOT APPLICATION CONTAINER
 * =====================================
 * This component establishes the basic structure of the application,
 * including theme management and viewport calculations.
 *
 * VIEWPORT HANDLING:
 * - Calculates and maintains accurate viewport height for mobile browsers
 * - Uses CSS variable (--vh) to ensure proper full-height layouts
 *
 * THEME MANAGEMENT:
 * - Provides theme context via next-themes
 * - Handles system preference detection
 * - Manages theme persistence
 */
export default function ThemedApp({ children }: ThemedAppProps) {
  // Force viewport height CSS variable to ensure full viewport coverage
  useEffect(() => {
    const updateViewportHeight = () => {
      // Set a CSS variable for the actual viewport height
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      )
    }

    // Initial setup
    updateViewportHeight()

    // Update on resize
    window.addEventListener('resize', updateViewportHeight)

    // Cleanup
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
