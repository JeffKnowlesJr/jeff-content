import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

// Function to get a specific dev log entry from the filesystem
async function getDevLogEntry(slug: string): Promise<DevLogEntry | null> {
  console.log(`Requested dev log entry with slug: ${slug}`)

  try {
    // Check if there's a file in the content/dev-log directory
    const filePath = path.join(
      process.cwd(),
      'content',
      'dev-log',
      `${slug}.md`
    )

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Dev log file not found: ${filePath}`)
      return getHardcodedEntry(slug)
    }

    // Read and parse the file
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id: slug,
      title: data.title || 'Untitled Entry',
      date: data.datePublished || new Date().toISOString().split('T')[0],
      content: content || '',
      tags: data.tags || [],
      slug: data.slug || slug
    }
  } catch (error) {
    console.error(`Error reading dev log entry: ${error}`)
    // Try to get a hardcoded entry as fallback
    return getHardcodedEntry(slug)
  }
}

// Fallback to get hardcoded entries that might not be in files yet
function getHardcodedEntry(slug: string): DevLogEntry | null {
  // Define hardcoded content for specific entries
  const entries: Record<string, DevLogEntry> = {
    'seo-metadata-implementation': {
      id: 'seo-metadata-implementation',
      title:
        'SEO Metadata Implementation: OpenGraph, Twitter Cards, and Canonical URLs',
      date: '2024-04-16',
      content:
        '# SEO Metadata Implementation\n\nThis entry details the implementation of comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.',
      tags: [
        'SEO',
        'Next.js',
        'OpenGraph',
        'Twitter Cards',
        'Metadata API',
        'Structured Data'
      ],
      slug: 'seo-metadata-implementation'
    },
    'responsive-ui-gradient-redesign': {
      id: 'responsive-ui-gradient-redesign',
      title: 'Responsive UI and Gradient Design System',
      date: '2024-04-04',
      content:
        '# Responsive UI and Gradient Design System\n\nThis entry covers the implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.',
      tags: [
        'UI/UX',
        'Responsive Design',
        'CSS',
        'Tailwind',
        'Mobile Optimization'
      ],
      slug: 'responsive-ui-gradient-redesign'
    },
    'initial-seo-implementation': {
      id: 'seo-implementation',
      title: 'Initial SEO Implementation',
      date: '2024-03-20',
      content:
        '# Initial SEO Implementation\n\nThis entry provides a comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
      tags: ['SEO', 'Next.js', 'Performance', 'Structured Data'],
      slug: 'initial-seo-implementation'
    }
  }

  return entries[slug] || null
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  // Safely handle params with Next.js 15
  const slug = String(params.slug)
  const entry = await getDevLogEntry(slug)

  if (!entry) {
    return {
      title: 'Development Log Entry Not Found',
      description: 'The requested development log entry could not be found.'
    }
  }

  return {
    title: `${entry.title} | Jeff Knowles Jr`,
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
  // Safely handle params with Next.js 15
  const slug = String(params.slug)
  const entry = await getDevLogEntry(slug)

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
