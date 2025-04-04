/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  eslint: {
    // Also ignore ESLint errors during build
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['d309xicbd1a46e.cloudfront.net']
  }
}

export default nextConfig
