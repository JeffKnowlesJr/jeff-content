import React from 'react'

interface BlogLayoutProps {
  children: React.ReactNode
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className='w-full'>
      {/* Main Content */}
      <div className='pt-1 sm:pt-2 md:pt-4'>
        <div className='max-w-full w-full sm:container sm:mx-auto sm:px-4 md:px-6 lg:px-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
