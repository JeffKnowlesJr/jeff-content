'use client'

import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import BackToTopButton from './BackToTopButton'

interface BlogPostProps {
  post: {
    title: string
    content: string
    publishDate: string
    author: string
    readingTime: string
    featuredImage: string
    tags: string[]
  }
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function BlogPost({ post }: BlogPostProps) {
  const codeBlock = ({
    inline,
    className,
    children,
    ...props
  }: CodeBlockProps) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'

    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus as Record<string, React.CSSProperties>}
        language={language}
        PreTag='div'
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <article
      id='blog-post-content'
      className='prose prose-lg dark:prose-invert max-w-none'
    >
      <header className='mb-10 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
          {post.title}
        </h1>

        <div className='flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-8'>
          <span>
            {new Date(post.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span>{post.readingTime}</span>
          <span>•</span>
          <span>By {post.author}</span>
        </div>

        {post.featuredImage && (
          <div className='relative w-full max-w-4xl mx-auto aspect-video mb-10 rounded-xl overflow-hidden shadow-lg'>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
              className='object-cover'
              priority
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap justify-center gap-2 mb-10'>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag.toLowerCase()}`}
                className='inline-flex items-center rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors'
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className='max-w-3xl mx-auto'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: codeBlock,
            h1: ({ children }) => (
              <h1 className='text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white'>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white'>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-xl font-bold mt-8 mb-3 text-gray-900 dark:text-white'>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className='mb-6 leading-relaxed text-gray-800 dark:text-gray-300'>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-6 mb-6 space-y-2 text-gray-800 dark:text-gray-300'>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-6 mb-6 space-y-2 text-gray-800 dark:text-gray-300'>
                {children}
              </ol>
            ),
            li: ({ children }) => <li className='mb-2'>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className='border-l-4 border-teal-500 pl-4 italic my-6 text-gray-700 dark:text-gray-400'>
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className='text-teal-600 dark:text-teal-400 hover:underline'
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={
                  href?.startsWith('http') ? 'noopener noreferrer' : undefined
                }
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <div className='my-8 rounded-lg overflow-hidden shadow-md'>
                <Image
                  src={src || ''}
                  alt={alt || ''}
                  width={800}
                  height={450}
                  className='w-full h-auto'
                />
              </div>
            ),
            hr: () => (
              <hr className='my-8 border-gray-300 dark:border-gray-700' />
            ),
            pre: ({ children }) => (
              <div className='my-6 rounded-lg overflow-hidden shadow-md'>
                {children}
              </div>
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <BackToTopButton />
    </article>
  )
}
