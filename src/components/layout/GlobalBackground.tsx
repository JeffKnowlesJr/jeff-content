'use client'

import React, { Suspense } from 'react'
import { useTheme } from 'next-themes'
import EnhancedBackgroundAnimation from '../EnhancedBackgroundAnimation'

/**
 * FULL VIEWPORT BACKGROUND SYSTEM
 * ===============================
 * This component establishes the full viewport animation backdrop and content container.
 *
 * RELATED COMPONENTS:
 * - EnhancedBackgroundAnimation (provides the animation)
 * - ThemedApp (places this as the root container)
 *
 * VIEWPORT COVERAGE:
 * The animation is designed to cover the entire viewport using:
 * 1. Fixed positioning (fixed inset-0) for the animation container
 * 2. w-screen/h-screen classes to ensure full width/height coverage
 * 3. overflow-hidden to prevent scrollbars on the animation only
 * 4. bottom-0 explicitly set to ensure coverage to viewport bottom
 *
 * Z-INDEX LAYERING:
 * - Animation container: z-0 (background)
 * - Content container: z-10 (foreground)
 *
 * MOBILE SCROLLING:
 * - The content container does NOT have overflow restrictions
 * - This ensures mobile scrolling works properly
 */

interface GlobalBackgroundProps {
  children: React.ReactNode
}

export default function GlobalBackground({ children }: GlobalBackgroundProps) {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className='relative min-h-screen w-full overflow-hidden'>
      {/* Background Animation */}
      <div className='fixed inset-0 z-0'>
        <Suspense fallback={<div className='w-full h-full bg-background' />}>
          <EnhancedBackgroundAnimation
            color={isDarkMode ? 'rgb(17, 17, 17)' : 'rgb(250, 250, 250)'}
            lineColor={
              isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }
            nodeColor={
              isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
            }
            nodeCount={50}
            speed={0.05}
            isHomePage={false}
          />
        </Suspense>
      </div>

      {/* Content Container */}
      <div className='relative z-10 min-h-screen w-full'>{children}</div>
    </div>
  )
}
