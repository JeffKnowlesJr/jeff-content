import Link from 'next/link'
import Image from 'next/image'

/**
 * BLOG POST LIST COMPONENT
 * =======================
 * Displays a grid of blog post cards with consistent padding.
 *
 * RELATED COMPONENTS:
 * - BlogLayout (parent container that provides standard layout)
 * - SimpleCard (used for each blog post card)
 * - Blog page (parent page that renders this component)
 *
 * PADDING REQUIREMENTS:
 * This component should NOT add its own horizontal padding as it's provided by:
 * - BlogLayout provides px-4 standard content padding
 * - The parent Blog page wraps this component
 */

interface BlogPost {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

interface BlogPostListProps {
  posts: BlogPost[]
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-600 dark:text-gray-400'>No blog posts found.</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {posts.map((post) => (
        <article
          key={post.slug}
          className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]'
        >
          <Link href={`/blog/${post.slug}`}>
            <div className='relative h-48 md:h-64 w-full'>
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover'
              />
            </div>
            <div className='p-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                {post.title}
              </h2>
              <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4'>
                <span>{post.author}</span>
                <span className='mx-2'>•</span>
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className='mx-2'>•</span>
                <span>{post.readingTime}</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}
