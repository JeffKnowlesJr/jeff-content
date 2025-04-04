import React, { useState, useEffect } from 'react'
import { BaseLayout } from './BaseLayout'

// Import Sidebar or create a simplified version if needed
// For now, I'll create a simplified version
const Sidebar: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({
  isOpen,
  onToggle
}) => {
  return (
    <div
      className={`h-full bg-gray-100 dark:bg-gray-800 p-4 ${
        isOpen ? 'w-64 xl:w-72' : 'w-16'
      }`}
    >
      <button
        onClick={onToggle}
        className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mb-6'
      >
        {isOpen ? <span>←</span> : <span>→</span>}
      </button>

      {/* Sidebar content goes here - simplified for now */}
      <nav className={`${isOpen ? 'block' : 'hidden'}`}>
        <ul className='space-y-4'>
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Tasks</li>
          <li>Reports</li>
        </ul>
      </nav>
    </div>
  )
}

interface SidebarLayoutProps {
  children: React.ReactNode
}

/**
 * SidebarLayout - Extends BaseLayout with a collapsible sidebar
 * For pages that need a sidebar navigation
 */
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const checkIfDesktop = () => {
      const isDesktop = window.innerWidth >= 1024 // 1024px is the 'lg' breakpoint in Tailwind
      setIsSidebarOpen(isDesktop) // Open by default only on desktop
    }

    checkIfDesktop()
    window.addEventListener('resize', checkIfDesktop)

    return () => {
      window.removeEventListener('resize', checkIfDesktop)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <BaseLayout>
      <div className='grid grid-cols-[auto_1fr]'>
        {/* Sidebar */}
        <aside className={`transition-all duration-300`}>
          <div className='fixed top-[80px] h-[calc(100vh-80px)]'>
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          </div>
        </aside>

        {/* Main content */}
        <main className='overflow-x-hidden'>{children}</main>
      </div>
    </BaseLayout>
  )
}
