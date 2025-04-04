import React from 'react'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Initial SEO Implementation | Development Log',
  description:
    'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
  openGraph: {
    title: 'Initial SEO Implementation | Development Log',
    description:
      'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
    type: 'article',
    publishedTime: '2024-03-20',
    authors: ['Jeff Knowles Jr'],
    tags: ['SEO', 'Next.js', 'Performance', 'Structured Data']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Initial SEO Implementation | Development Log',
    description:
      'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Initial SEO Implementation',
  description:
    'A comprehensive overview of implementing SEO best practices, including metadata, structured data, and performance optimizations for the JKJR Portfolio & Blog.',
  author: {
    '@type': 'Person',
    name: 'Jeff Knowles Jr',
    url: 'https://jeffknowlesjr.com'
  },
  publisher: {
    '@type': 'Organization',
    name: 'JKJR Portfolio & Blog',
    logo: {
      '@type': 'ImageObject',
      url: 'https://jeffknowlesjr.com/logo.png'
    }
  },
  datePublished: '2024-03-20',
  dateModified: '2024-03-20',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jeffknowlesjr.com/dev-log/initial-seo-implementation'
  }
}

const content = `
# Initial SEO Implementation

## Overview

Today marks a significant milestone in the development of the JKJR Portfolio & Blog website. We've implemented comprehensive SEO optimizations to ensure the site performs exceptionally well in search engines while providing a rich experience for users. Search engines have become increasingly sophisticated, and our approach needed to balance technical excellence with content quality.

## Implementation Details

### Metadata Implementation

We've implemented a robust metadata system using Next.js 13's Metadata API, which includes:

- **Dynamic page titles and descriptions**: Each page now has unique, descriptive titles and meta descriptions that accurately summarize the content while incorporating relevant keywords. We've kept titles under 60 characters and descriptions under 160 characters for optimal display in search results.

- **OpenGraph metadata for social sharing**: When our content is shared on platforms like Facebook, LinkedIn, or Slack, it now displays rich previews with proper images, titles, and descriptions using the OpenGraph protocol. This significantly increases click-through rates from social platforms.

- **Twitter card metadata**: Similarly, Twitter-specific card metadata ensures our content looks professional when shared on Twitter, with large image previews and properly formatted text.

- **Canonical URLs**: To prevent duplicate content issues, we've implemented canonical URLs that tell search engines which version of a page is the "master" copy, especially important for content that may be accessible through multiple URLs.

- **Language specifications**: We've properly declared the language of our content using the \`lang\` attribute and metadata, helping search engines understand and correctly index our content for the appropriate audience.

- **Viewport configurations**: Mobile optimization is critical for SEO, so we've implemented proper viewport settings to ensure the site renders correctly across all devices.

Implementation example:
\`\`\`typescript
export const metadata: Metadata = {
  title: 'Page Title | Site Name',
  description: 'Concise, compelling description of page content',
  openGraph: {
    title: 'Page Title | Site Name',
    description: 'Slightly expanded description for social sharing',
    type: 'article',
    publishedTime: '2024-03-20'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title | Site Name'
  }
}
\`\`\`

### Structured Data Implementation

We've added JSON-LD structured data to help search engines better understand our content:

- **Blog posts and articles**: Each blog post now includes Article schema with proper author attribution, publish dates, and content categorization, making them eligible for rich snippets in search results.

- **Development log entries**: Similar to blog posts, but using TechArticle schema to better represent the technical nature of these entries.

- **Project showcases**: Using CreativeWork and SoftwareApplication schemas to properly represent our project portfolio items with appropriate technical attributes.

- **Organization information**: Implementation of Organization schema with proper logo, contact information, and social profiles to enhance knowledge graph representation.

- **Person information**: Author and team member information is structured using Person schema, connecting content to its creators.

- **Breadcrumb navigation**: BreadcrumbList schema implementation helps search engines understand the site hierarchy and can result in enhanced search results with breadcrumb paths displayed.

Implementation example:
\`\`\`javascript
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Article Title',
  description: 'Article description text',
  author: {
    '@type': 'Person',
    name: 'Author Name'
  },
  datePublished: '2024-03-20'
}
\`\`\`

### Performance Optimizations

To ensure optimal SEO performance (as page speed is a ranking factor), we've implemented:

- **Image optimization with next/image**: All images are now automatically optimized, properly sized, and served in modern formats like WebP with appropriate fallbacks. This dramatically reduces page weight and improves loading times. The implementation includes lazy loading for images below the fold.

- **Font optimization with next/font**: We're using Next.js font optimization to serve self-hosted fonts with proper font-display settings, eliminating render-blocking resources and preventing layout shifts.

- **Route prefetching**: Strategic prefetching of likely next pages based on user navigation patterns improves perceived performance and reduces bounce rates.

- **Dynamic imports for code splitting**: Non-critical JavaScript is now loaded on-demand, significantly improving initial page load time and Time To Interactive metrics.

- **CSS optimization with Tailwind**: Using Tailwind's JIT mode ensures we only ship the CSS actually used on each page, dramatically reducing stylesheet size.

- **Server-side rendering for critical pages**: Key landing pages use SSR to ensure critical content is delivered in the initial HTML payload, improving both perceived performance and indexability.

Implementation example:
\`\`\`jsx
// Image optimization
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/images/example.jpg"
      width={800}
      height={600}
      alt="Descriptive alt text"
      priority={true} // For above-the-fold images
    />
  )
}
\`\`\`

### Technical SEO

Additional technical SEO implementations include:

- **XML sitemap generation**: Automated dynamic sitemap generation that updates as content changes, ensuring search engines can discover all indexable content. The sitemap includes lastmod dates and priority hints.

- **Robots.txt configuration**: Custom robots.txt with appropriate directives to guide crawler behavior, including sitemap location and crawl-delay suggestions.

- **404 page optimization**: Custom 404 pages with proper status codes, useful navigation options, and tracking to identify missing content or broken links.

- **Mobile responsiveness**: Comprehensive mobile-first approach throughout the codebase, ensuring perfect rendering across all device sizes with no horizontal scrolling or tap target issues.

- **Core Web Vitals optimization**: Focused optimization on LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift) metrics to pass all Core Web Vitals thresholds.

- **Semantic HTML structure**: Proper use of HTML5 semantic elements (article, section, nav, etc.) throughout the site to create a meaningful content hierarchy that search engines can parse effectively.

Implementation example:
\`\`\`jsx
// Semantic HTML structure
export function BlogPost() {
  return (
    <article>
      <header>
        <h1>Article Title</h1>
        <time dateTime="2024-03-20">March 20, 2024</time>
      </header>
      <section>
        <h2>First Section</h2>
        <p>Content with <mark>highlighted</mark> terms</p>
      </section>
      <footer>
        <p>Author: <address>Author Name</address></p>
      </footer>
    </article>
  )
}
\`\`\`

## Challenges and Solutions

### Challenge 1: Dynamic Metadata

Implementing dynamic metadata for different page types while maintaining consistency was a significant challenge. Pages with server-side data fetching needed to generate metadata that accurately represented their unique content.

**Solution**: Created a metadata utility system that generates consistent metadata based on page type and content. This system includes:

- A base metadata template with site-wide defaults
- Type-specific enhancers (blog, project, etc.)
- Fallback mechanisms for missing data
- Truncation utilities to ensure titles and descriptions stay within optimal length limits

\`\`\`typescript
// Example metadata utility
export function generateBlogMetadata(post) {
  return {
    title: post.title + ' | JKJR Blog',
    description: 'Blog post excerpt truncated to optimal length',
    openGraph: {
      // OG-specific formatting
    }
  }
}
\`\`\`

### Challenge 2: Structured Data Validation

Ensuring structured data is valid and properly formatted across the site was challenging due to the variety of content types and the complexity of nested JSON-LD objects.

**Solution**: Implemented a validation system using Schema.org's validation tools and added automated checks in the build process. This includes:

- Type-safe schema builders with TypeScript
- Pre-commit hooks that validate schema against Schema.org specifications
- Integration with Google's Structured Data Testing Tool API
- Runtime validation in development mode with console warnings

## Resources

These resources were invaluable during our SEO implementation:

- [Next.js Metadata API Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search) - Comprehensive guidelines direct from Google
- [Schema.org](https://schema.org/) - The definitive source for structured data formats
- [web.dev](https://web.dev/) - Performance optimization best practices
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - For auditing and improvement recommendations
- [Wattspeed](https://www.wattspeed.com/) - For competitive performance analysis
- [Ahrefs](https://ahrefs.com/) - For keyword research and competitive analysis

## Next Steps

Our SEO journey isn't over. Future enhancements will include:

1. **Analytics integration**: Implementing comprehensive analytics with custom events and conversion tracking to measure SEO effectiveness.

2. **Additional structured data types**: Expanding structured data coverage to include FAQ, HowTo, and Product schemas where appropriate.

3. **Voice search optimization**: Enhancing content with conversational phrases and question-based headings to capture voice search traffic.

4. **Internationalization**: Adding hreflang tags and localized content to target international audiences properly.

5. **Breadcrumb navigation**: Implementing visible breadcrumb navigation to match our structured data and improve user experience.

## Conclusion

The initial SEO implementation provides a solid foundation for the website's search engine visibility and user experience. The combination of technical optimizations, structured data, and metadata ensures that the site is well-positioned for search engines while maintaining high performance and accessibility standards.

Remember, SEO is not a one-time task but an ongoing process. We'll continue to monitor performance, adapt to algorithm changes, and refine our approach based on data. As one wise SEO expert once said, "The best place to hide a body is page 2 of Google search results" - so we'll make sure we stay on page 1!
`

export default function DevLogEntry() {
  const codeBlock = ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean
    className?: string
    children?: React.ReactNode
  }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className='relative group'>
        <pre className={`${className} overflow-x-auto`}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <>
      <Script
        id='json-ld'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='min-h-screen'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <article className='prose dark:prose-invert max-w-none'>
            <header className='mb-8'>
              <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                Initial SEO Implementation
              </h1>
              <div className='flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300'>
                <time dateTime='2024-03-20'>
                  {new Date('2024-03-20').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <div className='flex flex-wrap gap-2'>
                  {['SEO', 'Next.js', 'Performance', 'Structured Data'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </header>

            <div className='markdown-content'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: codeBlock
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
