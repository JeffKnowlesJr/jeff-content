import React from 'react'
import Link from 'next/link'

interface BlogLayoutProps {
  children: React.ReactNode
  title: string
  date?: string
  tags?: string[]
  category?: string
  backLink?: {
    href: string
    text: string
  }
}

export function BlogLayout({
  children,
  title,
  date,
  tags = [],
  category,
  backLink
}: BlogLayoutProps) {
  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {backLink && (
          <div className='mb-8'>
            <Link
              href={backLink.href}
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light'
            >
              ← {backLink.text}
            </Link>
          </div>
        )}

        <article className='prose dark:prose-invert lg:prose-lg max-w-none'>
          <header className='mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              {title}
            </h1>

            <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
              {date && (
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}

              {category && (
                <span className='inline-flex items-center'>
                  <span className='mr-2'>•</span>
                  <Link
                    href={`/dev-log/category/${category}`}
                    className='hover:text-primary dark:hover:text-primary-light'
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                </span>
              )}
            </div>

            {tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-4'>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className='mt-8'>{children}</div>
        </article>
      </div>
    </div>
  )
}
