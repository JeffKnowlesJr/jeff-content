import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { BlogPost, getContentBySlug } from '@/utils/content-loader'
import { generateBlogPostSchema } from '@/utils/schema'
import { generateBlogPostMetadata } from '@/utils/metadata'

interface PageProps {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

// Generate metadata for the blog post
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const post = await getContentBySlug<BlogPost>('blog', params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return generateBlogPostMetadata(post)
}

// Blog post page component
export default async function BlogPostPage({ params }: PageProps) {
  // Get blog post from the slug
  const post = await getContentBySlug<BlogPost>('blog', params.slug)

  // If not found, show 404
  if (!post) {
    notFound()
  }

  // Generate structured data for JSON-LD
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'
  const canonicalUrl = `${baseUrl}/blog/${params.slug}`
  const jsonLd = generateBlogPostSchema(post, canonicalUrl)

  return (
    <div className='min-h-screen'>
      <Script
        id='blog-post-jsonld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12'>
        <Link
          href='/blog'
          className='inline-flex items-center text-primary dark:text-primary-light hover:underline mb-4 sm:mb-8 text-base sm:text-lg'
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

        <article className='bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
          <div className='p-4 sm:p-8 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700'>
            <header>
              <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                {post.title}
              </h1>
              <div className='flex flex-wrap items-center gap-4 text-base text-gray-600 dark:text-gray-300 mb-4'>
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
                    {new Date(post.datePublished).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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

              <div className='flex flex-wrap gap-2 mb-6'>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm sm:text-base'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>
          </div>

          {post.featuredImage && (
            <div className='w-full relative max-h-[500px] overflow-hidden'>
              <img
                src={post.featuredImage || post.image}
                alt={post.title}
                className='object-cover w-full'
              />
            </div>
          )}

          <div className='p-4 sm:p-8 bg-white dark:bg-gray-800'>
            <div className='max-w-prose mx-auto my-12'>
              <div className='prose dark:prose-invert prose-lg mx-auto'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>

            <div className='mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8'>
              <div className='flex flex-col sm:flex-row sm:justify-between gap-4'>
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                  <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2'>
                    About the Author
                  </h3>
                  <p className='text-base sm:text-lg text-gray-700 dark:text-gray-200 leading-relaxed'>
                    {post.author} is a developer and technical writer.
                  </p>
                </div>
                <div className='flex items-center gap-2 self-start mt-2'>
                  <span className='text-base text-gray-700 dark:text-gray-200'>
                    Share:
                  </span>
                  <div className='flex gap-3'>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        post.title
                      )}&url=${encodeURIComponent(
                        `https://jeffknowlesjr.com/blog/${post.slug}`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-400 hover:text-blue-600'
                      aria-label='Share on Twitter'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.01 10.01 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z' />
                      </svg>
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        `https://jeffknowlesjr.com/blog/${post.slug}`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800'
                      aria-label='Share on LinkedIn'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                      </svg>
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `https://jeffknowlesjr.com/blog/${post.slug}`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800'
                      aria-label='Share on Facebook'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
