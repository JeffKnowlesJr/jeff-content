import React from 'react'

interface SimpleCardProps {
  children: React.ReactNode
  className?: string
}

export const SimpleCard: React.FC<SimpleCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md p-6 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {children}
    </div>
  )
}
