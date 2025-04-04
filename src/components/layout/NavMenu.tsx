import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'

/**
 * NAVMENU COMPONENT
 * ================
 * This component provides the main navigation menu with swipeable icons.
 *
 * FEATURES:
 * - Right-to-left swipe animation on icons (touch devices only)
 * - Vibrant color scheme for icons
 * - Modern right-aligned icons with text on left
 * - Fully responsive design
 * - Touch detection for conditional animations
 * - Icons maintain circular shape even when sidebar is compressed
 */

interface NavMenuProps {
  isMobile: boolean
  isOpen: boolean
  onLinkClick?: () => void
}

const NavMenu: React.FC<NavMenuProps> = ({ isMobile, isOpen, onLinkClick }) => {
  const { theme } = useTheme()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect if touch is available
  useEffect(() => {
    const detectTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.maxTouchPoints > 0 // Use standard property instead of msMaxTouchPoints
      )
    }

    detectTouch()
    window.addEventListener('touchstart', () => setIsTouchDevice(true), {
      once: true
    })

    return () => {
      window.removeEventListener('touchstart', () => setIsTouchDevice(true))
    }
  }, [])

  // Define theme-aware colors
  const textColorDimmed = theme === 'dark' ? 'text-white/80' : 'text-gray-600'
  const accentBgColor = theme === 'dark' ? 'bg-[#52babb]/15' : 'bg-[#52babb]/15'
  const accentHoverBgColor =
    theme === 'dark' ? 'bg-[#52babb]/25' : 'bg-[#52babb]/25'

  // Icon colors - vibrant and varied
  const overviewIconColor = 'text-purple-500'
  const blogIconColor = 'text-[#52babb]'
  const projectIconColor = 'text-amber-500'
  const contactIconColor = 'text-sky-500'

  // Animation variants for the swipe effect (only on touch devices)
  const iconVariants = isTouchDevice
    ? {
        initial: { x: 20, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
        hover: { scale: 1.1, transition: { duration: 0.2 } }
      }
    : {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        hover: { scale: 1.1, transition: { duration: 0.2 } }
      }

  // Animation variants for the container
  const containerVariants = isTouchDevice
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }
    : {
        initial: { opacity: 1 },
        animate: { opacity: 1 }
      }

  // Touch handlers for swipe effect
  const handleTouchStart = () => {
    if (!isTouchDevice) return
    // Touch handling logic can be added here if needed
  }

  // Icon container style to ensure perfect circles
  const iconContainerStyle = {
    minWidth: '46px',
    minHeight: '46px',
    width: '46px',
    height: '46px',
    aspectRatio: '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%', // Make it a perfect circle instead of rounded corners
    marginLeft: '-16px' // Move the circles 16px to the left
  }

  return (
    <motion.nav
      className='space-y-4'
      variants={containerVariants}
      initial='initial'
      animate='animate'
    >
      <Link
        to='/about'
        className={`flex items-center ${textColorDimmed} hover:text-[#52babb] transition-colors min-h-[42px] group justify-between`}
        onClick={onLinkClick}
      >
        <span
          className={`font-medium tracking-wide ${
            !isOpen && !isMobile && 'hidden'
          }`}
        >
          About
        </span>
        <motion.span
          className={`flex items-center justify-center ${accentBgColor} group-hover:${accentHoverBgColor} transition-colors`}
          style={iconContainerStyle}
          variants={iconVariants}
          whileHover='hover'
          onTouchStart={handleTouchStart}
          data-is-touch={isTouchDevice}
        >
          <i
            className={`fas fa-compass text-xl ${overviewIconColor} group-hover:text-[#52babb]`}
          ></i>
        </motion.span>
      </Link>

      <Link
        to='/blog'
        className={`flex items-center ${textColorDimmed} hover:text-[#52babb] transition-colors min-h-[42px] group justify-between`}
        onClick={onLinkClick}
      >
        <span
          className={`font-medium tracking-wide text-base md:text-lg ${
            !isOpen && !isMobile && 'hidden'
          }`}
        >
          Blog
        </span>
        <motion.span
          className={`flex items-center justify-center ${accentBgColor} group-hover:${accentHoverBgColor} transition-colors`}
          style={iconContainerStyle}
          variants={iconVariants}
          whileHover='hover'
          onTouchStart={handleTouchStart}
          data-is-touch={isTouchDevice}
        >
          <i
            className={`fas fa-blog text-2xl ${blogIconColor} group-hover:text-[#52babb]`}
          ></i>
        </motion.span>
      </Link>

      <Link
        to='/projects'
        className={`flex items-center ${textColorDimmed} hover:text-[#52babb] transition-colors min-h-[42px] group justify-between`}
        onClick={onLinkClick}
      >
        <span
          className={`font-medium tracking-wide text-base md:text-lg ${
            !isOpen && !isMobile && 'hidden'
          }`}
        >
          Project List
        </span>
        <motion.span
          className={`flex items-center justify-center ${accentBgColor} group-hover:${accentHoverBgColor} transition-colors`}
          style={iconContainerStyle}
          variants={iconVariants}
          whileHover='hover'
          onTouchStart={handleTouchStart}
          data-is-touch={isTouchDevice}
        >
          <i
            className={`fas fa-project-diagram text-2xl ${projectIconColor} group-hover:text-[#52babb]`}
          ></i>
        </motion.span>
      </Link>

      <Link
        to='/resources'
        className={`flex items-center ${textColorDimmed} hover:text-[#52babb] transition-colors min-h-[42px] group justify-between`}
        onClick={onLinkClick}
      >
        <span
          className={`font-medium tracking-wide text-base md:text-lg ${
            !isOpen && !isMobile && 'hidden'
          }`}
        >
          Resources
        </span>
        <motion.span
          className={`flex items-center justify-center ${accentBgColor} group-hover:${accentHoverBgColor} transition-colors`}
          style={iconContainerStyle}
          variants={iconVariants}
          whileHover='hover'
          onTouchStart={handleTouchStart}
          data-is-touch={isTouchDevice}
        >
          <i
            className={`fas fa-book text-2xl text-emerald-500 group-hover:text-[#52babb]`}
          ></i>
        </motion.span>
      </Link>

      <Link
        to='/contact'
        className={`flex items-center ${textColorDimmed} hover:text-[#52babb] transition-colors min-h-[42px] group justify-between`}
        onClick={onLinkClick}
      >
        <span
          className={`font-medium tracking-wide ${
            !isOpen && !isMobile && 'hidden'
          }`}
        >
          Contact
        </span>
        <motion.span
          className={`flex items-center justify-center ${accentBgColor} group-hover:${accentHoverBgColor} transition-colors`}
          style={iconContainerStyle}
          variants={iconVariants}
          whileHover='hover'
          onTouchStart={handleTouchStart}
          data-is-touch={isTouchDevice}
        >
          <i
            className={`fas fa-envelope text-xl ${contactIconColor} group-hover:text-[#52babb]`}
          ></i>
        </motion.span>
      </Link>
    </motion.nav>
  )
}

export default NavMenu
