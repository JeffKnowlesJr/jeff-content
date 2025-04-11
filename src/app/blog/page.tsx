import { Metadata } from 'next'
import { BlogPost, getContentList } from '@/utils/content-loader'
import BlogCard from '@/components/blog/BlogCard'
import BlogLayout from '@/components/blog/BlogLayout'
import { generateBlogIndexMetadata } from '@/utils/metadata'

// Generate metadata
export const metadata: Metadata = generateBlogIndexMetadata()

// Get blog posts from our content system
async function getBlogPosts(): Promise<{
  posts: BlogPost[]
  error: string | null
}> {
  // In production, this should use GraphQL to fetch from DynamoDB
  // For now, we'll just show a notice in production
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️ Production environment detected. Blog content should be fetched from DynamoDB via GraphQL.'
    )
    return {
      posts: [],
      error:
        'Content not available. In production, content must be fetched from DynamoDB via GraphQL.'
    }
  }

  try {
    // Development only: Load posts from the content directory
    console.log('Development mode: Loading posts from content directory')
    const posts = await getContentList<BlogPost>('blog')

    // If we have content, return it
    if (posts && posts.length > 0) {
      // Sort posts by publication date (most recent first)
      return {
        posts: posts.sort((a, b) => {
          const dateA = new Date(
            a.datePublished || a.publishDate || ''
          ).getTime()
          const dateB = new Date(
            b.datePublished || b.publishDate || ''
          ).getTime()
          return dateB - dateA
        }),
        error: null
      }
    }

    console.log('No blog posts found in content directory')
    return {
      posts: [],
      error:
        'No blog posts found in content directory. In development, add markdown files to the content/blog directory.'
    }
  } catch (error) {
    console.error('Error loading blog posts from content:', error)
    return {
      posts: [],
      error:
        error instanceof Error
          ? `Error loading blog posts: ${error.message}`
          : 'Unknown error loading blog posts'
    }
  }
}

export default async function BlogPage() {
  const { posts, error } = await getBlogPosts()
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <BlogLayout>
      <div className='w-full'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
          Blog Posts
        </h1>
        <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-4xl'>
          Explore articles covering web development, cloud architecture, and
          technical implementation details from real-world projects.
        </p>

        {isProduction && (
          <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-8'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-blue-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-blue-700'>
                  Production Mode: Content should be fetched from DynamoDB via
                  GraphQL.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-5 w-5 text-yellow-400'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {posts.length === 0 && !error ? (
          <div className='text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
            <h3 className='mt-2 text-lg font-medium text-gray-900 dark:text-white'>
              No blog posts available
            </h3>
            <p className='mt-1 text-gray-500 dark:text-gray-400'>
              {isProduction
                ? 'Blog posts should be loaded from DynamoDB via GraphQL in production.'
                : 'Add markdown files to content/blog directory in development.'}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                id={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                image={
                  post.featuredImage ||
                  post.image ||
                  '/images/blog/default-post.jpg'
                }
                author={post.author}
                publishDate={post.datePublished || post.publishDate || ''}
                readingTime={post.readingTime}
                tags={post.tags}
                slug={post.slug}
              />
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  )
}
