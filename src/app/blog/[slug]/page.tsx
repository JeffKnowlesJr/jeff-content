import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BlogPost, getContentBySlug } from '@/utils/content-loader'
import { generateBlogPostMetadata } from '@/utils/metadata'
import BlogLayout from '@/components/blog/BlogLayout'
import { fetchBlogPostBySlug } from '@/services/blogApi'

type Params = {
  slug: string
}

// Production warning component for incomplete integration
function ProductionNotice() {
  return (
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
          <p className='text-sm text-yellow-700'>
            This page is using production mode.
          </p>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for the blog post
export async function generateMetadata({
  params
}: {
  params: Params
}): Promise<Metadata> {
  // First await the params object itself before accessing its properties
  const resolvedParams = await params

  // In production, metadata should be generated from DynamoDB data
  if (process.env.NODE_ENV === 'production') {
    try {
      const post = await fetchBlogPostBySlug(resolvedParams.slug)

      if (!post) {
        return {
          title: 'Blog Post Not Found',
          description: 'The requested blog post could not be found.'
        }
      }

      return generateBlogPostMetadata(post)
    } catch (error) {
      console.error('Error fetching blog post metadata from DynamoDB:', error)
      return {
        title: 'Error Loading Blog Post',
        description: 'There was an error loading the blog post content.'
      }
    }
  }

  // Development mode - use local content
  const post = await getContentBySlug<BlogPost>('blog', resolvedParams.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return generateBlogPostMetadata(post)
}

// Define markdown component types
type ComponentProps = {
  children?: React.ReactNode
  [key: string]: unknown
}

// Blog post page component
export default async function BlogPostPage({ params }: { params: Params }) {
  // First await the params object itself before accessing its properties
  const resolvedParams = await params

  let post: BlogPost | null = null

  // In production, we fetch data from DynamoDB via GraphQL
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log(
        'Production mode: Fetching blog post from DynamoDB via GraphQL'
      )
      post = await fetchBlogPostBySlug(resolvedParams.slug)

      if (!post) {
        notFound()
      }
    } catch (error) {
      console.error('Error fetching blog post from DynamoDB:', error)
      throw new Error('Failed to load blog post content')
    }
  } else {
    // Development mode - continue with existing implementation
    console.log('Development mode: Loading blog post from content directory')
    post = await getContentBySlug<BlogPost>('blog', resolvedParams.slug)

    // If not found, show 404
    if (!post) {
      notFound()
    }
  }

  // Code block rendering for markdown
  const codeBlock = ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean
    className?: string
    children?: React.ReactNode
  }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className='relative group'>
        <pre className={`${className} overflow-x-auto p-4 rounded-lg`}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code className={`${className} px-1 py-0.5 rounded text-sm`} {...props}>
        {children}
      </code>
    )
  }

  return (
    <BlogLayout showHeader={false}>
      <div className='w-full'>
        <Link
          href='/blog'
          className='inline-flex items-center text-primary dark:text-primary-light hover:underline mb-8'
        >
          <svg
            className='mr-2 w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          Back to Blog
        </Link>

        {process.env.NODE_ENV === 'production' && <ProductionNotice />}

        <article className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden'>
          <div className='p-4 sm:p-6 md:p-8'>
            <header className='mb-8'>
              <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                {post.title}
              </h1>
              <div className='flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-6'>
                <div className='flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  <span>{post.author}</span>
                </div>
                <div className='flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <time dateTime={post.datePublished}>
                    {post.datePublished
                      ? new Date(post.datePublished).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )
                      : 'No date available'}
                  </time>
                </div>
                <div className='flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>{post.readingTime}</span>
                </div>
              </div>

              <div className='flex flex-wrap gap-2 mt-4 mb-6'>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {post.featuredImage && (
                <div className='w-full max-h-[500px] relative mb-6 rounded-lg overflow-hidden shadow-md'>
                  <img
                    src={post.featuredImage || post.image}
                    alt={post.title}
                    className='object-contain w-full h-full'
                  />
                </div>
              )}
            </header>

            <div className='prose dark:prose-invert max-w-none prose-p:text-base sm:prose-p:text-lg prose-li:text-base sm:prose-li:text-lg prose-p:leading-relaxed prose-li:leading-relaxed'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: codeBlock,
                  a: ({ href, children, ...props }: ComponentProps) => (
                    <a
                      href={href as string}
                      className='text-primary dark:text-primary-light hover:underline'
                      target='_blank'
                      rel='noopener noreferrer'
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  h2: ({ children, ...props }: ComponentProps) => (
                    <h2 className='text-2xl font-bold mt-8 mb-4' {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }: ComponentProps) => (
                    <h3 className='text-xl font-bold mt-6 mb-3' {...props}>
                      {children}
                    </h3>
                  ),
                  ul: ({ children, ...props }: ComponentProps) => (
                    <ul className='list-disc pl-6 my-4' {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({
                    ordered,
                    children,
                    ...props
                  }: ComponentProps & { ordered?: boolean }) => (
                    <ol
                      className='list-decimal pl-6 my-4'
                      {...(ordered === false ? {} : props)}
                    >
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children, ...props }: ComponentProps) => (
                    <blockquote
                      className='border-l-4 border-primary pl-4 italic my-4'
                      {...props}
                    >
                      {children}
                    </blockquote>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <div className='mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md'>
          <h3 className='text-xl font-bold mb-4'>Share this post</h3>
          <div className='flex gap-4'>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(
                `https://jeffknowlesjr.com/blog/${post.slug}`
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 hover:text-blue-600'
              aria-label='Share on Twitter'
            >
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://jeffknowlesjr.com/blog/${post.slug}`
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-700 hover:text-blue-800'
              aria-label='Share on LinkedIn'
            >
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
