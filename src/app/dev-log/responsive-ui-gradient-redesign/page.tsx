import React from 'react'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Responsive UI and Gradient Design System | Development Log',
  description:
    'Implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.',
  openGraph: {
    title: 'Responsive UI and Gradient Design System | Development Log',
    description:
      'Implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.',
    type: 'article',
    publishedTime: '2024-04-04',
    authors: ['Jeff Knowles Jr'],
    tags: [
      'UI/UX',
      'Responsive Design',
      'CSS',
      'Tailwind',
      'Mobile Optimization'
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Responsive UI and Gradient Design System | Development Log',
    description:
      'Implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Responsive UI and Gradient Design System',
  description:
    'Implementation of a cohesive color scheme with gradient accents, responsive design improvements, and mobile-first optimization across the entire website.',
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
  datePublished: '2024-04-04',
  dateModified: '2024-04-04',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jeffknowlesjr.com/dev-log/responsive-ui-gradient-redesign'
  }
}

const content = `
# Responsive UI and Gradient Design System

## Overview

Today we completed a significant visual update to the website, implementing a cohesive gradient-based design system that creates a more engaging and modern user experience. These updates focused on three key areas: establishing a unified color scheme with gradient accents, enhancing responsiveness across all device sizes, and optimizing the mobile user experience.

## Implementation Details

### Gradient Design System

The website now features a coherent gradient-based design language that extends the hero section's aesthetic throughout the entire site:

- **Custom Gradient Variables**: Defined a set of CSS custom properties for gradient combinations in the site's color palette:
  - Primary gradient (teal shades)
  - Secondary gradient (purple shades)
  - Mixed gradient (teal to purple transitions)
  - Feature section backgrounds
  - Card hover effects

- **Dark Mode Compatibility**: Created parallel gradient definitions for dark mode with adjusted opacity and color values to maintain visual consistency while ensuring proper contrast in both light and dark themes.

Implementation example:
\`\`\`css
:root {
  /* Base colors */
  --color-primary-light: #5eead4;
  --color-primary: #14b8a6;
  --color-primary-dark: #0f766e;
  --color-secondary-light: #a855f7;
  --color-secondary: #7e22ce;
  --color-secondary-dark: #6b21a8;
  
  /* Gradient definitions */
  --gradient-primary: linear-gradient(120deg, #5eead4 0%, #14b8a6 100%);
  --gradient-secondary: linear-gradient(120deg, #a855f7 0%, #7e22ce 100%);
  --gradient-mixed: linear-gradient(120deg, #5eead4 0%, #a855f7 100%);
  --gradient-featured: linear-gradient(to right, rgba(20, 184, 166, 0.1), rgba(126, 34, 206, 0.1));
  --gradient-card-hover: linear-gradient(145deg, rgba(94, 234, 212, 0.1), rgba(168, 85, 247, 0.1));
}

/* Dark mode gradients */
:root[class~='dark'] {
  --gradient-primary: linear-gradient(120deg, #0f766e 0%, #134e4a 100%);
  --gradient-secondary: linear-gradient(120deg, #7e22ce 0%, #581c87 100%);
  --gradient-mixed: linear-gradient(120deg, #0f766e 0%, #7e22ce 100%);
  --gradient-featured: linear-gradient(to right, rgba(15, 118, 110, 0.2), rgba(107, 33, 168, 0.2));
  --gradient-card-hover: linear-gradient(145deg, rgba(15, 118, 110, 0.15), rgba(107, 33, 168, 0.15));
}
\`\`\`

- **Enhanced Component Classes**: Created a set of reusable component classes utilizing these gradients:
  - \`.btn-gradient-primary\`, \`.btn-gradient-secondary\`, and \`.btn-gradient-mixed\` for buttons
  - \`.section-gradient-light\` for section backgrounds
  - \`.feature-box\` for content highlighting
  - \`.border-gradient-card\` for cards with gradient borders on hover

- **Interactive Hover States**: Added subtle gradient transitions on interactive elements to enhance perceived depth and provide clear visual feedback.

### Responsive Design Enhancements

The site now delivers a fully responsive experience with intelligent adaptations for different viewport sizes:

- **Responsive Typography System**: Implemented a comprehensive responsive typography scale that adjusts text size, line height, and spacing based on viewport width:
  - Base heading scale: h1 (3xl → 6xl), h2 (2xl → 4xl), h3 (xl → 3xl)
  - Body text scale: text-sm → text-lg
  - Proper line heights and letter spacing for optimal readability

Implementation example:
\`\`\`css
/* Responsive typography */
h1 {
  @apply text-3xl sm:text-4xl md:text-5xl lg:text-6xl;
}

h2 {
  @apply text-2xl sm:text-3xl md:text-4xl;
}

h3 {
  @apply text-xl sm:text-2xl md:text-3xl;
}

p {
  @apply text-sm sm:text-base md:text-lg;
}
\`\`\`

- **Responsive Spacing Utilities**: Created a set of spacing utilities that adapt to screen size:
  - \`.space-responsive\` (p-4 → p-10)
  - \`.space-responsive-y\` (py-4 → py-10)
  - \`.space-responsive-x\` (px-4 → px-10)

- **Container and Grid Refinements**: Adjusted container padding and grid layouts to provide optimal content density at each breakpoint.

- **Adaptive Content Display**: Implemented solutions for displaying content differently across breakpoints:
  - Simplified date formats on mobile
  - Truncated long text with ellipsis
  - Limited the number of visible tags on smaller screens
  - Adjusted image aspect ratios

### Mobile-First Optimization

A comprehensive mobile-first approach ensures an excellent experience on smartphones and tablets:

- **Responsive Navigation**: Completely redesigned the mobile navigation:
  - Added a slide-in menu panel with smooth animations
  - Improved touch targets for better usability (minimum 44px size)
  - Implemented body scroll locking when the menu is open
  - Ensured proper menu closing on navigation

Implementation example:
\`\`\`jsx
// Mobile menu component example
<div 
  className={\`mobile-menu \${isMenuOpen ? 'open' : 'closed'}\`}
  aria-hidden={!isMenuOpen}
>
  <div className='h-full flex flex-col bg-white dark:bg-gray-800 w-[80%] max-w-sm p-6'>
    {/* Menu content would go here */}
  </div>
</div>

// CSS for mobile menu
.mobile-menu {
  @apply fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transform transition-transform duration-300 ease-in-out;
}

.mobile-menu.closed {
  @apply -translate-x-full;
}

.mobile-menu.open {
  @apply translate-x-0;
}
\`\`\`

- **Blog Card Optimization**: Extensively refined the BlogCard component:
  - Added responsive padding and font sizes
  - Implemented line clamping for text
  - Created compact mobile-friendly layouts
  - Added touch-friendly hover states with \`@media (hover: hover)\` to avoid stuck hover states on touch devices

- **Layout Restructuring**: Reordered layout elements for mobile devices:
  - Moved sidebar to top on mobile, right on desktop
  - Adjusted column counts based on screen width
  - Used flex order to control visual hierarchy

- **Better Touch Interactions**: Added the \`.touch-target\` utility class to ensure touch targets meet accessibility standards.

### Performance Considerations

While implementing these visual changes, we maintained a strong focus on performance:

- **Optimized Gradients**: Used subtle gradients with low opacity to minimize rendering complexity
- **Transition Optimizations**: Limited animations to transform and opacity properties for better performance
- **Conditional Rendering**: Implemented conditional rendering for complex UI elements on mobile devices
- **Reduced Motion Option**: Added support for the prefers-reduced-motion media query for users who prefer minimal animations

## Results

The visual updates have resulted in:

1. **Cohesive Brand Identity**: A more unified visual language that reinforces the brand's identity
2. **Improved User Experience**: More intuitive navigation and interaction patterns
3. **Better Mobile Engagement**: Optimized mobile experience leading to longer session times
4. **Maintained Performance**: Visual enhancements without compromising load times or interactivity

## Next Steps

1. **User Testing**: Gather feedback on the new design system from actual users
2. **Analytics Integration**: Set up event tracking to measure engagement with new interactive elements
3. **Component Documentation**: Create a comprehensive design system documentation

These visual enhancements lay the groundwork for a more engaging, accessible, and cohesive user experience while ensuring the site remains performant across all devices.

![UI Design System](https://example.com/images/design-system-preview.jpg)
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
      <pre
        className={`language-${match[1]} rounded-lg p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto`}
      >
        <code className={`language-${match[1]}`} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code
        className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono'
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <Script
        id='structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='prose prose-blue dark:prose-invert max-w-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ code: codeBlock }}
        >
          {content}
        </ReactMarkdown>
      </div>
      <div className='mt-8 pt-8 border-t border-gray-200 dark:border-gray-700'>
        <a
          href='/dev-log'
          className='text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors'
        >
          ← Back to Development Log
        </a>
      </div>
    </div>
  )
}
