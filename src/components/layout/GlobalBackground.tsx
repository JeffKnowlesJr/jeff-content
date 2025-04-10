'use client'

import React from 'react'
import { useTheme } from 'next-themes'

/**
 * FULL VIEWPORT BACKGROUND SYSTEM
 * ===============================
 * This component establishes the full viewport background and content container.
 *
 * RELATED COMPONENTS:
 * - ThemedApp (places this as the root container)
 *
 * VIEWPORT COVERAGE:
 * The background is designed to cover the entire viewport using:
 * 1. Fixed positioning (fixed inset-0) for the background container
 * 2. w-screen/h-screen classes to ensure full width/height coverage
 * 3. overflow-hidden to prevent scrollbars on the background only
 * 4. bottom-0 explicitly set to ensure coverage to viewport bottom
 *
 * Z-INDEX LAYERING:
 * - Background container: z-0 (background)
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
      {/* Background */}
      <div
        className='fixed inset-0 z-0'
        style={{
          backgroundColor: isDarkMode ? 'rgb(17, 17, 17)' : 'rgb(250, 250, 250)'
        }}
      />

      {/* Content Container */}
      <div className='relative z-10 min-h-screen w-full'>{children}</div>
    </div>
  )
}
