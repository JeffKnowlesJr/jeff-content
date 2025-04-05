import React from 'react'

interface ProjectLayoutProps {
  children: React.ReactNode
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen w-full'>
      {/* Main Content */}
      <div className='pt-4 sm:pt-6 md:pt-8'>
        <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg shadow-sm'>
          <div className='w-full overflow-x-hidden py-6'>{children}</div>
        </div>
      </div>
    </div>
  )
}
