import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  publishDate: string
  author: string
  readingTime?: number
  featuredImage?: string
  tags?: string[]
}

// This will be replaced with actual data fetching
async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  // TODO: Implement actual search functionality
  const allPosts = [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      excerpt:
        'Learn how to get started with Next.js, a React framework for building web applications.',
      publishDate: '2024-03-15',
      author: 'Jeff and Claude',
      readingTime: 5,
      featuredImage: '/images/blog/featured/getting-started-with-nextjs.jpg',
      tags: ['Next.js', 'React', 'TypeScript', 'Web Development']
    },
    {
      slug: 'building-modern-portfolio',
      title: 'Building a Modern Portfolio Website',
      excerpt:
        'A comprehensive guide to building a modern portfolio website using Next.js, TypeScript, and Tailwind CSS.',
      publishDate: '2024-03-10',
      author: 'Jeff and Claude',
      readingTime: 8,
      featuredImage: '/images/blog/featured/building-modern-portfolio.jpg',
      tags: ['Portfolio', 'Web Design', 'Tailwind CSS']
    },
    {
      slug: 'optimizing-react-performance',
      title: 'Optimizing React Performance',
      excerpt:
        'Learn how to optimize your React applications for better performance.',
      publishDate: '2024-03-05',
      author: 'Jeff and Claude',
      readingTime: 10,
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg',
      tags: ['React', 'Performance', 'JavaScript', 'Web Development']
    },
    {
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices',
      excerpt: 'Discover the best practices for writing TypeScript code.',
      publishDate: '2024-02-28',
      author: 'Jeff and Claude',
      readingTime: 12,
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Development']
    },
    {
      slug: 'aws-serverless-architecture',
      title: 'AWS Serverless Architecture',
      excerpt: 'Learn how to build serverless applications using AWS services.',
      publishDate: '2024-02-20',
      author: 'Jeff and Claude',
      readingTime: 15,
      featuredImage: '/images/blog/featured/aws-serverless-architecture.jpg',
      tags: ['AWS', 'Serverless', 'Cloud', 'Architecture']
    },
    {
      slug: 'responsive-design-principles',
      title: 'Responsive Design Principles',
      excerpt: 'Master the principles of responsive web design.',
      publishDate: '2024-02-15',
      author: 'Jeff and Claude',
      readingTime: 8,
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg',
      tags: ['CSS', 'Responsive Design', 'Web Design', 'UI/UX']
    },
    {
      slug: 'building-modern-web-applications',
      title: 'Building Modern Web Applications',
      excerpt:
        'A comprehensive guide to building modern web applications with a focus on architecture, performance, and user experience.',
      publishDate: '2024-03-25',
      author: 'Jeff and Claude',
      readingTime: 10,
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg',
      tags: ['Web Development', 'React', 'Next.js', 'Performance']
    }
  ]

  if (!query) return []

  const lowercaseQuery = query.toLowerCase()
  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
}

interface BlogSearchResultsProps {
  query: string
}

export default async function BlogSearchResults({
  query
}: BlogSearchResultsProps) {
  const results = await searchBlogPosts(query)

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
        Search Results for &quot;{query}&quot;
      </h1>

      {results.length === 0 ? (
        <div className='bg-gray-100 dark:bg-gray-800 p-6 rounded-lg'>
          <p className='text-gray-700 dark:text-gray-300'>
            No results found for &quot;{query}&quot;. Try different keywords or
            browse all articles.
          </p>
          <Link
            href='/blog'
            className='inline-block mt-4 text-teal-600 dark:text-teal-400 hover:underline'
          >
            Browse all articles
          </Link>
        </div>
      ) : (
        <div className='space-y-8'>
          {results.map((post) => (
            <article
              key={post.slug}
              className='flex flex-col md:flex-row gap-6'
            >
              {post.featuredImage && (
                <Link href={`/blog/${post.slug}`} className='md:w-1/3'>
                  <div className='relative w-full aspect-[16/9]'>
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes='(max-width: 768px) 100vw, 33vw'
                      className='object-cover rounded-lg'
                    />
                  </div>
                </Link>
              )}

              <div className='md:w-2/3'>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 mb-2'>
                    {post.title}
                  </h2>
                </Link>

                <div className='flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-3'>
                  <span>
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  {post.readingTime && (
                    <span>· {post.readingTime} min read</span>
                  )}
                  <span>· By {post.author}</span>
                </div>

                <p className='text-gray-700 dark:text-gray-300 mb-3'>
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
