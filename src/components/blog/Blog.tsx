import React, { useEffect, useState } from 'react'
import { BlogPost } from '../../types/blog'
import { blogService } from '../../services/blogService'
import { BlogLayout } from '../../components copy/layout/BlogLayout'
import { normalizeImagePath, handleImageError } from '../../utils/imageUtils'

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log('🚀 Starting to load blog posts...')
        console.log('Environment:', {
          NODE_ENV: process.env.NODE_ENV,
          BASE_URL: import.meta.env.VITE_BASE_URL,
          IS_PROD: process.env.NODE_ENV === 'production'
        })
        const response = await blogService.listPosts()
        console.log('✅ Loaded posts:', {
          count: response.items.length,
          posts: response.items
        })
        setPosts(response.items)
      } catch (err) {
        console.error('❌ Error loading posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  if (loading) {
    return <div className='p-2'>Loading posts...</div>
  }

  if (error) {
    return <div className='p-2'>Error: {error}</div>
  }

  return (
    <BlogLayout>
      <div className='px-2 sm:px-0 w-full'>
        <h1 className='text-3xl font-bold mb-4 sm:mb-8'>Blog</h1>
        <div className='grid gap-3 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <div
              key={post.slug}
              className='relative bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg'
            >
              {post.featuredImage && (
                <div className='relative h-40 sm:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden'>
                  <img
                    src={normalizeImagePath(post.featuredImage)}
                    alt={post.title}
                    className='absolute inset-0 w-full h-full object-cover'
                    onLoad={() =>
                      console.log('✨ Post image loaded:', post.featuredImage)
                    }
                    onError={handleImageError}
                  />
                </div>
              )}
              <h2 className='text-xl font-semibold mb-2 break-words'>
                {post.title}
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                {post.publishedAt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}

export default Blog
