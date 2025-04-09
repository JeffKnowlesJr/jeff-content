import React from 'react'
import Link from 'next/link'

interface DevLogCategoryCardProps {
  id: string
  name: string
  description: string
  entryCount: number
  year: string
}

// Category color mapping
const categoryColors = {
  architecture: {
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-100 dark:border-blue-800/30',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  },
  frontend: {
    bg: 'bg-purple-50/50 dark:bg-purple-900/10',
    border: 'border-purple-100 dark:border-purple-800/30',
    text: 'text-purple-600 dark:text-purple-400',
    badge:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  },
  backend: {
    bg: 'bg-green-50/50 dark:bg-green-900/10',
    border: 'border-green-100 dark:border-green-800/30',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  },
  devops: {
    bg: 'bg-orange-50/50 dark:bg-orange-900/10',
    border: 'border-orange-100 dark:border-orange-800/30',
    text: 'text-orange-600 dark:text-orange-400',
    badge:
      'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  },
  ai: {
    bg: 'bg-pink-50/50 dark:bg-pink-900/10',
    border: 'border-pink-100 dark:border-pink-800/30',
    text: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
  },
  seo: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-900/10',
    border: 'border-yellow-100 dark:border-yellow-800/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    badge:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  },
  uncategorized: {
    bg: 'bg-gray-50/50 dark:bg-gray-900/10',
    border: 'border-gray-100 dark:border-gray-800/30',
    text: 'text-gray-600 dark:text-gray-400',
    badge: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
  }
}

export function DevLogCategoryCard({
  id,
  name,
  description,
  entryCount,
  year
}: DevLogCategoryCardProps) {
  const colors =
    categoryColors[id as keyof typeof categoryColors] ||
    categoryColors.uncategorized

  return (
    <div
      className={`${colors.bg} ${colors.border} rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow`}
    >
      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className={`text-lg font-semibold ${colors.text}`}>{name}</h3>
          <span className={`px-2 py-1 text-xs ${colors.badge} rounded-full`}>
            {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
          {description}
        </p>
        <Link
          href={`/dev-log/category/${id}?year=${year}`}
          className={`text-sm font-medium ${colors.text} hover:underline`}
        >
          View all entries →
        </Link>
      </div>
    </div>
  )
}
