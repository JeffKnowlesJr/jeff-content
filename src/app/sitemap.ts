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

  // Extract all unique tags from blog posts
  const allTags = blogPosts.reduce((tags, post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
    return tags
  }, [] as string[])

  // Generate tag page entries
  const tagEntries = allTags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))

  // Static routes of the site
  const routes = [
    '',
    '/blog',
    '/projects',
    '/contact',
    '/dev-log',
    '/site-map'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.9
  }))

  return [...routes, ...blogPostEntries, ...tagEntries]
}
