import React, { ReactNode } from 'react'

interface SimpleBadgeProps {
  children: ReactNode
  className?: string
}

/**
 * Simple Badge component to replace Relume UI Badge
 * This eliminates the dependency on Relume UI which might be causing the useLayoutEffect issues
 */
const SimpleBadge: React.FC<SimpleBadgeProps> = ({
  children,
  className = ''
}) => {
  return (
    <span className={`inline-flex items-center ${className}`}>{children}</span>
  )
}

export default SimpleBadge
