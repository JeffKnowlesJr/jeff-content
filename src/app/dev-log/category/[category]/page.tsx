import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DevLogEntryCard } from '@/components/DevLogEntryCard'

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

  return hardcodedEntries
}

export async function generateMetadata({
  params
}: {
  params: { category: string }
}): Promise<Metadata> {
  const category = params.category
  const categoryInfo = categories.find((c) => c.id === category)

  if (!categoryInfo) {
    return {
      title: 'Category Not Found | Jeff Knowles Jr',
      description: 'The requested development log category could not be found.'
    }
  }

  return {
    title: `${categoryInfo.name} | Development Log | Jeff Knowles Jr`,
    description: categoryInfo.description,
    openGraph: {
      title: `${categoryInfo.name} | Development Log | Jeff Knowles Jr`,
      description: categoryInfo.description,
      type: 'website'
    }
  }
}

export default async function CategoryPage({
  params
}: {
  params: { category: string }
}) {
  const category = params.category
  const entries = await getDevLogEntries()

  // Find category info
  const categoryInfo = categories.find((c) => c.id === category)

  // If category not found, show 404
  if (!categoryInfo) {
    notFound()
  }

  // Filter entries for the category
  const categoryEntries = entries.filter((entry) => entry.category === category)

  // Sort entries by date
  const sortedEntries = categoryEntries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-8'>
          <Link
            href='/dev-log'
            className='text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light'
          >
            ← Back to Development Log
          </Link>
        </div>

        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          {categoryInfo.name}
        </h1>

        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
          {categoryInfo.description}
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {sortedEntries.map((entry) => (
            <DevLogEntryCard
              key={entry.id}
              id={entry.id}
              title={entry.title}
              date={entry.date}
              summary={entry.summary}
              tags={entry.tags}
              slug={entry.slug}
              category={entry.category}
            />
          ))}
        </div>

        {sortedEntries.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-600 dark:text-gray-400'>
              No entries found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
