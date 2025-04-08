import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
  status?: string
}

// This function will load dev logs from both the file system and hardcoded entries
async function getDevLogEntries(): Promise<DevLogEntry[]> {
  // Original hardcoded entries to ensure we don't lose anything
  const hardcodedEntries: DevLogEntry[] = [
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
      slug: 'seo-metadata-implementation',
      status: 'published'
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
      slug: 'responsive-ui-gradient-redesign',
      status: 'published'
    },
    {
      id: 'seo-implementation',
      title: 'Initial SEO Implementation',
      date: '2024-03-20',
      summary:
        'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
      tags: ['SEO', 'Next.js', 'Performance', 'Structured Data'],
      slug: 'initial-seo-implementation',
      status: 'published'
    }
  ]

  try {
    // Dynamic entries from file system
    const devLogDir = path.join(process.cwd(), 'content', 'dev-log')

    // Check if directory exists
    if (!fs.existsSync(devLogDir)) {
      console.warn(`Dev log directory not found: ${devLogDir}`)
      return hardcodedEntries // Fall back to hardcoded entries
    }

    const files = fs.readdirSync(devLogDir)
    const markdownFiles = files.filter((file) => file.endsWith('.md'))

    // Map files to entries
    const fileEntries = markdownFiles
      .map((fileName) => {
        const filePath = path.join(devLogDir, fileName)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(fileContents)
        const slug = fileName.replace('.md', '')

        // Check if we already have this entry in hardcoded list
        const existingEntry = hardcodedEntries.find(
          (entry) => entry.slug === (data.slug || slug) || entry.id === slug
        )

        // If it exists in hardcoded entries, skip it
        if (existingEntry) {
          return null
        }

        return {
          id: slug,
          title: data.title || 'Untitled Entry',
          date: data.datePublished || new Date().toISOString().split('T')[0],
          summary: data.excerpt || '',
          tags: data.tags || [],
          slug: data.slug || slug,
          status: data.status || 'draft'
        } as DevLogEntry
      })
      .filter(Boolean) as DevLogEntry[] // Remove nulls

    // Combine hardcoded and file entries
    const allEntries = [...hardcodedEntries, ...fileEntries]

    // Filter published entries and sort by date
    return allEntries
      .filter((entry) => entry.status === 'published')
      .sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  } catch (error) {
    console.error(`Error reading dev log entries: ${error}`)
    return hardcodedEntries // Fall back to hardcoded entries on error
  }
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
                  <time
                    dateTime={entry.date}
                    className='block text-sm text-gray-500 dark:text-gray-400 mb-2'
                  >
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    <Link
                      href={`/dev-log/${entry.slug}`}
                      className='hover:text-primary dark:hover:text-primary-light transition-colors'
                    >
                      {entry.title}
                    </Link>
                  </h2>
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
