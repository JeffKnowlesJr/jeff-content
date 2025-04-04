import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'

/**
 * MainHeader component that includes the navigation menu.
 * This is a separate component that can be used for redesigning the header.
 */
const MainHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' }
  ]

  return (
    <header className='bg-white dark:bg-gray-900 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                to='/'
                className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'
              >
                <img
                  src='/assets/logo-dark.svg'
                  alt='Logo'
                  className='h-8 w-8 block dark:hidden'
                />
                <img
                  src='/assets/logo-light.svg'
                  alt='Logo'
                  className='h-8 w-8 hidden dark:block'
                />
                Jeff Knowles
              </Link>
            </div>
            <nav className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className='flex items-center'>
            <button
              onClick={toggleTheme}
              className='p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <div className='sm:hidden'>
              <button
                onClick={toggleMenu}
                className='p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='sm:hidden'
          >
            <div className='pt-2 pb-3 space-y-1'>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default MainHeader
