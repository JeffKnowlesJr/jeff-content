import React from 'react'

interface ContentWithSidebarsProps {
  children: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
}

/**
 * ContentWithSidebars - A layout utility component for pages with sidebars
 *
 * @param children - The main content
 * @param leftSidebar - Optional left sidebar component
 * @param rightSidebar - Optional right sidebar component
 */
export const ContentWithSidebars: React.FC<ContentWithSidebarsProps> = ({
  children,
  leftSidebar,
  rightSidebar
}) => {
  return (
    <div className='flex flex-col lg:flex-row gap-8'>
      {/* Left Sidebar */}
      {leftSidebar}

      {/* Main Content */}
      <main className='flex-1'>{children}</main>

      {/* Right Sidebar */}
      {rightSidebar}
    </div>
  )
}
