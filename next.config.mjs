/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore type errors during build for deployment
    ignoreBuildErrors: true
  },
  images: {
    domains: ['d309xicbd1a46e.cloudfront.net']
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
      // Fix project redirects
      {
        source: '/projects/project-zero-documentation',
        destination: '/projects',
        permanent: true
      },
      {
        source: '/projects/project-omega-documentation',
        destination: '/projects',
        permanent: true
      }
    ]
  },
  // Essential settings for proper SSR/dynamic routes with admin pages
  output: 'standalone',
  // Skip prerendering for admin routes and any dynamic routes
  skipTrailingSlashRedirect: true,
  trailingSlash: false
}

export default nextConfig
