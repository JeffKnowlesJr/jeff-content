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

export default function BlogSidebar() {
  const recentPosts = getRecentPosts()

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
    </aside>
  )
}
