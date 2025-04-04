import Link from 'next/link'

interface Post {
  slug: string
  title: string
  publishDate: string
  author: string
  readingTime: string
  featuredImage: string
  tags: string[]
}

// This would be replaced with actual data fetching
function getBlogPosts(): Post[] {
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

function getRecentPosts(): Post[] {
  return getBlogPosts()
    .sort(
      (a: Post, b: Post) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, 5)
}

function getCategories(): string[] {
  const allPosts = getBlogPosts()
  const categories = new Set<string>()

  allPosts.forEach((post: Post) => {
    post.tags.forEach((tag: string) => {
      if (
        tag.includes('Development') ||
        tag.includes('Design') ||
        tag.includes('Architecture')
      ) {
        categories.add(tag)
      }
    })
  })

  return Array.from(categories).sort()
}

function getAllTags(): string[] {
  const allPosts = getBlogPosts()
  const tags = new Set<string>()

  allPosts.forEach((post: Post) => {
    post.tags.forEach((tag: string) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export default function BlogSidebar() {
  const recentPosts = getRecentPosts()
  const categories = getCategories()
  const tags = getAllTags()

  return (
    <aside className='space-y-10'>
      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700'>
          Recent Posts
        </h2>
        <ul className='space-y-5'>
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className='group block'>
                <h3 className='text-base font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors'>
                  {post.title}
                </h3>
                <time
                  dateTime={post.publishDate}
                  className='text-sm text-gray-500 dark:text-gray-400'
                >
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700'>
          Categories
        </h2>
        <ul className='space-y-3'>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={`/blog/category/${category.toLowerCase()}`}
                className='text-base text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center'
              >
                <span className='mr-2'>•</span>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700'>
          Tags
        </h2>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase()}`}
              className='px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-800 dark:hover:text-teal-200 transition-colors'
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
