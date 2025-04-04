# Visual System Documentation

## Design Principles

### Layout

- Consistent padding system using Tailwind's spacing scale
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Maximum content width of 1280px (max-w-7xl)
- Flexible grid system using CSS Grid and Flexbox
- Custom padding: page-mobile (1.5rem), page-desktop (3rem)

### Typography

- Font stack:
  - Sans: Inter var (primary UI font)
  - Serif: Merriweather (blog content)
- Font loading via Next.js font optimization
- Variable font support
- Responsive text adjustments

### Color System

- Primary Colors:
  ```css
  --color-primary-light: #5eead4
  --color-primary: #14b8a6
  --color-primary-dark: #0f766e
  ```
- Complement Colors:
  ```css
  --color-complement-light: #9ca3af
  --color-complement: #4b5563
  --color-complement-dark: #1f2937
  ```
- Secondary Colors:
  ```css
  --color-secondary-light: #a855f7
  --color-secondary: #7e22ce
  --color-secondary-dark: #6b21a8
  ```
- Theme Colors:
  ```css
  --color-cream-bg: #f8f5f0
  --color-cream-accent: #f0ece3
  ```
- Dark mode support with smooth transitions

## Components

### Header

- Height: 96px (h-24)
- Logo dimensions: 48px height
- Navigation spacing: 24px between items
- Mobile menu breakpoint: 768px

### Content Cards

- Rounded corners: 8px (rounded-lg)
- Shadow: shadow-lg for depth, shadow-xl on hover
- Hover states with smooth transitions and Y-axis translation (-translate-y-1)
- Consistent padding: 24px (p-6)
- Background: white (dark mode: gray-800)
- Full height card: flex flex-col to ensure consistent height

### Blog Cards

- Grid layout: 1 column on mobile, 2 columns on md+ screens
- Image aspect ratio: aspect-video
- Image treatment: object-cover
- Title: Text-xl, font-bold
- Meta information: text-sm, text-gray-500
  - Author name
  - Publication date
  - Reading time
- Tag pills: px-3 py-1, rounded-full, bg-gray-100 (dark: bg-gray-700)
- "Read more" link with arrow and hover effect

### Project Cards

- Grid layout: 1 column on mobile, 2 columns on md+ screens
- Image aspect ratio: aspect-video
- Image treatment: object-cover
- Title: Text-xl, font-bold
- Technology tags: Limited to 4 visible, with "+X more" indicator
- Link treatments:
  - "View Details" with arrow and transition
  - GitHub link with external icon
- Call-to-action buttons on detail pages

### Blog Post Detail

- Back navigation link with left arrow
- Full-width featured image
- Content header with:
  - Title (text-4xl)
  - Author with icon
  - Date with icon
  - Reading time with icon
  - Tag pills
- Content styling with typography classes
- Social sharing section with:
  - Twitter/X
  - LinkedIn
  - Facebook

### Project Detail

- Back navigation link with left arrow
- Full-width featured image
- Content header with:
  - Title (text-4xl)
  - Technology tag pills
  - Live demo and GitHub buttons
- Content styling with typography classes
- Social sharing with LinkedIn and Twitter/X

## Animation System

### Transitions

- Duration: 300ms (duration-200)
- Easing: cubic-bezier(0.4, 0, 0.2, 1) (transition)
- Page transitions with fade
- Menu animations

### Card Animations

- Hover lift: transform scale (hover:-translate-y-1)
- Shadow deepening: shadow-lg to shadow-xl on hover
- Image overlay: gradient overlay appears on hover with opacity transition
- Link animations: translate-x-1 on hover for arrows and buttons

### Background

- Canvas-based line art
- Responsive to viewport size
- Performance optimized
- Theme-aware colors

### Hover States

- Scale: 1.02 for subtle growth
- Shadow increase
- Color shifts
- Cursor feedback

## Image System

### Blog Images

- Featured: 1200x675px (16:9)
- Thumbnails: 400x225px
- WebP with PNG fallback
- Lazy loading enabled
- Image paths:
  - Featured: /images/blog/featured/[filename].jpg
  - Content: /images/blog/content/[filename].jpg

### Project Images

- Featured: 1600x900px
- Thumbnails: 600x450px
- Gallery: 800x600px
- Optimized for retina
- Image paths:
  - Featured: /images/projects/[filename].jpg
  - Content: /images/projects/content/[filename].jpg

### Logo

- SVG preferred
- PNG fallback: 192x192px
- Favicon set: 16px to 192px
- Dark mode variants

## Responsive Design

### Mobile First

- Base styles for small screens
- Progressive enhancement
- Touch-friendly targets (min 44px)
- Simplified navigation

### Tablet

- Two column layouts
- Larger typography
- Enhanced hover states
- Expanded navigation

### Desktop

- Full navigation
- Maximum widths
- Refined animations
- Rich interactions
- Blog sidebar visible (lg:col-span-1)

## Responsive Grid System

### Container System

- container class for controlled width
- mx-auto for centering
- px-4 base padding
- Full width on mobile, constrained on larger screens

### Grid System

- Blog List:

  ```html
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div class="lg:col-span-3">
      <!-- Blog posts in grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Blog cards -->
      </div>
    </div>
    <div class="lg:col-span-1">
      <!-- Sidebar -->
    </div>
  </div>
  ```

- Projects List:
  ```html
  <div class="max-w-4xl mx-auto">
    <!-- Projects intro -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Project cards -->
    </div>
  </div>
  ```

### Card Grid Item

```html
<article
  class="card overflow-hidden shadow-lg rounded-lg bg-white dark:bg-gray-800 h-full flex flex-col"
>
  <div class="aspect-video relative">
    <!-- Image -->
  </div>
  <div class="p-6 flex-grow flex flex-col">
    <!-- Content -->
    <div class="mt-auto">
      <!-- Footer content (tags, metadata) -->
    </div>
  </div>
</article>
```

## Performance Guidelines

### Images

- WebP format primary
- Fallback formats
- Lazy loading
- Size optimization

### Animations

- GPU acceleration
- Reduced motion support
- Frame rate monitoring
- Bundle size optimization

### Loading States

- Skeleton screens
- Progressive loading
- Smooth transitions
- Error states

## Accessibility

### Color Contrast

- WCAG AA compliance
- Dark mode consideration
- Focus indicators
- Error states

### Typography

- Minimum font sizes
- Line height ratios
- Character spacing
- Font smoothing

### Navigation

- Keyboard support
- Screen reader optimization
- Skip links
- ARIA labels

## Implementation Notes

### CSS Architecture

- Tailwind utility-first
- Custom component classes
- Theme configuration
- Dark mode strategy

### Component Library

- Storybook documentation
- Prop documentation
- Visual regression tests
- Usage examples

### Build Process

- CSS purging
- Image optimization
- Critical CSS
- Bundle analysis

### Monitoring

- Performance metrics
- User feedback
- Error tracking
- Analytics integration
