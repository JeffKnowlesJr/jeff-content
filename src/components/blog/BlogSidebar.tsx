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
      slug: 'nextjs-app-router-solving-real-world-seo-challenges',
      title: 'Next.js App Router: Solving Real-World SEO Challenges',
      publishDate: '2024-04-01',
      author: 'Jeff Knowles Jr',
      readingTime: '12 min read',
      featuredImage:
        '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg',
      tags: ['Next.js', 'SEO', 'React', 'App Router', 'Server Components']
    },
    {
      slug: 'react-performance-optimization-techniques',
      title: 'React Performance Optimization Techniques for Large Applications',
      publishDate: '2024-03-25',
      author: 'Jeff Knowles Jr',
      readingTime: '10 min read',
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg',
      tags: [
        'React',
        'Performance',
        'Web Development',
        'Code Splitting',
        'Suspense'
      ]
    },
    {
      slug: 'implementing-cicd-pipelines-github-actions-aws',
      title: 'Implementing CI/CD Pipelines with GitHub Actions and AWS',
      publishDate: '2024-04-02',
      author: 'Jeff Knowles Jr',
      readingTime: '8 min read',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg',
      tags: [
        'DevOps',
        'CI/CD',
        'GitHub Actions',
        'AWS',
        'Infrastructure as Code'
      ]
    },
    {
      slug: 'implementing-image-optimization-nextjs',
      title: 'Implementing Modern Image Optimization in Next.js Applications',
      publishDate: '2024-04-01',
      author: 'Jeff Knowles Jr',
      readingTime: '8 min read',
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg',
      tags: ['Next.js', 'Image Optimization', 'WebPerformance', 'Sharp', 'CDN']
    },
    {
      slug: 'typescript-best-practices',
      title: 'TypeScript Best Practices for Large Scale Applications',
      publishDate: '2024-02-28',
      author: 'Jeff Knowles Jr',
      readingTime: '12 min read',
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Web Development']
    },
    {
      slug: 'directorybased-domain-splitting-in-aws-a-practical-approach',
      title: 'Directory-Based Domain Splitting in AWS: A Practical Approach',
      publishDate: '2024-04-04',
      author: 'Jeff Knowles Jr',
      readingTime: '12 min read',
      featuredImage:
        '/images/blog/featured/smit-patel-xMNQketH4tU-unsplash-16x9.jpg',
      tags: [
        'AWS',
        'Architecture',
        'CloudFront',
        'API Gateway',
        'Infrastructure'
      ]
    },
    {
      slug: 'server-side-authentication-aws-amplify-nextjs',
      title:
        'Implementing Server-Side Authentication with AWS Amplify and Next.js',
      publishDate: '2024-03-30',
      author: 'Jeff Knowles Jr',
      readingTime: '10 min read',
      featuredImage: '/images/blog/featured/aws-amplify-cloud-development.jpg',
      tags: [
        'AWS Amplify',
        'Next.js',
        'Authentication',
        'Server Components',
        'JWT'
      ]
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

function getTopics(): string[] {
  return [
    'Web Development',
    'Cloud Architecture',
    'DevOps & CI/CD',
    'React & Next.js',
    'Performance Optimization',
    'TypeScript',
    'AWS Services'
  ].sort()
}

function getTechnicalTags(): string[] {
  const allPosts = getBlogPosts()
  const tags = new Set<string>()

  allPosts.forEach((post: Post) => {
    post.tags.forEach((tag: string) => tags.add(tag))
  })

  return Array.from(tags).sort()
}

export default function BlogSidebar() {
  const recentPosts = getRecentPosts()
  const topics = getTopics()
  const tags = getTechnicalTags()

  return (
    <aside className="space-y-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Recent Posts
        </h2>
        <ul className="space-y-5">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {post.title}
                </h3>
                <time
                  dateTime={post.publishDate}
                  className="text-sm text-gray-500 dark:text-gray-400"
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

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Topics
        </h2>
        <ul className="space-y-3">
          {topics.map((topic) => (
            <li key={topic}>
              <Link
                href={`/blog/category/${encodeURIComponent(
                  topic.toLowerCase()
                )}`}
                className="text-base text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center"
              >
                <span className="mr-2">•</span>
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          GitHub
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Check out my code examples and open-source projects on GitHub.
        </p>
        <a
          href="https://github.com/jeffknowles"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <svg
            className="mr-2 -ml-1 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          View GitHub Profile
        </a>
      </div>
    </aside>
  )
}
