import React from 'react'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'SEO Metadata Implementation | Development Log',
  description:
    'A detailed breakdown of implementing comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.',
  openGraph: {
    title: 'SEO Metadata Implementation | Development Log',
    description:
      'A detailed breakdown of implementing comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.',
    type: 'article',
    publishedTime: '2024-04-16',
    authors: ['Jeff Knowles Jr'],
    tags: [
      'SEO',
      'Next.js',
      'OpenGraph',
      'Twitter Cards',
      'Metadata API',
      'Structured Data'
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Metadata Implementation | Development Log',
    description:
      'A detailed breakdown of implementing comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline:
    'SEO Metadata Implementation: OpenGraph, Twitter Cards, and Canonical URLs',
  description:
    'A detailed breakdown of implementing comprehensive metadata for SEO optimization across the website, including social sharing tags and structured data integration.',
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
  datePublished: '2024-04-16',
  dateModified: '2024-04-16',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jeffknowlesjr.com/dev-log/seo-metadata-implementation'
  }
}

const content = `
# SEO Metadata Implementation: OpenGraph, Twitter Cards, and Canonical URLs

Today I completed a comprehensive metadata implementation for my Next.js website, greatly enhancing its SEO capabilities and social sharing presentation. This builds upon the JSON-LD structured data work I completed previously, creating a complete SEO foundation.

## The Problem

While working on the AWS Amplify deployment, I realized that although I had successfully implemented JSON-LD structured data, the site was still missing critical metadata for social sharing and SEO. Specifically:

1. The site needed proper OpenGraph tags to control how content appears when shared on platforms like Facebook, LinkedIn, and Slack
2. Twitter Card metadata was missing, meaning shared links wouldn't display rich previews
3. Canonical URLs weren't properly specified, potentially leading to duplicate content issues
4. The site lacked consistency in metadata across different page types

## The Solution

I created a robust and centralized metadata generation system using Next.js 13's Metadata API. The solution revolves around two key components:

### 1. Utility Functions for Metadata Generation

I created a dedicated \`metadata.ts\` utility file containing specialized functions for generating consistent metadata across different page types:

- \`generateBaseMetadata()\` - Core site-wide metadata
- \`generateBlogPostMetadata()\` - Individual blog post metadata
- \`generateBlogIndexMetadata()\` - Blog listing page metadata
- \`generateProjectMetadata()\` - Individual project metadata
- \`generateProjectsIndexMetadata()\` - Projects listing page metadata
- \`generateCategoryMetadata()\` and \`generateTagMetadata()\` - Category/tag pages

Each function generates appropriate metadata for its context, handling all the complexities of:
- Constructing proper URLs
- Selecting appropriate images with fallbacks
- Formatting dates correctly
- Creating OpenGraph and Twitter Card tags
- Setting canonical URLs

### 2. Page-Level Integration

With the utility functions in place, I then updated all key page templates to leverage them:

\`\`\`typescript
// Example from a blog post page
export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const post = await getContentBySlug<BlogPost>('blog', params.slug)

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return generateBlogPostMetadata(post)
}
\`\`\`

This pattern is repeated across all content-specific pages, ensuring consistency while maintaining unique metadata per page.

## Technical Details

### Metadata Structure

Each page now includes:

- **Basic metadata**: title, description, keywords, authors
- **OpenGraph tags**: for Facebook, LinkedIn, and other platforms
- **Twitter Card tags**: optimized for Twitter sharing
- **Canonical URLs**: to prevent duplicate content issues
- **Publication dates**: for content-specific pages

### Fallback Strategies

I implemented intelligent fallbacks throughout the system:

1. **Images**: Content-specific images are used where available, defaulting to generic site images when necessary
2. **Dates**: Multiple date fields are checked (datePublished, publishDate) to ensure consistency
3. **Authors**: Content-specific authors appear when specified, otherwise defaults to site author
4. **Descriptions**: Content excerpts are used where available, with sensible defaults for index pages

### Documentation

I created detailed documentation in \`docs/METADATA_IMPLEMENTATION.md\` to explain the architecture, best practices, and testing procedures for the metadata system.

## Integration with Structured Data

This metadata implementation complements the JSON-LD structured data I added previously. Together, they provide:

- **Structured data**: Deep semantic meaning for search engines
- **OpenGraph/Twitter tags**: Rich previews when sharing on social media
- **Basic metadata**: Proper indexing signals for search engines

## Testing

I've tested the implementation using:

1. Facebook's Sharing Debugger
2. Twitter Card Validator
3. LinkedIn Post Inspector
4. Manual inspection of page source

The tests confirm that the site now generates appropriate metadata for all page types, with proper social sharing previews and canonical URLs.

## Future Considerations

While the implementation is robust, there are a few areas for potential future enhancement:

1. **Automated Image Generation**: Creating dedicated social sharing images automatically
2. **AB Testing**: Experimenting with different meta descriptions to optimize CTR
3. **Schema Extensions**: Adding more specialized structured data types for specific content

## Conclusion

The metadata implementation marks a significant step in optimizing the site for both search engines and social sharing. With proper OpenGraph tags, Twitter Cards, and canonical URLs in place, the site's content should now appear correctly when shared across various platforms, while also sending clearer signals to search engines about content relationships and priority.

Combined with the previously implemented JSON-LD structured data, the site now has a comprehensive SEO foundation that follows best practices and prepares it for optimal discoverability.
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
        <pre className={`${className} overflow-x-auto p-4 rounded-lg`}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    ) : (
      <code className={`${className} px-1 py-0.5 rounded text-sm`} {...props}>
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
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <article className='prose dark:prose-invert max-w-none'>
          <header className='mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              SEO Metadata Implementation
            </h1>
            <div className='flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300'>
              <time dateTime='2024-04-16'>
                {new Date('2024-04-16').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <div className='flex flex-wrap gap-2'>
                {[
                  'SEO',
                  'Next.js',
                  'OpenGraph',
                  'Twitter Cards',
                  'Metadata API',
                  'Structured Data'
                ].map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full'
                  >
                    {tag}
                  </span>
                ))}
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
    </>
  )
}
