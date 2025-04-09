import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DevLogCategoryCard } from '@/components/DevLogCategoryCard'
import { DevLogEntryCard } from '@/components/DevLogEntryCard'

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
  category?: string
}

// Define categories for organizing entries
const categories = [
  {
    id: 'architecture',
    name: 'Architecture & Infrastructure',
    description:
      'System design, architecture decisions, and infrastructure changes'
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    description:
      'UI/UX improvements, component development, and client-side features'
  },
  {
    id: 'backend',
    name: 'Backend & API',
    description: 'Server-side development, API integrations, and data handling'
  },
  {
    id: 'devops',
    name: 'DevOps & Deployment',
    description: 'CI/CD, deployment processes, and environment configurations'
  },
  {
    id: 'ai',
    name: 'AI & Automation',
    description: 'AI integration, automation tools, and development assistance'
  },
  {
    id: 'seo',
    name: 'SEO & Performance',
    description:
      'Search engine optimization, performance improvements, and analytics'
  }
]

// This function will load dev logs from both the file system and hardcoded entries
async function getDevLogEntries(): Promise<DevLogEntry[]> {
  // Original hardcoded entries to ensure we don't lose anything
  const hardcodedEntries: DevLogEntry[] = [
    {
      id: 'website-retooling-plan',
      title: 'Website Retooling: Hybrid Architecture Implementation',
      date: '2025-04-09',
      summary:
        'A comprehensive plan for transitioning from a single React SPA to a hybrid architecture using Next.js for content-heavy pages while maintaining interactive features in the existing React application.',
      tags: ['Architecture', 'Next.js', 'React', 'AWS', 'Migration'],
      slug: 'website-retooling-plan',
      status: 'published',
      category: 'architecture'
    },
    {
      id: 'appsync-contact-form-debugging',
      title: 'AppSync Contact Form Integration Debugging',
      date: '2025-04-09',
      summary:
        'Debugging process and resolution for AppSync contact form integration issues, including schema configuration and API key authentication.',
      tags: ['AppSync', 'GraphQL', 'AWS', 'Debugging', 'Contact Form'],
      slug: 'appsync-contact-form-debugging',
      status: 'published',
      category: 'backend'
    },
    {
      id: 'seo-metadata-implementation',
      title:
        'SEO Metadata Implementation: OpenGraph, Twitter Cards, and Canonical URLs',
      date: '2025-04-16',
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
      status: 'published',
      category: 'seo'
    },
    {
      id: 'responsive-ui-gradient-redesign',
      title: 'Responsive UI and Gradient Design System',
      date: '2025-04-04',
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
      status: 'published',
      category: 'frontend'
    },
    {
      id: 'seo-implementation',
      title: 'Initial SEO Implementation',
      date: '2025-03-20',
      summary:
        'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
      tags: ['SEO', 'Next.js', 'Performance', 'Structured Data'],
      slug: 'initial-seo-implementation',
      status: 'published',
      category: 'seo'
    },
    {
      id: 'nextjs-15-dynamic-route-params',
      title: 'Next.js 15 Dynamic Route Params Type Issue',
      date: '2025-04-09',
      summary:
        'Troubleshooting and resolving TypeScript errors with dynamic route parameters in Next.js 15 App Router, including a temporary workaround for deployment.',
      tags: [
        'Next.js',
        'TypeScript',
        'App Router',
        'Dynamic Routes',
        'Troubleshooting'
      ],
      slug: 'nextjs-15-dynamic-route-params',
      status: 'published',
      category: 'frontend'
    },
    {
      id: 'ai-coding-assistant-challenges',
      title: 'AI Coding Assistant Challenges and Best Practices',
      date: '2025-04-09',
      summary:
        'Experiences and lessons learned from using AI coding assistants in our development workflow, including prompt engineering, code review, and integration strategies.',
      tags: [
        'AI',
        'Development Tools',
        'Productivity',
        'Best Practices',
        'Prompt Engineering'
      ],
      slug: 'ai-coding-assistant-challenges',
      status: 'published',
      category: 'ai'
    },
    {
      id: 'ai-nextjs-integration',
      title: 'Integrating AI Assistants with Next.js Development',
      date: '2025-04-09',
      summary:
        'Strategies and techniques for effectively using AI coding assistants with Next.js, including App Router, server components, and TypeScript integration.',
      tags: [
        'AI',
        'Next.js',
        'App Router',
        'Server Components',
        'TypeScript',
        'Integration'
      ],
      slug: 'ai-nextjs-integration',
      status: 'published',
      category: 'ai'
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
          status: data.status || 'draft',
          category: data.category || 'uncategorized'
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

// Group entries by year and category
function groupEntriesByYearAndCategory(entries: DevLogEntry[]) {
  const groupedEntries: Record<string, Record<string, DevLogEntry[]>> = {}

  entries.forEach((entry) => {
    const year = new Date(entry.date).getFullYear().toString()
    const category = entry.category || 'uncategorized'

    if (!groupedEntries[year]) {
      groupedEntries[year] = {}
    }

    if (!groupedEntries[year][category]) {
      groupedEntries[year][category] = []
    }

    groupedEntries[year][category].push(entry)
  })

  return groupedEntries
}

export default async function DevLogPage() {
  const entries = await getDevLogEntries()
  const groupedEntries = groupEntriesByYearAndCategory(entries)

  // Get all years and sort in descending order
  const years = Object.keys(groupedEntries).sort(
    (a, b) => parseInt(b) - parseInt(a)
  )

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
          <div className='space-y-12'>
            {years.map((year) => (
              <div key={year} className='space-y-6'>
                <h2 className='text-3xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2'>
                  {year}
                </h2>

                {/* Categories Section */}
                <div className='mb-8'>
                  <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>
                    Categories
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categories.map((category) => {
                      const categoryEntries =
                        groupedEntries[year][category.id] || []
                      const entryCount = categoryEntries.length

                      if (entryCount === 0) return null

                      return (
                        <DevLogCategoryCard
                          key={`${year}-${category.id}`}
                          id={category.id}
                          name={category.name}
                          description={category.description}
                          entryCount={entryCount}
                          year={year}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Recent Entries Section */}
                <div>
                  <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>
                    Recent Entries
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {Object.values(groupedEntries[year])
                      .flat()
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 4)
                      .map((entry) => (
                        <DevLogEntryCard
                          key={entry.id}
                          id={entry.id}
                          title={entry.title}
                          date={entry.date}
                          summary={entry.summary}
                          tags={entry.tags}
                          slug={entry.slug}
                        />
                      ))}
                  </div>

                  {/* View All Link */}
                  <div className='mt-4 text-right'>
                    <Link
                      href={`/dev-log/year/${year}`}
                      className='text-sm font-medium text-primary dark:text-primary-light hover:underline'
                    >
                      View all entries from {year} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
