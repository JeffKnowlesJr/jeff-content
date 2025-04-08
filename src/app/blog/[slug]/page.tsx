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
      <div className="relative group">
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary dark:text-primary-light hover:underline mb-8"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{post.readingTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {post.featuredImage && (
                <div className="w-full max-h-[500px] relative mb-6 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={post.featuredImage || post.image}
                    alt={post.title}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: codeBlock,
                  a: ({ node, href, children, ...props }: any) => (
                    <a
                      href={href}
                      className="text-primary dark:text-primary-light hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  h2: ({ node, children, ...props }: any) => (
                    <h2 className="text-2xl font-bold mt-8 mb-4" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ node, children, ...props }: any) => (
                    <h3 className="text-xl font-bold mt-6 mb-3" {...props}>
                      {children}
                    </h3>
                  ),
                  ul: ({ node, children, ...props }: any) => (
                    <ul className="list-disc pl-6 my-4" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ node, children, ...props }: any) => (
                    <ol className="list-decimal pl-6 my-4" {...props}>
                      {children}
                    </ol>
                  ),
                  blockquote: ({ node, children, ...props }: any) => (
                    <blockquote
                      className="border-l-4 border-primary pl-4 italic my-4"
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

        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">Share this post</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                post.title
              )}&url=${encodeURIComponent(
                `https://jeffknowlesjr.com/blog/${post.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.01 10.01 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://jeffknowlesjr.com/blog/${post.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
