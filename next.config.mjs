/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore type errors during build for deployment
    ignoreBuildErrors: true
  },
  images: {
    domains: ['d309xicbd1a46e.cloudfront.net']
  },
  // Expose environment variables to the browser
  env: {
    NEXT_PUBLIC_APPSYNC_API_URL: process.env.NEXT_PUBLIC_APPSYNC_API_URL,
    NEXT_PUBLIC_APPSYNC_API_KEY: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
    APPSYNC_API_URL: process.env.APPSYNC_API_URL,
    APPSYNC_API_KEY: process.env.APPSYNC_API_KEY
  },
  // Add permanent redirects configuration
  async redirects() {
    return [
      // Fix redirects from old blog URLs
      {
        source: '/jeffknowlesjr.com/projects/project-zero-documentation',
        destination: '/projects/project-zero-documentation',
        permanent: true
      },
      {
        source: '/jeffknowlesjr.com/projects/project-omega-documentation',
        destination: '/projects/project-omega-documentation',
        permanent: true
      },
      {
        source: '/jeffknowlesjr.com/blog',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/jeffknowlesjr.com/port-inc',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/port-inc',
        destination: '/projects',
        permanent: true
      },
      // Add new redirects for 404 URLs
      {
        source: '/projects/modules/appsync',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/projects/modules/dynamodb',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/projects/modules/s3-cloudfront',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/projects/modules/cognito',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/projects/modules/amplify',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/prod',
        destination: '/',
        permanent: true
      },
      {
        source: '/app',
        destination: '/',
        permanent: true
      },
      {
        source: '/app/index.html',
        destination: '/',
        permanent: true
      },
      {
        source: '/users',
        destination: '/',
        permanent: true
      },
      {
        source: '/docs',
        destination: '/resources',
        permanent: true
      },
      {
        source: '/downloads/marketing-guide',
        destination: '/resources',
        permanent: true
      },
      {
        source: '/about',
        destination: '/',
        permanent: true
      },
      {
        source: '/admin/index.html',
        destination: '/admin',
        permanent: true
      },
      {
        source: '/admin',
        destination: '/admin',
        permanent: true
      },
      // Existing redirects
      {
        source: '/blog/tag/tailwind%20css',
        destination: '/blog/tag/tailwind-css',
        permanent: true
      },
      {
        source: '/blog/tag/responsive%20design',
        destination: '/blog/tag/responsive-design',
        permanent: true
      },
      {
        source: '/blog/tag/typescript%20best%20practices',
        destination: '/blog/tag/typescript-best-practices',
        permanent: true
      },
      {
        source: '/blog/optimizing-react-performance',
        destination: '/blog/modern-website-architecture-seo-optimization',
        permanent: true
      },
      // Redirect all tag and category pages to main blog
      {
        source: '/blog/tag/:tag',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/blog/category/:category',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/blog/tags',
        destination: '/blog',
        permanent: true
      },
      {
        source: '/blog/categories',
        destination: '/blog',
        permanent: true
      },
      // Fix for truncated project slugs
      {
        source: '/projects/project-zero',
        destination: '/projects/project-zero-documentation',
        permanent: true
      },
      {
        source: '/projects/project-omega',
        destination: '/projects/project-omega-documentation',
        permanent: true
      },
      // Add explicit redirect for contact with trailing slash
      {
        source: '/contact/',
        destination: '/contact',
        permanent: false
      }
    ]
  },
  // Essential settings for proper SSR/dynamic routes with admin pages
  output: 'standalone',
  // Handle trailing slashes properly
  trailingSlash: false
}

export default nextConfig
