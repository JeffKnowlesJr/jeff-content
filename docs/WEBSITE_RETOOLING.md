# Website Retooling Plan

## Overview

This document outlines the plan to split the current React SPA into a hybrid architecture using Next.js for content-heavy pages while maintaining the existing React application for interactive features.

## Current Status

✅ Phase 1: Next.js Setup

- [x] Create new Next.js project
- [x] Set up shared component library
- [x] Configure Tailwind CSS
- [x] Implement theme system

🔄 Phase 2: Content Migration (In Progress)

- [x] Set up blog system structure
- [x] Implement blog post routing
- [x] Create project showcase structure
- [ ] Migrate existing content

⏳ Phase 3: API Integration (Pending)

- [ ] Configure AppSync client
- [ ] Set up shared API layer
- [ ] Implement data fetching
- [ ] Configure caching

⏳ Phase 4: Deployment (Pending)

- [ ] Set up AWS Amplify hosting
- [ ] Configure CloudFront distribution
- [ ] Set up CI/CD pipelines
- [ ] Implement monitoring

## Current Architecture

The website now uses a hybrid architecture:

```
[Next.js Content Site] ← → [React SPA Application]
            ↓                        ↓
      [Shared API Layer / Backend Services]
```

### Next.js Site (Content Pages)

Current implementation:

- App Router architecture
- TypeScript + Next.js 14
- Tailwind CSS with custom theme
- Font optimization with next/font
- Image optimization pipeline
- Dark/Light mode support

### React SPA (Interactive Features)

Planned features:

- Admin dashboard
- Portfolio experience
- Development tools
- Interactive components

## Target Architecture

We will implement a split architecture:

```
[Next.js Content Site] ← → [React SPA Application]
            ↓                        ↓
      [Shared API Layer / Backend Services]
```

### Next.js Site (Content Pages)

- Marketing pages
- Blog system
- Project showcases
- Resources
- Documentation

### React SPA (Interactive Features)

- Admin dashboard
- Portfolio experience
- Development tools
- Interactive components

## Implementation Phases

### Phase 1: Next.js Setup

1. Create new Next.js project
2. Set up shared component library
3. Migrate content pages
4. Configure AWS integration

### Phase 2: Content Migration

1. Move blog system to Next.js
2. Transfer project showcases
3. Migrate documentation
4. Set up static generation

### Phase 3: API Integration

1. Configure AppSync client
2. Set up shared API layer
3. Implement data fetching
4. Configure caching

### Phase 4: Deployment

1. Set up AWS Amplify hosting
2. Configure CloudFront distribution
3. Set up CI/CD pipelines
4. Implement monitoring

## Technical Requirements

### Next.js Configuration

- TypeScript support
- Tailwind CSS integration
- AWS SDK integration
- Image optimization
- Static site generation

### Shared Components

- UI component library
- Utility functions
- API clients
- Type definitions

### AWS Services

- AppSync for GraphQL API
- DynamoDB for data storage
- S3 for static assets
- CloudFront for CDN
- Amplify for hosting

## Migration Strategy

1. **Content First**: Start with static content pages
2. **Blog System**: Migrate blog functionality
3. **Projects**: Move project showcases
4. **Documentation**: Transfer documentation
5. **Interactive Features**: Keep in React SPA

## SEO Improvements

- Server-side rendering for content pages
- Static generation for blog posts
- Optimized metadata
- Improved performance metrics
- Better search engine indexing

## Performance Targets

- Lighthouse SEO score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Core Web Vitals: All passing

## Timeline

1. **Week 1-2**: Next.js setup and initial configuration
2. **Week 3-4**: Content migration and component library
3. **Week 5-6**: API integration and data fetching
4. **Week 7-8**: Testing and deployment
5. **Week 9-10**: Performance optimization and monitoring

## Maintenance Plan

- Regular dependency updates
- Performance monitoring
- Content updates
- Security patches
- Backup strategy

## Rollback Plan

- Keep current SPA functional
- Maintain separate deployments
- Version control for both applications
- Database backups
- DNS fallback configuration
