import React from 'react'
import { Link } from 'react-router-dom'

const Navigation: React.FC = () => {
  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' }
  ]

  return (
    <div className="hidden md:flex space-x-8">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Navigation
