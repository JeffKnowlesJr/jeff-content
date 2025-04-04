'use client'

import React from 'react'

interface ExternalLinkProps {
  href: string
  className?: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function ExternalLink({
  href,
  className,
  children,
  icon
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={className}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        window.open(href, '_blank', 'noopener,noreferrer')
      }}
    >
      {icon && <span className='mr-2'>{icon}</span>}
      {children}
    </a>
  )
}
