'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Post {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

interface RecentPostResponse {
  slug: string
  title: string
  publishDate: string
}

interface ApiResponse {
  recentPosts: RecentPostResponse[]
  categories: Record<string, number>
}

export default function BlogSidebar() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/recent-posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = (await response.json()) as ApiResponse
        if (data && data.recentPosts) {
          // Format the posts for display
          const formattedPosts = data.recentPosts.map((post) => ({
            slug: post.slug,
            title: post.title,
            publishDate: post.publishDate,
            author: 'Compiled with assistance from AI',
            readingTime: '5 min read', // Default since we don't have this in the API response
            featuredImage: '/images/blog/default-post.jpg', // Default image
            tags: []
          }))
          setRecentPosts(formattedPosts)
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        // Fallback to empty array on error
        setRecentPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <aside className='space-y-10'>
        <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700'>
            Recent Posts
          </h2>
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className='space-y-10'>
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700'>
          Recent Posts
        </h2>
        {recentPosts.length > 0 ? (
          <ul className='space-y-5'>
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className='group block'>
                  <h3 className='text-base font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors'>
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.publishDate}
                    className='text-sm text-gray-500 dark:text-gray-400'
                  >
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            No recent posts found.
          </p>
        )}
      </div>
    </aside>
  )
}
