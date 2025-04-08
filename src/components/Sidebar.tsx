'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface RecentPost {
  slug: string
  title: string
  publishDate: string
}

export function Sidebar() {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [categories, setCategories] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        // Fetch blog posts using API route
        const response = await fetch('/api/blog/recent-posts')
        if (!response.ok) {
          throw new Error('Failed to fetch recent posts')
        }

        const data = await response.json()

        setRecentPosts(data.recentPosts || [])
        setCategories(data.categories || {})
        setLoading(false)
      } catch (error) {
        console.error('Error fetching recent posts:', error)

        // Fallback data with marketing focus
        setRecentPosts([
          {
            slug: 'digital-marketing-strategy-2023',
            title: 'Digital Marketing Strategy Guide for 2023',
            publishDate: '2023-12-15'
          },
          {
            slug: 'content-marketing-roi',
            title: 'Measuring Content Marketing ROI: A Practical Approach',
            publishDate: '2023-11-20'
          },
          {
            slug: 'seo-techniques-for-marketers',
            title: 'Advanced SEO Techniques Every Marketer Should Know',
            publishDate: '2023-10-05'
          }
        ])

        setCategories({
          'Content Marketing': 8,
          SEO: 6,
          'Social Media': 5,
          'Email Marketing': 4,
          Analytics: 7,
          'Marketing Automation': 3
        })

        setLoading(false)
      }
    }

    fetchRecentPosts()
  }, [])

  return (
    <aside className='w-full'>
      {/* About Me - Marketing Expert */}
      <div className='card p-6 mb-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          About Me
        </h2>
        <div className='mb-4'>
          <h3 className='font-medium text-gray-900 dark:text-white text-xl mb-2'>
            Jeff Knowles Jr
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-300'>
            <span className='whitespace-nowrap'>Analytics Engineer</span>{' '}
            <span className='whitespace-nowrap'>
              <span className='text-gray-600 dark:text-gray-300'>&</span>{' '}
              <span className='text-primary dark:text-primary-light'>
                Cloud Architect
              </span>
            </span>
          </p>
        </div>
        <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
          Helping businesses grow through data-driven marketing strategies, SEO
          optimization, and conversion-focused content.
        </p>
        <Link
          href='/contact'
          className='text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors text-sm'
        >
          Book a strategy call →
        </Link>
      </div>

      {/* Recent Blog Posts */}
      <div className='card p-6 mb-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Marketing Insights
        </h2>
        {loading ? (
          <div className='animate-pulse space-y-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'
              ></div>
            ))}
          </div>
        ) : (
          <ul className='space-y-3'>
            {recentPosts.map((post, index) => (
              <li key={index}>
                <Link
                  href={`/blog/${post.slug}`}
                  className='block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors text-sm'
                >
                  {post.title}
                </Link>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {new Date(post.publishDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className='mt-4'>
          <Link
            href='/blog'
            className='text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors text-sm'
          >
            View all insights →
          </Link>
        </div>
      </div>

      {/* Marketing Topics */}
      <div className='card p-6 mb-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Marketing Topics
        </h2>
        {loading ? (
          <div className='animate-pulse space-y-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'
              ></div>
            ))}
          </div>
        ) : (
          <ul className='space-y-2'>
            {Object.entries(categories).map(([category, count]) => (
              <li key={category}>
                <Link
                  href={`/blog/category/${category
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  className='flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors text-sm'
                >
                  <span>{category}</span>
                  <span className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 text-xs'>
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Social Links */}
      <div className='card p-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Follow Me
        </h2>
        <div className='flex space-x-4'>
          <a
            href='https://linkedin.com/in/jeffknowlesjr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-700 dark:text-gray-300 hover:text-[#0A66C2]'
            aria-label='LinkedIn'
          >
            <i className='fab fa-linkedin-in text-xl'></i>
          </a>
          <a
            href='https://twitter.com/jeffknowlesjr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-700 dark:text-gray-300 hover:text-[#1DA1F2]'
            aria-label='Twitter'
          >
            <i className='fab fa-twitter text-xl'></i>
          </a>
          <a
            href='https://github.com/jeffknowles'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            aria-label='GitHub'
          >
            <i className='fab fa-github text-xl'></i>
          </a>
          <a
            href='https://medium.com/@jeffknowlesjr'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-700 dark:text-gray-300 hover:text-[#00AB6C]'
            aria-label='Medium'
          >
            <i className='fab fa-medium-m text-xl'></i>
          </a>
        </div>
      </div>
    </aside>
  )
}
