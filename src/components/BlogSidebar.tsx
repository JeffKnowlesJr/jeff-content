'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  publishDate: string
}

// This will be replaced with actual data fetching
async function getRecentBlogPosts(): Promise<BlogPost[]> {
  // Simulated data - replace with actual API call
  return [
    {
      id: '1',
      title: 'Building Modern Web Applications with Next.js',
      slug: 'building-modern-web-applications',
      publishDate: '2023-12-15'
    },
    {
      id: '2',
      title: 'Cloud Architecture Best Practices',
      slug: 'cloud-architecture-best-practices',
      publishDate: '2023-11-20'
    },
    {
      id: '3',
      title: 'TypeScript for React Developers',
      slug: 'typescript-for-react-developers',
      publishDate: '2023-10-05'
    }
  ]
}

export function BlogSidebar() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getRecentBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching recent blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className='card p-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Recent Blog Posts
        </h2>
        <div className='animate-pulse space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='card p-6'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
        Recent Blog Posts
      </h2>
      <ul className='space-y-3'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className='block text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors'
            >
              {post.title}
            </Link>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {new Date(post.publishDate).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
      <div className='mt-4'>
        <Link
          href='/blog'
          className='text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors'
        >
          View all posts →
        </Link>
      </div>
      <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <Link
          href='/projects'
          className='text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors flex items-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
            />
          </svg>
          Project List
        </Link>
      </div>
    </div>
  )
}
