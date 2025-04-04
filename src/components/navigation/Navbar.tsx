import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Overview', path: '/overview' },
    { label: 'Projects', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ]

  const logoColors = theme === 'dark' ? 'text-white' : 'text-gray-900'

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link to='/' className={`text-2xl font-bold ${logoColors}`}>
                Jeff Knowles
              </Link>
            </div>
            <nav className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className='flex items-center space-x-4'>
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
                  key={item.path}
                  to={item.path}
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
