import React, { useState, useEffect, createContext } from 'react'
import Sidebar from './Sidebar'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * CRITICAL LAYOUT DOCUMENTATION
 * =============================
 * This GlobalLayout is the primary container for most pages in the application.
 * It works in conjunction with more specialized layouts like:
 * - ProjectLayout.tsx (in components/layouts)
 * - BlogLayout.tsx (in components/layouts)
 *
 * PADDING AND CONSISTENCY REQUIREMENTS:
 * -------------------------------------
 * 1. This layout's content padding should use the standard px-4 value
 *    Note: The Header uses asymmetrical padding (px-6 left, px-4 right)
 *
 * 2. These px-4 padding values should be mirrored in specialized layouts
 *    for consistent content alignment across the entire application
 *
 * 3. All layout components should use matching width constraints
 *    such as max-w-screen-xl and overflow handling
 *
 * 4. Mobile responsiveness depends on proper overflow control across
 *    all layout components in this hierarchy
 *
 * SIDEBAR HANDLING:
 * ----------------
 * The sidebar should not scroll independently of the main content on desktop.
 * On mobile, the sidebar remains fixed position with its own scroll.
 *
 * CONTENT RESIZING:
 * The main content area will automatically resize when the sidebar is expanded or collapsed.
 * There are no minimum width constraints on the content area to prevent overflow.
 *
 * POSITIONING:
 * The sidebar uses relative positioning instead of fixed/sticky positioning
 * to provide a more natural flow with the page content.
 * The sidebar spans the full height of the page to match the background.
 */

// Create a context to track if a sidebar is already rendered
export const SidebarContext = createContext<boolean>(false)

interface GlobalLayoutProps {
  children: React.ReactNode
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { theme } = useTheme()

  // Define theme-aware colors for the mobile sidebar
  const mobileSidebarBg = theme === 'dark' ? 'bg-gray-900/70' : 'bg-white/70'

  // Handle body scroll locking when mobile sidebar is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to ensure body scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileSidebarOpen])

  useEffect(() => {
    const checkIfDesktop = () => {
      const isDesktop = window.innerWidth >= 1024 // 1024px is the 'lg' breakpoint in Tailwind
      setIsSidebarOpen(isDesktop) // Open by default only on desktop
      if (isDesktop) {
        setIsMobileSidebarOpen(false) // Close mobile sidebar when switching to desktop
      }
    }

    checkIfDesktop()
    window.addEventListener('resize', checkIfDesktop)

    return () => {
      window.removeEventListener('resize', checkIfDesktop)
    }
  }, [])

  const toggleSidebar = () => {
    const isDesktop = window.innerWidth >= 1024
    if (isDesktop) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    }
  }

  // Calculate sidebar width based on state
  const sidebarWidth = isSidebarOpen ? 'w-64 xl:w-72' : 'w-16'

  return (
    <SidebarContext.Provider value={true}>
      <div className='flex w-full bg-transparent min-h-screen'>
        {/* Desktop Sidebar - hidden on mobile/tablet */}
        <aside
          className={`hidden lg:block ${sidebarWidth} relative min-h-screen h-full`}
        >
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </aside>

        {/* Mobile sidebar overlay - only shown when mobile sidebar is open */}
        {isMobileSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990] lg:hidden'
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Mobile Sidebar - slides in from left when toggled */}
        <aside
          className={`fixed top-0 left-0 h-[100dvh] w-full ${mobileSidebarBg} backdrop-blur-sm shadow-xl z-[9991] transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar isOpen={true} onToggle={toggleSidebar} />
        </aside>

        {/* Main content */}
        <main className={`flex-grow w-full min-h-[100dvh]`}>
          <div className='mx-auto w-full max-w-full py-6'>{children}</div>
        </main>

        {/* Mobile menu toggle - bottom right chevron - hidden when sidebar is open */}
        {!isMobileSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className='lg:hidden fixed bottom-4 right-4 w-12 h-12 rounded-full bg-[#52babb]/70 backdrop-blur-sm text-white flex items-center justify-center shadow-lg z-[9999] cursor-pointer active:scale-95 transition-transform touch-auto'
            aria-label='Toggle menu'
            type='button'
          >
            <i className='fas fa-chevron-right text-base'></i>
          </button>
        )}
      </div>
    </SidebarContext.Provider>
  )
}

export default GlobalLayout
