import React from 'react'

interface ProjectLayoutProps {
  children: React.ReactNode
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen w-full'>
      {/* Main Content */}
      <div className='pt-2 sm:pt-3 md:pt-4'>
        <div className='container mx-auto px-4'>
          <div className='max-w-full overflow-x-hidden'>{children}</div>
        </div>
      </div>
    </div>
  )
}
