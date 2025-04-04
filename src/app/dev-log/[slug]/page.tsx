import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Define the DevLogEntry interface
interface DevLogEntry {
  id: string
  title: string
  date: string
  content: string
  tags: string[]
  slug: string
}

interface PageProps {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

// This function will be replaced with actual data fetching
// No placeholder content is used
async function getDevLogEntry(slug: string): Promise<DevLogEntry | null> {
  // In the future, this will fetch from a database or CMS
  // For now, we'll just log the requested slug
  console.log(`Requested dev log entry with slug: ${slug}`)
  return null
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const entry = await getDevLogEntry(params.slug)

  if (!entry) {
    return {
      title: 'Entry Not Found',
      description: 'The requested development log entry could not be found.'
    }
  }

  return {
    title: entry.title,
    description: `Development log entry: ${entry.title}`,
    openGraph: {
      title: entry.title,
      description: `Development log entry: ${entry.title}`,
      type: 'article',
      publishedTime: entry.date
    }
  }
}

export default async function DevLogEntryPage({ params }: PageProps) {
  const entry = await getDevLogEntry(params.slug)

  if (!entry) {
    notFound()
  }

  const codeBlock = ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean
    className?: string
    children?: React.ReactNode
  }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className='relative group'>
        <pre className={`${className} overflow-x-auto`}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <Link
          href='/dev-log'
          className='inline-flex items-center text-primary dark:text-primary-light hover:underline mb-8'
        >
          <svg
            className='mr-2 w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Development Log
        </Link>

        <article className='prose dark:prose-invert max-w-none'>
          <header className='mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              {entry.title}
            </h1>
            <div className='flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300'>
              <time dateTime={entry.date}>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div className='flex flex-wrap gap-2'>
                {entry.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <div className='markdown-content'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: codeBlock
              }}
            >
              {entry.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
