import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { SidebarContext } from './GlobalLayout'
import Link from 'next/link'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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

  // Calculate sidebar width based on state
  const sidebarWidth = isSidebarOpen ? 'w-64 xl:w-72' : 'w-16'

  return (
    <SidebarContext.Provider value={true}>
      <div className='min-h-screen bg-white dark:bg-gray-900'>
        <header className='border-b border-gray-200 dark:border-gray-800'>
          <nav className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <Link href='/' className='text-xl font-bold'>
                Jeff Knowles Jr.
              </Link>
              <div className='flex items-center gap-6'>
                <Link
                  href='/blog'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                >
                  Blog
                </Link>
                <Link
                  href='/projects'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                >
                  Projects
                </Link>
                <Link
                  href='/resources'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                >
                  Resources
                </Link>
                <Link
                  href='/docs'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                >
                  Docs
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <div className='grid grid-cols-[auto_1fr]'>
          {/* Sidebar */}
          <aside className={`${sidebarWidth} transition-all duration-300`}>
            <div className='fixed top-[80px] h-[calc(100vh-80px)]'>
              <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            </div>
          </aside>

          {/* Main content */}
          <main className='overflow-x-hidden'>
            <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6'>
              {children}
            </div>
          </main>
        </div>
        <footer className='border-t border-gray-200 dark:border-gray-800 mt-12'>
          <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='text-gray-600 dark:text-gray-400'>
                © {new Date().getFullYear()} Jeff Knowles Jr. All rights
                reserved.
              </div>
              <div className='flex items-center gap-4 mt-4 md:mt-0'>
                <a
                  href='https://github.com/yourusername'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                  GitHub
                </a>
                <a
                  href='https://twitter.com/yourusername'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                  Twitter
                </a>
                <a
                  href='https://linkedin.com/in/yourusername'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SidebarContext.Provider>
  )
}

export default MainLayout
