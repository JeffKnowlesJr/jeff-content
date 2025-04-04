# JSON-LD Structured Data Implementation

This document outlines the implementation of JSON-LD structured data for SEO purposes across the website.

## Overview

JSON-LD (JavaScript Object Notation for Linked Data) provides search engines with structured data that helps them understand the content of our pages. This implementation enhances our SEO by enabling rich results in search engine results pages (SERPs).

## Implementation Details

### Utility Functions

The implementation is based on a set of utility functions in `src/utils/schema.ts` that generate schema.org-compliant JSON-LD data:

- `generateBlogPostSchema`: Creates schema for blog posts using the BlogPosting type
- `generateProjectSchema`: Creates schema for projects using the SoftwareApplication type
- `generateWebsiteSchema`: Creates schema for the overall website

### Integration Points

Structured data is integrated at multiple levels:

1. **Root Level (Website Schema)**

   - Located in: `src/app/layout.tsx`
   - Schema Type: `WebSite`
   - Purpose: Identifies the website as a whole, providing general information

2. **Blog Post Level**

   - Located in: `src/app/blog/[slug]/page.tsx`
   - Schema Type: `BlogPosting`
   - Purpose: Provides detailed metadata about individual blog posts

3. **Project Level**
   - Located in: `src/app/projects/[slug]/page.tsx`
   - Schema Type: `SoftwareApplication`
   - Purpose: Provides detailed metadata about individual projects

### Schema Types Used

- **WebSite**: General website information
- **BlogPosting**: Blog posts with author, dates, and content information
- **SoftwareApplication**: Projects with technical specifications
- **Person**: Author information
- **Organization**: Publisher information

## Implementation Method

All JSON-LD data is delivered via Next.js `<Script>` components with the following pattern:

```jsx
<Script
  id='unique-id-for-the-script'
  type='application/ld+json'
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdObject) }}
/>
```

## Testing & Validation

Schema validation can be performed using:

1. [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)

## Future Enhancements

Potential improvements to consider:

1. **BreadcrumbList schema**: Add breadcrumb structured data to improve navigation signals
2. **FAQ schema**: For FAQ sections or pages
3. **HowTo schema**: For tutorial content
4. **Event schema**: For upcoming events or webinars
5. **VideoObject schema**: For any video content

## References

- [Schema.org Documentation](https://schema.org/docs/schemas.html)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [JSON-LD Website](https://json-ld.org/)
