import { Metadata } from 'next'
import { BlogPost, getContentList } from '@/utils/content-loader'
import BlogCard from '@/components/blog/BlogCard'
import { generateBlogIndexMetadata } from '@/utils/metadata'

// Generate metadata
export const metadata: Metadata = generateBlogIndexMetadata()

// Get blog posts from our content loader
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Load posts from the content directory
    const posts = await getContentList<BlogPost>('blog')

    // If we have content, return it
    if (posts && posts.length > 0) {
      // Sort posts by publication date (most recent first)
      return posts.sort((a, b) => {
        const dateA = new Date(a.datePublished || a.publishDate || '')
        const dateB = new Date(b.datePublished || b.publishDate || '')
        return dateB.getTime() - dateA.getTime()
      })
    }

    console.log('No blog posts found in content directory, using fallback data')
    return getFallbackPosts()
  } catch (error) {
    console.error('Error loading blog posts from content:', error)
    return getFallbackPosts()
  }
}

// Fallback posts in case content directory doesn't work
function getFallbackPosts(): BlogPost[] {
  return [
    {
      id: 'directorybased-domain-splitting',
      title: 'Directory-Based Domain Splitting in AWS: A Practical Approach',
      slug: 'directorybased-domain-splitting-in-aws-a-practical-approach',
      excerpt:
        'A technical deep dive into implementing directory-based domain splitting with AWS CloudFront, API Gateway, and Lambda@Edge for microservice architectures.',
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
      title: 'Next.js App Router: Solving Real-World SEO Challenges',
      slug: 'nextjs-app-router-solving-real-world-seo-challenges',
      excerpt:
        'Technical implementation of Next.js App Router for improved SEO, including metadata API usage, server components, and dynamic route optimization.',
      publishDate: '2024-04-01',
      author: 'Jeff Knowles Jr',
      readingTime: '12 min read',
      tags: ['Next.js', 'SEO', 'React', 'App Router', 'Server Components'],
      image: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-01',
      dateModified: '2024-04-04',
      featuredImage: '/images/blog/featured/sajad-nori-21mJd5NUGZU-unsplash.jpg'
    },
    {
      id: 'react-performance-tips',
      title: 'React Performance Optimization Techniques for Large Applications',
      slug: 'react-performance-optimization-techniques',
      excerpt:
        'Advanced techniques for optimizing React applications, including memo, useCallback, code splitting, and Suspense with real-world code examples.',
      publishDate: '2024-03-25',
      author: 'Jeff Knowles Jr',
      readingTime: '10 min read',
      tags: [
        'React',
        'Performance',
        'Web Development',
        'Code Splitting',
        'Suspense'
      ],
      image: '/images/blog/featured/optimizing-react-performance.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-25',
      dateModified: '2024-03-25',
      featuredImage: '/images/blog/featured/optimizing-react-performance.jpg'
    },
    {
      id: 'streamlining-build-processes',
      title: 'Implementing CI/CD Pipelines with GitHub Actions and AWS',
      slug: 'implementing-cicd-pipelines-github-actions-aws',
      excerpt:
        'Step-by-step guide to creating efficient CI/CD pipelines using GitHub Actions for building, testing, and deploying applications to AWS infrastructure.',
      publishDate: '2024-04-02',
      author: 'Jeff Knowles Jr',
      readingTime: '8 min read',
      tags: [
        'DevOps',
        'CI/CD',
        'GitHub Actions',
        'AWS',
        'Infrastructure as Code'
      ],
      image: '/images/blog/featured/responsive-design-principles.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-02',
      dateModified: '2024-04-02',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg'
    },
    {
      id: 'optimizing-images-web',
      title: 'Implementing Modern Image Optimization in Next.js Applications',
      slug: 'implementing-image-optimization-nextjs',
      excerpt:
        'Technical implementation of image optimization strategies using Next.js Image component, Sharp, and content delivery networks for optimal performance.',
      publishDate: '2024-04-01',
      author: 'Jeff Knowles Jr',
      readingTime: '8 min read',
      tags: ['Next.js', 'Image Optimization', 'WebPerformance', 'Sharp', 'CDN'],
      image: '/images/blog/featured/typescript-best-practices.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-04-01',
      dateModified: '2024-04-01',
      featuredImage: '/images/blog/featured/typescript-best-practices.jpg'
    },
    {
      id: 'obsidian-for-developers',
      title: 'Creating a Developer Knowledge Base with Obsidian and Git',
      slug: 'developer-knowledge-base-obsidian-git',
      excerpt:
        'Implementing a structured knowledge management system for development teams using Obsidian with Git integration for code snippet synchronization.',
      publishDate: '2024-03-30',
      author: 'Jeff Knowles Jr',
      readingTime: '9 min read',
      tags: [
        'Developer Tools',
        'Obsidian',
        'Git',
        'Knowledge Management',
        'Documentation'
      ],
      image: '/images/blog/featured/responsive-design-principles.jpg',
      content: '',
      status: 'published',
      datePublished: '2024-03-30',
      dateModified: '2024-03-30',
      featuredImage: '/images/blog/featured/responsive-design-principles.jpg'
    },
    {
      id: 'building-modern-portfolio',
      title:
        'Building a Developer Portfolio with Next.js, TypeScript and TailwindCSS',
      slug: 'building-developer-portfolio-nextjs-typescript-tailwind',
      excerpt:
        'Technical walkthrough on building a modern developer portfolio with Next.js 14, TypeScript, and TailwindCSS, focusing on type safety and performance.',
      publishDate: '2024-03-30',
      author: 'Jeff Knowles Jr',
      readingTime: '11 min read',
      tags: [
        'Next.js',
        'TypeScript',
        'TailwindCSS',
        'Web Development',
        'Portfolio'
      ],
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
        'Implementing Server-Side Authentication with AWS Amplify and Next.js',
      slug: 'server-side-authentication-aws-amplify-nextjs',
      excerpt:
        'Complete implementation guide for AWS Amplify authentication in Next.js applications with server-side session validation and protected routes.',
      publishDate: '2024-03-30',
      author: 'Jeff Knowles Jr',
      readingTime: '10 min read',
      tags: [
        'AWS Amplify',
        'Next.js',
        'Authentication',
        'Server Components',
        'JWT'
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
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
        Blog Posts
      </h1>

      {/* Mobile-optimized grid - single column on mobile, two columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            id={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            image={
              post.featuredImage ||
              post.image ||
              '/images/blog/default-post.jpg'
            }
            author={post.author}
            publishDate={post.datePublished || post.publishDate || ''}
            readingTime={post.readingTime}
            tags={post.tags}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  )
}
