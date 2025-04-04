import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Development Log | Jeff Knowles Jr',
  description:
    'A chronological log of development progress, challenges, and solutions for the JKJR Portfolio & Blog website.',
  openGraph: {
    title: 'Development Log | Jeff Knowles Jr',
    description:
      'A chronological log of development progress, challenges, and solutions for the JKJR Portfolio & Blog website.',
    type: 'website'
  }
}

// Define the DevLogEntry interface
interface DevLogEntry {
  id: string
  title: string
  date: string
  summary: string
  tags: string[]
  slug: string
}

// This function will be replaced with actual data fetching
async function getDevLogEntries(): Promise<DevLogEntry[]> {
  return [
    {
      id: 'seo-metadata-implementation',
      title:
        'SEO Metadata Implementation: OpenGraph, Twitter Cards, and Canonical URLs',
      date: '2024-04-16',
      summary:
        'A detailed breakdown of implementing comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.',
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
    {
      id: 'responsive-ui-gradient-redesign',
      title: 'Responsive UI and Gradient Design System',
      date: '2024-04-04',
      summary:
        'Implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.',
      tags: [
        'UI/UX',
        'Responsive Design',
        'CSS',
        'Tailwind',
        'Mobile Optimization'
      ],
      slug: 'responsive-ui-gradient-redesign'
    },
    {
      id: 'seo-implementation',
      title: 'Initial SEO Implementation',
      date: '2024-03-20',
      summary:
        'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
      tags: ['SEO', 'Next.js', 'Performance', 'Structured Data'],
      slug: 'initial-seo-implementation'
    }
  ]
}

export default async function DevLogPage() {
  const entries = await getDevLogEntries()

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-8'>
          Development Log
        </h1>

        {entries.length === 0 ? (
          <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center'>
            <p className='text-gray-600 dark:text-gray-300 mb-4'>
              No development log entries available yet.
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Check back later for updates on the development progress.
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            {entries.map((entry) => (
              <article
                key={entry.id}
                className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden'
              >
                <div className='p-6'>
                  <div className='flex justify-between items-start mb-4'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      <Link
                        href={`/dev-log/${entry.slug}`}
                        className='hover:text-primary dark:hover:text-primary-light transition-colors'
                      >
                        {entry.title}
                      </Link>
                    </h2>
                    <time
                      dateTime={entry.date}
                      className='text-sm text-gray-500 dark:text-gray-400'
                    >
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <p className='text-gray-600 dark:text-gray-300 mb-4'>
                    {entry.summary}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
