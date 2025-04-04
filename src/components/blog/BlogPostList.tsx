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

// This would be replaced with actual data fetching
function getBlogPosts(): BlogPost[] {
  return [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Getting Started with Next.js',
      publishDate: '2024-03-15',
      author: 'Jeff and Claude',
      readingTime: '5 min read',
      featuredImage: '/images/blog/featured/getting-started-with-nextjs.jpg',
      tags: ['Next.js', 'React', 'TypeScript', 'Web Development']
    },
    {
      slug: 'building-modern-portfolio',
      title: 'Building a Modern Portfolio Website',
      publishDate: '2024-03-10',
      author: 'Jeff and Claude',
      readingTime: '8 min read',
      featuredImage: '/images/blog/featured/building-modern-portfolio.jpg',
      tags: ['Portfolio', 'Web Design', 'Tailwind CSS']
    },
    {
      slug: 'optimizing-react-performance',
      title: 'Optimizing React Performance',
      publishDate: '2024-03-05',
      author: 'Jeff and Claude',
      readingTime: '10 min read',
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg',
      tags: ['React', 'Performance', 'JavaScript', 'Web Development']
    },
    {
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices',
      publishDate: '2024-02-28',
      author: 'Jeff and Claude',
      readingTime: '12 min read',
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Development']
    },
    {
      slug: 'aws-serverless-architecture',
      title: 'AWS Serverless Architecture',
      publishDate: '2024-02-20',
      author: 'Jeff and Claude',
      readingTime: '15 min read',
      featuredImage: '/images/blog/featured/aws-serverless-architecture.jpg',
      tags: ['AWS', 'Serverless', 'Cloud', 'Architecture']
    },
    {
      slug: 'responsive-design-principles',
      title: 'Responsive Design Principles',
      publishDate: '2024-02-15',
      author: 'Jeff and Claude',
      readingTime: '8 min read',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg',
      tags: ['CSS', 'Responsive Design', 'Web Design', 'UI/UX']
    },
    {
      slug: 'building-modern-web-applications',
      title: 'Building Modern Web Applications',
      publishDate: '2024-03-25',
      author: 'Jeff and Claude',
      readingTime: '10 min read',
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg',
      tags: ['Web Development', 'React', 'Next.js', 'Performance']
    }
  ]
}

interface BlogPostListProps {
  posts?: BlogPost[]
}

export default function BlogPostList({
  posts = getBlogPosts()
}: BlogPostListProps) {
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
