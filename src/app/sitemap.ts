import { MetadataRoute } from 'next'
import { getContentList, BlogPost } from '@/utils/content-loader'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const blogPosts = await getContentList<BlogPost>('blog')

  // Base URL of the site
  const baseUrl = 'https://jeffknowlesjr.com'

  // Generate blog post entries
  const blogPostEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified || post.datePublished),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }))

  // Static routes of the site
  const routes = [
    '',
    '/blog',
    '/projects',
    '/contact',
    '/dev-log',
    '/site-map',
    '/resources',
    '/projects/project-zero-documentation',
    '/projects/project-omega-documentation'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9
  }))

  // Add style sheet reference to the sitemap
  const sitemapWithStyle = [...routes, ...blogPostEntries].map((entry) => ({
    ...entry,
    // Add style sheet reference for XML viewing
    _attributes: {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation':
        'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
      'xmlns:xsl': 'http://www.w3.org/1999/XSL/Transform',
      'xsl:version': '2.0'
    }
  }))

  return sitemapWithStyle
}
