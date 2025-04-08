'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

/**
 * GLOBAL LAYOUT COORDINATION
 * ==========================
 * The Header component sets critical padding values that must be mirrored
 * across the entire application's layout system.
 *
 * CRITICAL PADDING REQUIREMENTS:
 * -----------------------------
 * Current padding values: px-6 (for header)
 * Content areas use px-4 (for all other layouts)
 *
 * These padding values MUST be kept in sync with:
 * 1. src/app/layout.tsx (uses px-4)
 * 2. src/app/projects/layout.tsx (uses px-4)
 * 3. src/app/blog/layout.tsx (uses px-4)
 *
 * The header intentionally uses more padding (px-6) than content areas (px-4)
 * to provide visual distinction and breathing room.
 */

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Debug mobile menu changes
  useEffect(() => {
    console.log('Mobile menu state changed:', mobileMenuOpen)
  }, [mobileMenuOpen])

  // Only show the theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    // Listen for route changes in Next.js
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  const SocialIcons = () => (
    <div className='flex items-center space-x-2 relative z-50'>
      <a
        href='https://github.com/jeffknowlesjr'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors relative z-50'
        aria-label='GitHub Profile'
      >
        <i className='fab fa-github text-xl'></i>
      </a>
      <a
        href='https://linkedin.com/in/jeffknowlesjr'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors relative z-50'
        aria-label='LinkedIn Profile'
      >
        <i className='fab fa-linkedin-in text-xl'></i>
      </a>
      <a
        href='https://facebook.com/jeffknowlesjr'
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-[#1877F2] dark:hover:text-[#1877F2] transition-colors relative z-50'
        aria-label='Facebook Page'
      >
        <i className='fab fa-facebook-f text-xl'></i>
      </a>
      {mounted ? (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative z-50'
          aria-label={
            theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          }
        >
          <i
            className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-xl`}
          ></i>
        </button>
      ) : (
        <div className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 relative z-50'>
          <i className='fas fa-circle text-xl opacity-0'></i>
        </div>
      )}
    </div>
  )

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <header className='relative z-40 w-full'>
      {/* Top Bar - transparent background */}
      <div className='bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-sm h-14 w-full flex items-center'>
        <div className='flex justify-between items-center w-full mx-auto px-4 sm:px-6 lg:px-8'>
          <Link
            href='https://www.jkjrdev.com'
            className='flex items-center hover:text-teal-600 dark:hover:text-teal-400 transition-colors'
          >
            <i className='fas fa-cogs text-teal-500 mr-2'></i>
            <span className='text-gray-700 dark:text-gray-300 font-inter font-medium text-base truncate'>
              Jeff Knowles Jr Digital Development
            </span>
          </Link>
          {/* Desktop-only social icons */}
          <div className='hidden md:flex md:items-center'>
            <SocialIcons />
          </div>
        </div>
      </div>

      {/* Main Navigation - transparent background */}
      <nav className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm w-full'>
        <div className='flex justify-between items-center h-16 sm:h-20 max-h-[80px] w-full mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Logo */}
          <Link href='/' className='flex items-center flex-shrink-0'>
            <div className='h-10 flex items-center'>
              <Image
                src='/JKJR3.png'
                alt='JKJR Logo'
                width={101.9}
                height={40}
                className='w-auto h-full object-contain'
                priority
              />
            </div>
            <span className='sr-only'>Jeff Knowles Jr</span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex space-x-8'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button & social icons */}
          <div className='flex items-center md:hidden'>
            <div className='flex items-center'>
              <button
                type='button'
                className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                onClick={() => {
                  console.log(
                    'Toggle mobile menu button clicked, current state:',
                    mobileMenuOpen
                  )
                  setMobileMenuOpen(!mobileMenuOpen)
                }}
                aria-expanded={mobileMenuOpen}
                aria-label='Toggle mobile menu'
              >
                <i
                  className={`fas ${
                    mobileMenuOpen ? 'fa-times' : 'fa-bars'
                  } text-xl`}
                ></i>
              </button>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className='flex items-center justify-center h-10 w-10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
                  aria-label={
                    theme === 'dark'
                      ? 'Switch to Light Mode'
                      : 'Switch to Dark Mode'
                  }
                >
                  <i
                    className={`fas ${
                      theme === 'dark' ? 'fa-sun' : 'fa-moon'
                    } text-xl`}
                  ></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Ultra Simple Version */}
      {mobileMenuOpen ? (
        <div
          id='mobileMenu'
          className='fixed inset-0 bg-black/70 z-[9999]'
          onClick={(e) => {
            // Only close if clicking the backdrop (not the menu itself)
            if (e.target === e.currentTarget) {
              console.log('Backdrop clicked, closing menu')
              setMobileMenuOpen(false)
            }
          }}
        >
          <div className='fixed top-0 right-0 w-[80%] max-w-[300px] h-full bg-white dark:bg-gray-800 overflow-auto'>
            <div className='p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700'>
              <div className='h-10'>
                <Image
                  src='/JKJR3.png'
                  alt='JKJR Logo'
                  width={101.9}
                  height={40}
                  className='w-auto h-full object-contain'
                />
              </div>
              <button
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => {
                  console.log('Close button clicked')
                  setMobileMenuOpen(false)
                }}
              >
                <i className='fas fa-times text-xl'></i>
              </button>
            </div>

            <div className='p-4'>
              <ul className='space-y-3'>
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='block p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-lg'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex justify-start space-x-5'>
                <a
                  href='https://github.com/jeffknowlesjr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='h-10 w-10 flex items-center justify-center text-xl'
                >
                  <i className='fab fa-github'></i>
                </a>
                <a
                  href='https://linkedin.com/in/jeffknowlesjr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='h-10 w-10 flex items-center justify-center text-xl'
                >
                  <i className='fab fa-linkedin-in'></i>
                </a>
                <a
                  href='https://facebook.com/jeffknowlesjr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='h-10 w-10 flex items-center justify-center text-xl'
                >
                  <i className='fab fa-facebook-f'></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
