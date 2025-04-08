import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Map',
  description:
    'A comprehensive overview of all pages on the JKJR Portfolio & Blog website.'
}

interface SitemapSection {
  title: string
  links: {
    href: string
    label: string
    description?: string
  }[]
}

const sitemapData: SitemapSection[] = [
  {
    title: 'Main Pages',
    links: [
      {
        href: '/',
        label: 'Home',
        description: 'Welcome to JKJR Digital Development'
      },
      {
        href: '/projects',
        label: 'Projects',
        description: 'Showcase of development projects and case studies'
      },
      {
        href: '/contact',
        label: 'Contact',
        description: 'Get in touch for inquiries and collaborations'
      }
    ]
  },
  {
    title: 'Blog',
    links: [
      {
        href: '/blog',
        label: 'Blog Home',
        description: 'Articles, tutorials, and development insights'
      },
      {
        href: '/blog/search',
        label: 'Search',
        description: 'Search through blog posts'
      },
      {
        href: '/blog/tags',
        label: 'Tags',
        description: 'Browse posts by tags'
      },
      {
        href: '/blog/categories',
        label: 'Categories',
        description: 'Browse posts by categories'
      }
    ]
  },
  {
    title: 'Development Log',
    links: [
      {
        href: '/dev-log',
        label: 'Dev Log Home',
        description: 'Chronological log of development progress'
      }
    ]
  },
  {
    title: 'Resources',
    links: [
      {
        href: '/port-inc',
        label: 'Port Inc',
        description: 'Port Inc project details and documentation'
      },
      {
        href: '/docs',
        label: 'Documentation',
        description: 'Technical documentation and guides'
      }
    ]
  }
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Site Map
        </h1>

        <div className="space-y-12">
          {sitemapData.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {link.label}
                    </h3>
                    {link.description && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link
              href="/contact"
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
