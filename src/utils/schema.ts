/**
 * SEO Schema Utilities
 *
 * This module provides utilities for generating JSON-LD structured data
 * for various content types in the website.
 */

import { BlogPost, Project } from './content-loader'

interface JsonLdAuthor {
  '@type': 'Person'
  name: string
  url?: string
}

interface JsonLdOrganization {
  '@type': 'Organization'
  name: string
  logo: {
    '@type': 'ImageObject'
    url: string
  }
  url?: string
}

interface BlogPostSchema {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  headline: string
  description: string
  author: JsonLdAuthor
  publisher: JsonLdOrganization
  datePublished: string
  dateModified: string
  image: string[]
  url: string
  keywords?: string
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
}

interface ProjectSchema {
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication'
  name: string
  description: string
  author: JsonLdAuthor
  publisher: JsonLdOrganization
  datePublished: string
  dateModified: string
  image: string[]
  url: string
  applicationCategory: string
  operatingSystem: string
  offers?: {
    '@type': 'Offer'
    url: string
  }
  codeRepository?: string
  keywords?: string
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
}

interface WebsiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  author: {
    '@type': 'Person'
    name: string
    url: string
  }
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateBlogPostSchema(
  post: BlogPost,
  url: string
): BlogPostSchema {
  // Define the base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'
  const imageUrl = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : `${baseUrl}${post.featuredImage || post.image || ''}`

  // Create author object
  const author: JsonLdAuthor = {
    '@type': 'Person',
    name: typeof post.author === 'string' ? post.author : 'Jeff Knowles Jr',
    url: `${baseUrl}/about`
  }

  // Create publisher organization
  const publisher: JsonLdOrganization = {
    '@type': 'Organization',
    name: 'JKJR Portfolio & Blog',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`
    },
    url: baseUrl
  }

  // Return the complete schema
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author,
    publisher,
    datePublished: post.datePublished || post.publishDate || '',
    dateModified:
      post.dateModified || post.datePublished || post.publishDate || '',
    image: imageUrl ? [imageUrl] : [],
    url,
    keywords: post.tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }
}

/**
 * Generate JSON-LD structured data for a project
 */
export function generateProjectSchema(
  project: Project,
  url: string
): ProjectSchema {
  // Define the base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'
  const imageUrl = project.featuredImage?.startsWith('http')
    ? project.featuredImage
    : `${baseUrl}${
        project.featuredImage ||
        project.contentImage ||
        project.thumbnailImage ||
        ''
      }`

  // Create author object
  const author: JsonLdAuthor = {
    '@type': 'Person',
    name:
      typeof project.author === 'string' ? project.author : 'Jeff Knowles Jr',
    url: `${baseUrl}/about`
  }

  // Create publisher organization
  const publisher: JsonLdOrganization = {
    '@type': 'Organization',
    name: 'JKJR Portfolio & Blog',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`
    },
    url: baseUrl
  }

  // Return the complete schema
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.excerpt,
    author,
    publisher,
    datePublished: project.datePublished || '',
    dateModified: project.dateModified || project.datePublished || '',
    image: imageUrl ? [imageUrl] : [],
    url,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: project.liveUrl
      ? {
          '@type': 'Offer',
          url: project.liveUrl
        }
      : undefined,
    codeRepository: project.githubUrl,
    keywords: project.tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }
}

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteSchema(): WebsiteSchema {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jeff Knowles Jr - Portfolio & Blog',
    url: baseUrl,
    description:
      'The portfolio and blog of Jeff Knowles Jr, featuring web development projects, technical articles, and tutorials.',
    author: {
      '@type': 'Person',
      name: 'Jeff Knowles Jr',
      url: `${baseUrl}/about`
    }
  }
}
