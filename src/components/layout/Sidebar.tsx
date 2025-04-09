import React, { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import ProjectSidebar from './ProjectSidebar'
import NavMenu from './NavMenu'

/**
 * SIDEBAR COMPONENT
 * ================
 * This component provides navigation for the application.
 *
 * SCROLLING BEHAVIOR:
 * The sidebar does not scroll independently of the main content.
 * It follows the same scroll position as the main content to maintain
 * visual consistency across the interface.
 *
 * ICON STYLING:
 * - Project icons use larger sizes (text-2xl)
 * - Icons have distinct colors to improve visual hierarchy
 * - Hover effects enhance interactive feedback
 *
 * ANIMATION:
 * - Main menu icons feature a right-to-left swipe animation
 * - Icons scale up slightly on hover for interactive feedback
 *
 * POSITIONING:
 * - The sidebar uses relative positioning instead of fixed
 * - This provides a more natural flow with the page content
 * - Full height (100%) to match the background consistently
 */

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  // Add a resize listener to update isMobile state
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener('resize', checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Handler to close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      onToggle()
    }
  }

  // Define theme-aware colors
  const bgColor =
    theme === 'dark'
      ? 'bg-gray-900/70 backdrop-blur-sm'
      : 'bg-white/70 backdrop-blur-sm'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const borderColor =
    theme === 'dark' ? 'border-[#52babb]/20' : 'border-[#52babb]/30'

  // Dynamic width calculation based on desktop or mobile
  const sidebarWidth = isMobile
    ? 'w-full' // Full width on mobile
    : isOpen
    ? 'w-64 xl:w-72' // Normal width when open on desktop
    : 'w-16' // Collapsed width on desktop

  return (
    <div
      className={`h-full min-h-screen border-r ${borderColor} ${bgColor} ${sidebarWidth} flex flex-col relative z-50 ${
        !isMobile ? 'border-b' : ''
      }`}
    >
      {/* Header that scrolls with content */}
      <div
        className={`h-16 flex items-center justify-end px-3 border-b ${borderColor} flex-shrink-0 ${bgColor}`}
      >
        {!isOpen && !isMobile && (
          <div className='w-full flex justify-center'>
            <button
              onClick={onToggle}
              type='button'
              className='w-12 h-12 bg-transparent flex items-center justify-center text-[#52babb]/70 hover:text-[#52babb] cursor-pointer transition-colors'
              aria-label='Open sidebar'
            >
              <i className='fas fa-chevron-right text-lg'></i>
            </button>
          </div>
        )}

        {(isOpen || isMobile) && (
          <button
            onClick={onToggle}
            type='button'
            className='text-[#52babb]/70 hover:text-[#52babb] transition-colors p-2 rounded-lg'
            aria-label='Close sidebar'
          >
            <i className='fas fa-times text-lg'></i>
          </button>
        )}
      </div>

      {/* Content area - scrollable on mobile */}
      <div className='flex-1'>
        <div className='px-6 py-8 space-y-8'>
          <div>
            <h2
              className={`text-2xl font-bold ${textColor} mb-8 tracking-tight transition-colors duration-500 ${
                !isOpen && !isMobile && 'hidden'
              }`}
            >
              Welcome
            </h2>
          </div>

          {/* Use the NavMenu component */}
          <NavMenu
            isMobile={isMobile}
            isOpen={isOpen}
            onLinkClick={handleLinkClick}
          />

          {(isOpen || isMobile) && (
            <div className='space-y-8'>
              <ProjectSidebar onLinkClick={handleLinkClick} />
            </div>
          )}
        </div>
        {/* Add extra padding at the bottom for mobile */}
        <div className='h-24'></div>
      </div>
    </div>
  )
}

export default Sidebar
