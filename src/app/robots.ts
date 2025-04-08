import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/unauthorized',
        // Don't allow crawling of non-existent paths
        '/*.json$',
        '/*.xml$',
        '/404'
      ]
    },
    sitemap: 'https://jeffknowlesjr.com/sitemap.xml'
  }
}
