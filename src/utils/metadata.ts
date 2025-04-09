import { Metadata } from 'next'
import { BlogPost, Project } from './content-loader'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jeffknowlesjr.com'

/**
 * Generates base metadata for the site
 */
export function generateBaseMetadata(): Metadata {
  return {
    title: {
      template: '%s | Jeff Knowles Jr',
      default: 'Jeff Knowles Jr - Portfolio & Blog'
    },
    description:
      'Personal portfolio and blog showcasing web development projects, technical articles, and professional services by Jeff Knowles Jr.',
    keywords: [
      'web development',
      'frontend',
      'backend',
      'full-stack',
      'react',
      'nextjs',
      'javascript',
      'typescript',
      'portfolio',
      'blog'
    ],
    metadataBase: new URL(BASE_URL),
    authors: [{ name: 'Jeff Knowles Jr', url: `${BASE_URL}/about` }],
    creator: 'Jeff Knowles Jr',
    publisher: 'Jeff Knowles Jr',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    formatDetection: {
      email: true,
      address: true,
      telephone: true
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: BASE_URL,
      siteName: 'Jeff Knowles Jr',
      title: 'Jeff Knowles Jr - Portfolio & Blog',
      description:
        'Personal portfolio and blog showcasing web development projects, technical articles, and professional services.',
      images: [
        {
          url: `${BASE_URL}/images/projects/project-project-omega-cover.webp`,
          width: 1200,
          height: 630,
          alt: 'Project Omega - Jeff Knowles Jr Portfolio'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: 'Jeff Knowles Jr - Portfolio & Blog',
      description:
        'Personal portfolio and blog showcasing web development projects, technical articles, and professional services.',
      images: [`${BASE_URL}/images/projects/project-project-omega-cover.webp`]
    }
  }
}

/**
 * Generates metadata for a blog post
 */
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const postUrl = `${BASE_URL}/blog/${post.slug}`
  const imageUrl = post.featuredImage || post.image || '/images/og-default.jpg'
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${BASE_URL}${imageUrl}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.datePublished || post.publishDate,
      modifiedTime: post.dateModified || post.datePublished || post.publishDate,
      authors: [
        typeof post.author === 'string' ? post.author : 'Jeff Knowles Jr'
      ],
      tags: post.tags,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: post.title,
      description: post.excerpt,
      images: [fullImageUrl]
    },
    alternates: {
      canonical: postUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

/**
 * Generates metadata for the main blog page
 */
export function generateBlogIndexMetadata(): Metadata {
  const blogUrl = `${BASE_URL}/blog`

  return {
    title: 'Blog',
    description:
      'Read articles about web development, programming, and technology written by Jeff Knowles Jr.',
    openGraph: {
      type: 'website',
      url: blogUrl,
      title: 'Blog | Jeff Knowles Jr',
      description:
        'Technical articles and insights about web development, cloud architecture, and analytics engineering.',
      images: [
        {
          url: `${BASE_URL}/images/projects/project-project-omega-cover.webp`,
          width: 1200,
          height: 630,
          alt: 'Project Omega - Jeff Knowles Jr Blog'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: 'Blog | Jeff Knowles Jr',
      description:
        'Technical articles and insights about web development, cloud architecture, and analytics engineering.',
      images: [`${BASE_URL}/images/projects/project-project-omega-cover.webp`]
    },
    alternates: {
      canonical: blogUrl
    }
  }
}

/**
 * Generates metadata for a project
 */
export function generateProjectMetadata(project: Project): Metadata {
  const projectUrl = `${BASE_URL}/projects/${project.slug}`
  const imageUrl =
    project.featuredImage ||
    project.contentImage ||
    project.thumbnailImage ||
    '/images/og-default.jpg'
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${BASE_URL}${imageUrl}`

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      type: 'article',
      url: projectUrl,
      title: project.title,
      description: project.excerpt,
      publishedTime: project.datePublished,
      modifiedTime: project.dateModified || project.datePublished,
      authors: [
        typeof project.author === 'string' ? project.author : 'Jeff Knowles Jr'
      ],
      tags: project.tags,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: project.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: project.title,
      description: project.excerpt,
      images: [fullImageUrl]
    },
    alternates: {
      canonical: projectUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

/**
 * Generates metadata for the projects index page
 */
export function generateProjectsIndexMetadata(): Metadata {
  const projectsUrl = `${BASE_URL}/projects`

  return {
    title: 'Projects',
    description:
      'Explore web development projects by Jeff Knowles Jr, including full-stack applications, cloud architecture, and more.',
    openGraph: {
      type: 'website',
      url: projectsUrl,
      title: 'Projects | Jeff Knowles Jr',
      description:
        'Portfolio of web development projects showcasing frontend, backend, and full-stack development skills.',
      images: [
        {
          url: `${BASE_URL}/images/projects/project-project-omega-cover.webp`,
          width: 1200,
          height: 630,
          alt: 'Project Omega - Jeff Knowles Jr Projects'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: 'Projects | Jeff Knowles Jr',
      description:
        'Portfolio of web development projects showcasing frontend, backend, and full-stack development skills.',
      images: [`${BASE_URL}/images/projects/project-project-omega-cover.webp`]
    },
    alternates: {
      canonical: projectsUrl
    }
  }
}

/**
 * Generates metadata for a category page
 */
export function generateCategoryMetadata(
  category: string,
  description: string
): Metadata {
  const categoryUrl = `${BASE_URL}/blog/category/${category}`

  return {
    title: `${category} | Blog Categories`,
    description: description,
    openGraph: {
      type: 'website',
      url: categoryUrl,
      title: `${category} | Blog Categories | Jeff Knowles Jr`,
      description: description,
      images: [
        {
          url: `${BASE_URL}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${category} Category | Jeff Knowles Jr Blog`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: `${category} | Blog Categories | Jeff Knowles Jr`,
      description: description
    },
    alternates: {
      canonical: categoryUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

/**
 * Generates metadata for a tag page
 */
export function generateTagMetadata(tag: string): Metadata {
  const tagUrl = `${BASE_URL}/blog/tag/${tag}`
  const description = `Browse all blog posts tagged with ${tag}.`

  return {
    title: `${tag} | Blog Tags`,
    description: description,
    openGraph: {
      type: 'website',
      url: tagUrl,
      title: `${tag} | Blog Tags | Jeff Knowles Jr`,
      description: description,
      images: [
        {
          url: `${BASE_URL}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${tag} Tag | Jeff Knowles Jr Blog`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jeffknowlesjr',
      creator: '@jeffknowlesjr',
      title: `${tag} | Blog Tags | Jeff Knowles Jr`,
      description: description
    },
    alternates: {
      canonical: tagUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}
