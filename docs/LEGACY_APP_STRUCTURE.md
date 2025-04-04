# Legacy App Structure Documentation

This document provides a comprehensive overview of the legacy app's structure and key components.

## Documentation References

- `website-visual-documentation.md` - Visual system documentation
- `VISUAL_SYSTEM.md` - Design system documentation
- `MIGRATION_PLAN.md` - Migration strategy
- `CODEBASE.md` - Codebase architecture
- `TAILWIND_TROUBLESHOOTING.md` - Tailwind CSS configuration and troubleshooting
- `WEBSITE_RETOOLING.md` - Website retooling plan and progress

## Directory Structure

```
legacy.app/
├── components/          # React components
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
├── styles/             # Global styles and CSS
├── services/           # Service layer and API integrations
├── pages/              # Page components
├── blog/               # Blog-specific components and content
├── page.tsx            # Root page component
└── layout.tsx          # Root layout component
```

## Components Directory

### Core Components

- `ThemedApp.tsx` - Root application container with theme support
- `Header.tsx` - Main navigation header
- `Footer.tsx` - Site footer
- `Hero.tsx` - Homepage hero section with animations
- `ContactForm.tsx` - Contact form component
- `GoogleAnalytics.tsx` - Analytics integration
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorDisplay.tsx` - Error message display

### Layout Components

- `layout/GlobalBackground.tsx` - Full viewport background animation container
- `layout/GlobalLayout.tsx` - Global layout wrapper
- `BlogSidebar.tsx` - Blog sidebar navigation
- `ProjectSidebar.tsx` - Project sidebar navigation

### Experimental Components

- `experimental/line-art-background/LineArtBackground.tsx` - Advanced background animation
- `experimental/ghost/Ghost.tsx` - Ghost/anomaly effects

### UI Components

- `ui/` - Reusable UI components
- `shared/` - Shared components
- `common/` - Common utility components

### Feature Components

- `blog/` - Blog-specific components
- `projects/` - Project showcase components
- `portfolio/` - Portfolio components
- `expertise/` - Expertise showcase components
- `home/` - Homepage-specific components

## Pages Directory

### Main Pages

- `HomePage.tsx` - Homepage
- `About.tsx` - About page
- `Contact.tsx` - Contact page
- `Resources.tsx` - Resources page
- `Overview.tsx` - Overview page
- `DevLog.tsx` - Development log
- `Portfolio.tsx` - Portfolio page
- `Sitemap.tsx` - Sitemap page

### Blog Pages

- `blog/BlogListPage.tsx` - Blog listing page
- `blog/BlogDetailPage.tsx` - Blog post detail page

### Project Pages

- `projects/ProjectListPage.tsx` - Project listing page
- `projects/ProjectDetailPage.tsx` - Project detail page

## Styles Directory

### Global Styles

- `globals.css` - Global styles and CSS variables
- Animation utilities
- Theme variables
- Typography styles
- Layout styles

## Types Directory

### Type Definitions

- Blog post types
- Project types
- Author types
- Theme types
- Component prop types

## Utils Directory

### Utility Functions

- Theme utilities
- Animation helpers
- Data processing
- API helpers
- Type guards

## Services Directory

### Service Layer

- API integrations
- Data fetching
- State management
- Analytics services

## Key Features

### Animation System

- Canvas-based background animation
- Interactive network effects
- Mobile-optimized performance
- Theme-aware colors
- Ghost/anomaly effects

### Layout System

- Full viewport coverage
- Proper z-index layering
- Mobile viewport handling
- Smooth transitions
- Responsive design

### Theme System

- Light/dark mode support
- CSS variable-based theming
- Smooth theme transitions
- Component-level theme awareness

### Performance Optimizations

- Adaptive node count
- Mobile-specific optimizations
- Device pixel ratio handling
- Touch interaction support
- Performance monitoring

## Migration Notes

When migrating components from the legacy app:

1. **Background Animation**

   - Copy `LineArtBackground.tsx` for advanced animation features
   - Integrate with current theme system
   - Maintain mobile optimizations

2. **Layout Components**

   - Adapt `GlobalBackground.tsx` for current layout system
   - Preserve z-index layering
   - Keep viewport handling

3. **UI Components**

   - Migrate reusable components from `ui/` and `shared/`
   - Update theme integration
   - Maintain accessibility features

4. **Type Definitions**
   - Copy and adapt type definitions
   - Ensure compatibility with current TypeScript setup
   - Update as needed for new features

## Related Documentation

For more information, please refer to:

- `website-visual-documentation.md` - Visual system documentation
- `VISUAL_SYSTEM.md` - Design system documentation
- `MIGRATION_PLAN.md` - Migration strategy
- `CODEBASE.md` - Codebase architecture
- `TAILWIND_TROUBLESHOOTING.md` - Tailwind CSS configuration and troubleshooting
- `WEBSITE_RETOOLING.md` - Website retooling plan and progress
