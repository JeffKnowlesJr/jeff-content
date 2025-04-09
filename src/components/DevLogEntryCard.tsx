import React from 'react'
import Link from 'next/link'

interface DevLogEntryCardProps {
  id: string
  title: string
  date: string
  summary: string
  tags: string[]
  slug: string
  category?: string
}

// Category color mapping
const categoryColors = {
  architecture: {
    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
    border: 'border-blue-100 dark:border-blue-800/30',
    text: 'text-blue-600 dark:text-blue-400',
    tag: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
  },
  frontend: {
    bg: 'bg-purple-50/50 dark:bg-purple-900/10',
    border: 'border-purple-100 dark:border-purple-800/30',
    text: 'text-purple-600 dark:text-purple-400',
    tag: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  },
  backend: {
    bg: 'bg-green-50/50 dark:bg-green-900/10',
    border: 'border-green-100 dark:border-green-800/30',
    text: 'text-green-600 dark:text-green-400',
    tag: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  },
  devops: {
    bg: 'bg-orange-50/50 dark:bg-orange-900/10',
    border: 'border-orange-100 dark:border-orange-800/30',
    text: 'text-orange-600 dark:text-orange-400',
    tag: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  },
  ai: {
    bg: 'bg-pink-50/50 dark:bg-pink-900/10',
    border: 'border-pink-100 dark:border-pink-800/30',
    text: 'text-pink-600 dark:text-pink-400',
    tag: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
  },
  seo: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-900/10',
    border: 'border-yellow-100 dark:border-yellow-800/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    tag: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  },
  uncategorized: {
    bg: 'bg-gray-50/50 dark:bg-gray-900/10',
    border: 'border-gray-100 dark:border-gray-800/30',
    text: 'text-gray-600 dark:text-gray-400',
    tag: 'bg-gray-50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
  }
}

export function DevLogEntryCard({
  title,
  date,
  summary,
  tags,
  slug,
  category = 'uncategorized'
}: DevLogEntryCardProps) {
  const colors =
    categoryColors[category as keyof typeof categoryColors] ||
    categoryColors.uncategorized

  return (
    <article
      className={`${colors.bg} ${colors.border} rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow`}
    >
      <div className='p-4'>
        <time
          dateTime={date}
          className='block text-xs text-gray-500 dark:text-gray-400 mb-1'
        >
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </time>
        <h4 className={`text-lg font-medium ${colors.text} mb-2`}>
          <Link
            href={`/dev-log/${slug}`}
            className='hover:text-primary dark:hover:text-primary-light transition-colors'
          >
            {title}
          </Link>
        </h4>
        <p className='text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2'>
          {summary}
        </p>
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 text-xs ${colors.tag} rounded-full`}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className={`px-2 py-0.5 text-xs ${colors.tag} rounded-full`}>
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
