import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Development Log',
    default: 'Development Log | JKJR Portfolio & Blog'
  },
  description:
    'A chronological log of development progress, challenges, and solutions for the JKJR Portfolio & Blog website.',
  openGraph: {
    title: 'Development Log | JKJR Portfolio & Blog',
    description:
      'A chronological log of development progress, challenges, and solutions for the JKJR Portfolio & Blog website.',
    type: 'website'
  }
}

export default function DevLogLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
      </div>
    </div>
  )
}
