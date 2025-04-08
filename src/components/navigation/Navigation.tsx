'use client'

import React from 'react'
import Link from 'next/link'

const Navigation: React.FC = () => {
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' }
  ]

  return (
    <div className='hidden md:flex space-x-8'>
      {menuItems.map((item) => (
        <Link
          key={item.name}
          href={item.path}
          className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Navigation
