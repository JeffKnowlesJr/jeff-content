import { Metadata } from 'next'
import { BlogPost, getContentList } from '@/utils/content-loader'
import BlogCard from '@/components/blog/BlogCard'

export const metadata: Metadata = {
  title: 'Blog | Jeff Knowles Jr',
  description:
    'Thoughts and insights on web development, cloud architecture, and technical consulting.',
  openGraph: {
    title: 'Blog | Jeff Knowles Jr',
    description:
      'Thoughts and insights on web development, cloud architecture, and technical consulting.',
    type: 'website'
  }
}

// Get blog posts from our content loader
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Try to load posts from the content directory
    const posts = await getContentList<BlogPost>('blog')

    // If we have content, return it
    if (posts && posts.length > 0) {
      return posts
    }
  } catch (error) {
    console.error('Error loading blog posts from content:', error)
  }

  // Fallback to hardcoded posts
  return [
    {
      id: 'directorybased-domain-splitting',
      title: 'Directory-Based Domain Splitting in AWS: A Practical Approach',
      slug: 'directorybased-domain-splitting-in-aws-a-practical-approach',
      excerpt:
        'Learn how to route different parts of your website to specialized backend services using AWS CloudFront and API Gateway while maintaining a unified frontend experience.',
      publishDate: '2024-04-04',
      author: 'Jeff Knowles Jr',
      readingTime: '12 min read',
      tags: [
        'AWS',
        'Architecture',
        'CloudFront',
        'API Gateway',
        'Infrastructure'
      ],
      image: '/images/blog/featured/smit-patel-xMNQketH4tU-unsplash-16x9.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-04',
      dateModified: '2024-04-04',
      featuredImage:
        '/images/blog/featured/smit-patel-xMNQketH4tU-unsplash-16x9.jpg'
    },
    {
      id: 'modern-website-architecture',
      title: 'Modern Website Architecture: When to Split Your SPA for SEO',
      slug: 'modern-website-architecture-seo-optimization',
      excerpt:
        'Learn how to optimize your React application for search engines by strategically splitting your architecture into SSR and SPA components for maximum performance and discoverability',
      publishDate: '2024-04-01',
      author: 'Jeff & Claude',
      readingTime: '12 min read',
      tags: ['Architecture', 'SEO', 'Next.js', 'React', 'AWS'],
      image: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-01',
      dateModified: '2024-04-04',
      featuredImage: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg'
    },
    {
      id: 'react-performance-tips',
      title: 'React Performance Tips: Building Lightning-Fast Web Applications',
      slug: 'react-performance-tips',
      excerpt:
        'Learn essential techniques for optimizing React applications, from code splitting to component optimization',
      publishDate: '2024-03-25',
      author: 'Jeff & Claude',
      readingTime: '10 min read',
      tags: ['React', 'Performance', 'Web Development', 'Optimization'],
      image: '/images/blog/featured/optimizing-react-performance.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-25',
      dateModified: '2024-03-25',
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg'
    },
    {
      id: 'streamlining-build-processes',
      title: 'Streamlining Build Processes with Modern DevOps',
      slug: 'streamlining-build-processes',
      excerpt:
        'Discover how to enhance development workflows by implementing efficient build processes and CI/CD pipelines',
      publishDate: '2024-04-02',
      author: 'Jeff',
      readingTime: '8 min read',
      tags: ['DevOps', 'CI/CD', 'Automation', 'Build Process'],
      image: '/images/blog/featured/responsive-design-principles.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-02',
      dateModified: '2024-04-02',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg'
    },
    {
      id: 'optimizing-images-web',
      title: 'Optimizing Images for the Modern Web',
      slug: 'optimizing-images-web',
      excerpt:
        'Learn the essential techniques for optimizing website images to enhance performance, SEO, and user experience',
      publishDate: '2024-04-01',
      author: 'Jeff',
      readingTime: '8 min read',
      tags: ['WebPerformance', 'Images', 'Optimization', 'WebDevelopment'],
      image: '/images/blog/featured/typescript-best-practices.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-01',
      dateModified: '2024-04-01',
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg'
    },
    {
      id: 'obsidian-for-developers',
      title: 'Obsidian for Developers: Upgrading Your Knowledge Management',
      slug: 'obsidian-for-developers',
      excerpt:
        'How developers can leverage Obsidian for better documentation, code snippets, and knowledge organization',
      publishDate: '2024-03-30',
      author: 'Jeff',
      readingTime: '9 min read',
      tags: ['Productivity', 'Documentation', 'Knowledge Management', 'Tools'],
      image: '/images/blog/featured/responsive-design-principles.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-30',
      dateModified: '2024-03-30',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg'
    },
    {
      id: 'building-modern-portfolio',
      title: 'Building a Modern Portfolio Website in 2024',
      slug: 'building-modern-portfolio',
      excerpt:
        'A comprehensive guide to creating an impressive developer portfolio using Next.js, Tailwind CSS, and modern web practices',
      publishDate: '2024-03-30',
      author: 'Jeff',
      readingTime: '11 min read',
      tags: ['Portfolio', 'Next.js', 'Tailwind CSS', 'Web Development'],
      image: '/images/blog/featured/building-modern-portfolio.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-30',
      dateModified: '2024-03-30',
      featuredImage: '/images/blog/featured/building-modern-portfolio.jpg'
    },
    {
      id: 'amplify-cloud-development',
      title:
        'Amplify Your Development: AWS Amplify for Modern Web Applications',
      slug: 'amplify-cloud-development',
      excerpt:
        'How to leverage AWS Amplify to simplify cloud infrastructure for web applications with authentication, storage, and API capabilities',
      publishDate: '2024-03-30',
      author: 'Jeff',
      readingTime: '10 min read',
      tags: [
        'AWS',
        'Amplify',
        'Cloud Development',
        'Authentication',
        'Hosting'
      ],
      image: '/images/blog/featured/aws-amplify-cloud-development.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-30',
      dateModified: '2024-03-30',
      featuredImage: '/images/blog/featured/aws-amplify-cloud-development.jpg'
    }
  ]
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className='container mx-auto px-4 py-6 sm:py-8'>
      <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8'>
        Blog Posts
      </h1>

      {/* Mobile-optimized grid - single column on mobile, three columns on larger screens */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt}
            image={post.image || post.featuredImage}
            author={post.author}
            publishDate={post.publishDate || post.datePublished}
            readingTime={post.readingTime}
            tags={post.tags}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  )
}
