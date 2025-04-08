'use client'

import React, { useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '../../services/blogService'
import { BlogPost } from '../../types/blog'
import Link from 'next/link'

interface BlogSidebarProps {
  onLinkClick?: () => void
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ onLinkClick }) => {
  const { theme } = useTheme()
  const { isLoading, error, data } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogService.listPosts()
  })

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800'
  const textColorDimmer = theme === 'dark' ? 'text-white/70' : 'text-gray-500'

  // Force theme update when theme changes
  useEffect(() => {
    const element = document.documentElement
    if (theme === 'dark') {
      element.classList.remove('light')
      element.classList.add('dark')
    } else {
      element.classList.remove('dark')
      element.classList.add('light')
    }
  }, [theme])

  const getIconForPost = (tags: (string | null)[]) => {
    const validTags = tags.filter((tag): tag is string => tag !== null)
    if (validTags.includes('react')) return 'fab fa-react text-[#61DAFB]'
    if (validTags.includes('aws')) return 'fab fa-aws text-[#FF9900]'
    if (validTags.includes('image')) return 'fas fa-image text-[#4CAF50]'
    return 'fas fa-blog text-[#52babb]'
  }

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4'></div>
        <div className='space-y-2'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-8 bg-gray-200 dark:bg-gray-700 rounded'
            ></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h3
          className={`text-lg font-bold ${textColor} mb-4 tracking-tight transition-colors duration-300`}
        >
          Blog Posts
        </h3>
        <div className='text-sm text-red-500 dark:text-red-400'>
          Error:{' '}
          {error instanceof Error ? error.message : 'Failed to load posts'}
        </div>
      </div>
    )
  }

  const posts =
    data?.items
      ?.filter(
        (post): post is BlogPost => post !== null && post.status === 'published'
      )
      .sort((a: BlogPost, b: BlogPost) => a.title.localeCompare(b.title)) || []

  if (posts.length === 0) {
    return (
      <div>
        <h3
          className={`text-lg font-bold ${textColor} mb-4 tracking-tight transition-colors duration-300`}
        >
          Blog Posts
        </h3>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          No blog posts found
        </div>
      </div>
    )
  }

  return (
    <div className='transition-colors duration-300'>
      <h3
        className={`text-lg font-bold ${textColor} mb-4 tracking-tight transition-colors duration-300`}
      >
        Blog Posts
      </h3>
      <div className='space-y-2'>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            onClick={onLinkClick}
            className={`block text-sm ${textColorDimmer} hover:text-[#52babb] transition-colors min-h-[32px] flex items-center group`}
          >
            <i
              className={`${getIconForPost(
                post.tags
              )} mr-2 group-hover:text-[#52babb] transition-colors`}
            ></i>
            <span className='font-medium'>{post.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BlogSidebar
