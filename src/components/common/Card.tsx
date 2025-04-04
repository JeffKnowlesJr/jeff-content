import React, { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'

interface CardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  defaultMinimized?: boolean
  index: number
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragEnter: (e: React.DragEvent, index: number) => void
  onDragEnd: (e: React.DragEvent) => void
  onDragExpand?: (index: number) => void
  onFormToggle?: (isOpen: boolean, cardIndex: number) => void
  detailedContent?: {
    leftColumn: React.ReactNode
    rightColumn: React.ReactNode
  }
  className?: string
}

type CardState = 'minimized' | 'normal' | 'maximized'

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  defaultMinimized = true,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDragExpand,
  onFormToggle,
  detailedContent,
  className = ''
}) => {
  const { theme } = useTheme()
  const [cardState, setCardState] = useState<CardState>(
    defaultMinimized ? 'minimized' : 'normal'
  )
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState<number>(0)
  const isMinimized = cardState === 'minimized'
  const isMaximized = cardState === 'maximized'

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    onDragStart(e, index)
  }

  const handleDrag = (e: React.DragEvent) => {
    if (!isDragging || !e.clientX) return

    const dragDistance = e.clientX - dragStartX
    // If dragged more than 100px to the right, trigger expand
    if (dragDistance > 100 && onDragExpand) {
      onDragExpand(index)
      setCardState('maximized')
      // Don't automatically open form on drag expand
      setIsDragging(false)
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    onDragEnd(e)
  }

  // Handle toggling between minimized and normal state
  const handleStateToggle = () => {
    setCardState((prev) => {
      if (prev === 'minimized') return 'normal'
      // Always close form when minimizing
      if (prev === 'normal' || prev === 'maximized') {
        onFormToggle?.(false, index)
        return 'minimized'
      }
      return 'normal'
    })
  }

  // Used for the "Read More" button - one click expands
  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation()
    // One-click expansion directly to maximized state
    setCardState('maximized')
    onDragExpand?.(index)
  }

  // Handle double-click to toggle card state up or down
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (cardState === 'minimized') {
      setCardState('normal')
    } else if (cardState === 'normal') {
      setCardState('maximized')
      // Don't automatically open form on maximize
      onDragExpand?.(index)
    } else if (cardState === 'maximized') {
      onFormToggle?.(false, index)
      setCardState('minimized')
    }
  }

  // Define theme-aware styles
  const cardBackground = `bg-gradient-to-br from-[#52babb]/5 to-transparent backdrop-blur-sm border border-[#52babb]/20`
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const subtitleColor =
    theme === 'dark' ? 'text-[#52babb]/90' : 'text-[#52babb]'
  const descriptionColor =
    theme === 'dark' ? 'text-gray-300/90' : 'text-gray-700'
  const buttonBgColor = theme === 'dark' ? 'bg-[#282c34]' : 'bg-[#f8f5f0]'
  const readMoreHoverColor =
    theme === 'dark' ? 'hover:text-white' : 'hover:text-[#52babb]/80'

  // Enhanced detailed content theme-aware styles with more selectors
  const headingTextColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const contentTextColor =
    theme === 'dark' ? 'text-gray-300/90' : 'text-gray-700'
  const iconColor = 'text-[#52babb]'

  // Create a style element with higher specificity CSS to override hard-coded classes
  useEffect(() => {
    // Create a style element if it doesn't exist
    let styleEl = document.getElementById('card-theme-styles')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'card-theme-styles'
      document.head.appendChild(styleEl)
    }

    // Define CSS with high specificity to override inline styles
    const css = `
      .card-detailed-content h3 {
        color: ${theme === 'dark' ? 'white' : '#1f2937'} !important;
      }
      .card-detailed-content ul, 
      .card-detailed-content li,
      .card-detailed-content p,
      .card-detailed-content span,
      .card-detailed-content div {
        color: ${
          theme === 'dark' ? 'rgba(209, 213, 219, 0.9)' : '#4b5563'
        } !important;
      }
      .card-detailed-content i {
        color: #52babb !important;
      }
    `

    styleEl.textContent = css

    // Cleanup on unmount
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl)
      }
    }
  }, [theme])

  // Hover animation gradient with theme-aware opacity
  const hoverGradient =
    theme === 'dark'
      ? 'bg-gradient-to-br from-[#52babb]/5 via-transparent to-[#52babb]/5'
      : 'bg-gradient-to-br from-[#52babb]/20 via-[#52babb]/5 to-[#52babb]/20'

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${cardBackground} p-5 sm:p-6 group hover:border-[#52babb]/40 transition-all duration-300 touch-manipulation ${
        isDragging
          ? 'opacity-50 cursor-grabbing'
          : 'cursor-grab active:cursor-grabbing'
      } ${isMinimized ? 'min-h-[100px]' : 'min-h-full'} ${
        isMaximized ? 'md:col-span-2 md:row-span-2' : ''
      } ${className}`}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDoubleClick={handleDoubleClick}
    >
      {isMinimized && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <i
            className={`fas ${getCardIcon(
              title
            )} text-[#52babb]/[0.02] text-[120px]`}
          ></i>
        </div>
      )}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start select-none">
          <div className="flex-1 mr-3">
            <h2
              className={`text-lg ${textColor} font-bold tracking-tight truncate transition-colors`}
            >
              {title}
            </h2>
            <p
              className={`${subtitleColor} text-sm font-medium mt-1 truncate transition-colors`}
            >
              {subtitle}
            </p>
          </div>
          <button
            onClick={handleStateToggle}
            className="text-[#52babb]/70 hover:text-[#52babb] transition-colors p-1.5 rounded-lg hover:bg-[#52babb]/10"
            aria-label="Toggle card state"
          >
            <i
              className={`fas fa-${isMinimized ? 'plus' : 'minus'} text-base`}
            ></i>
          </button>
        </div>

        {!isMinimized && (
          <div className="mt-6 flex flex-col flex-1 card-content">
            <p
              className={`${descriptionColor} text-base sm:text-lg leading-relaxed transition-colors`}
            >
              {children}
            </p>
            {detailedContent && !isMaximized && (
              <button
                onClick={handleReadMore}
                className={`inline-flex items-center text-[#52babb] ${readMoreHoverColor} transition-colors text-base sm:text-lg group mt-6`}
              >
                Read More
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </button>
            )}
            {detailedContent && isMaximized && (
              <>
                <div className="mt-8 grid md:grid-cols-2 gap-8 card-detailed-content">
                  <div className="space-y-6">{detailedContent.leftColumn}</div>
                  <div className="space-y-6">{detailedContent.rightColumn}</div>
                </div>

                {/* Contact button with translucent design */}
                <div className="mt-8 pt-4 border-t border-[#52babb]/10 flex justify-end">
                  <Link
                    to="/contact"
                    className="backdrop-blur-sm bg-[#52babb]/30 border border-[#52babb]/20 hover:bg-[#52babb]/50 text-white py-2.5 px-5 rounded-lg transition-all duration-300 flex items-center gap-3 shadow-md hover:shadow-lg group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fas fa-envelope opacity-80 group-hover:opacity-100 transition-opacity"></i>
                    <span className="font-medium tracking-wide">
                      Contact Us
                    </span>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div
        className={`absolute inset-0 ${hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      ></div>
    </div>
  )
}

const getCardIcon = (title: string): string => {
  switch (title) {
    case 'Full Stack Solutions':
      return 'fa-layer-group'
    case 'Modern UI Design':
      return 'fa-palette'
    case 'Rich Interactions':
      return 'fa-wand-magic-sparkles'
    case 'Cloud & DevOps':
      return 'fa-cloud'
    default:
      return 'fa-code'
  }
}

export default Card
