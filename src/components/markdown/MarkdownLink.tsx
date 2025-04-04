'use client'

import React from 'react'

interface MarkdownLinkProps {
  href?: string
  children: React.ReactNode
}

export default function MarkdownLink({ href, children }: MarkdownLinkProps) {
  return (
    <a
      href={href}
      className='text-primary dark:text-primary-light hover:underline'
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </a>
  )
}
