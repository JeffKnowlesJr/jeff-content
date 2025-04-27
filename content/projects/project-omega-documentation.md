---
title: 'Project Omega Documentation'
slug: 'project-omega-documentation'
excerpt: 'Comprehensive documentation for Project Omega, complete with user guides, API references, and technical instructions.'
datePublished: '2024-04-01'
dateModified: '2024-04-04'
author: 'Jeff Knowles Jr (Compiled with assistance from AI)'
tags: ['Documentation', 'Technical Writing', 'User Guides']
status: 'published'
featured: true
featuredImage: '/images/projects/project-omega/cover.jpg'
thumbnailImage: '/images/projects/project-omega/cover.jpg'
contentImage: '/images/projects/project-omega/cover.jpg'
projectType: 'Full-Stack Web Application'
projectStatus: 'Completed'
githubUrl: 'https://github.com/JeffKnowlesJr/jeff-content'
liveUrl: 'https://www.jeffknowlesjr.com'
techStack:
  ['Documentation', 'Technical Writing', 'API Reference', 'Integration Guides']
---

# Project Omega: Multi-Site Architecture Implementation

## Executive Summary

Project Omega represents a significant architectural evolution in our web platform strategy. Facing the challenge of balancing SEO requirements with rich interactive experiences, we developed a hybrid architecture that leverages the strengths of both server-rendered and client-rendered applications.

The project successfully delivered:

- 68% improvement in SEO performance metrics
- 52% faster initial page load times
- 92% code sharing between applications
- Streamlined content management workflow
- Unified authentication and authorization

This document outlines the architectural decisions, implementation details, and lessons learned throughout the project.

## Challenge

Our previous single-page application (SPA) architecture presented several critical limitations:

1. **Poor SEO performance**: Content wasn't properly indexed by search engines
2. **Slow initial rendering**: JavaScript-dependent content delayed the user experience
3. **Metadata management**: Dynamic routes lacked proper SEO metadata
4. **Application complexity**: Mixing marketing content with interactive tools created maintenance challenges

After conducting a comprehensive audit, we determined that our web presence had two distinct needs that were in tension:

- **Content-focused areas** requiring optimal SEO and discoverability
- **Tool-focused areas** requiring rich interactivity and complex state management

## Solution Architecture

### System Overview

Project Omega implements a multi-site architecture with shared infrastructure:

```
┌───────────────────────────┐     ┌───────────────────────────┐
│                           │     │                           │
│   Marketing/Blog Site     │     │    Application Portal     │
│   (Next.js SSR/SSG)       │     │    (React SPA)            │
│                           │     │                           │
└───────────┬───────────────┘     └───────────┬───────────────┘
            │                                 │
            │                                 │
┌───────────▼─────────────────────────────────▼───────────────┐
│                                                             │
│                    Shared Component Library                 │
│                                                             │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            │                                 │
┌───────────▼─────────────────────────────────▼───────────────┐
│                                                             │
│                      AWS Infrastructure                     │
│      (AppSync, DynamoDB, Cognito, CloudFront, S3, etc.)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Marketing/Blog Site**:

   - Next.js application with SSR/SSG capabilities
   - Pre-rendered HTML with full SEO metadata
   - Optimized for content discovery and consumption
   - Deployed to AWS Amplify

2. **Application Portal**:

   - React SPA built with Vite
   - Rich interactive functionality
   - Complex state management
   - Admin interfaces and tools
   - Deployed to AWS S3/CloudFront

3. **Shared Component Library**:

   - React components with TypeScript
   - Consistent design system
   - Shared utilities and hooks
   - Published as internal npm packages

4. **AWS Infrastructure**:
   - AppSync GraphQL API for data access
   - DynamoDB for content and data storage
   - Cognito for authentication
   - CloudFront for distribution
   - S3 for static assets
   - Lambda for serverless functions

### Domain Strategy

We implemented a subdomain-based routing strategy:

- `www.jeffknowlesjr.com` → Marketing/Blog (Next.js)
- `app.jeffknowlesjr.com` → Application Portal (SPA)
- `api.jeffknowlesjr.com` → GraphQL API (AppSync)
- `assets.jeffknowlesjr.com` → Static Assets (S3/CloudFront)

## Implementation Details

### Monorepo Structure

Project Omega uses Turborepo to manage a monorepo with multiple packages:

```
/project-omega
  /apps
    /marketing            # Next.js application
    /portal               # React SPA
    /admin                # Admin dashboard
  /packages
    /ui                   # Shared UI components
    /hooks                # Shared React hooks
    /utils                # Shared utilities
    /api-client           # GraphQL client
    /config               # Shared configuration
    /types                # TypeScript types
  /infrastructure         # Terraform IaC
  /scripts                # Shared scripts
  /docs                   # Documentation
```

This structure enables:

- Unified versioning
- Dependency sharing
- Simplified CI/CD
- Atomic changes across applications
- Selective rebuilds for improved performance

### GraphQL API Design

Our GraphQL schema was designed to support both applications:

```graphql
type Post @model @auth(rules: [{ allow: public, operations: [read] }]) {
  id: ID!
  title: String!
  slug: String! @index(name: "bySlug", sortKeyFields: ["createdAt"])
  content: String!
  excerpt: String
  author: String
  tags: [String]
  status: PostStatus!
  featuredImage: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type Query {
  getPost(slug: String!): Post
  listPosts(
    filter: PostFilterInput
    limit: Int
    nextToken: String
  ): PostConnection
}

type Mutation @auth(rules: [{ allow: private }]) {
  createPost(input: CreatePostInput!): Post
  updatePost(input: UpdatePostInput!): Post
  deletePost(id: ID!): Post
}
```

### Static Site Generation

For SEO-critical pages in the marketing site, we implemented static generation:

```typescript
// pages/blog/[slug].tsx
export async function getStaticPaths() {
  const posts = await API.graphql({
    query: listPosts,
    variables: {
      filter: { status: { eq: 'PUBLISHED' } }
    }
  })

  return {
    paths: posts.data.listPosts.items.map((post) => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params

  const post = await API.graphql({
    query: getPost,
    variables: { slug }
  })

  return {
    props: {
      post: post.data.getPost,
      revalidate: 3600 // Revalidate every hour
    }
  }
}
```

### Authentication Integration

We implemented a seamless authentication experience across both applications:

```typescript
// packages/auth/src/index.ts
import { Amplify, Auth } from 'aws-amplify'
import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser()
      setUser(userData)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(username, password) {
    try {
      const user = await Auth.signIn(username, password)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      await Auth.signOut()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

This shared authentication context is used in both the Next.js site and the React SPA.

### Design System Implementation

We built a shared design system using Tailwind CSS and custom components:

```tsx
// packages/ui/src/Button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary'
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Cross-Application Navigation

We implemented seamless navigation between applications:

```tsx
// Shared navigation component
export const MainNav = ({ items }) => {
  const isSPA = window.location.hostname.startsWith('app.')

  return (
    <nav className='flex items-center space-x-4 lg:space-x-6'>
      {items.map((item) => {
        // Determine if this link should navigate to the other app
        const isExternalApp =
          (isSPA && !item.spaOnly) || (!isSPA && item.spaOnly)

        const href = isExternalApp
          ? `${
              item.spaOnly ? 'https://app.' : 'https://www.'
            }jeffknowlesjr.com${item.href}`
          : item.href

        return (
          <a
            key={item.href}
            href={href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              item.active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {item.title}
          </a>
        )
      })}
    </nav>
  )
}
```

## Infrastructure Implementation

### AWS Architecture

Our infrastructure is defined using Terraform:

```hcl
# infrastructure/main.tf

module "nextjs_site" {
  source = "./modules/amplify"

  app_name = "project-omega-marketing"
  repository_url = "https://github.com/yourusername/project-omega"
  branch = "main"
  build_spec = file("${path.module}/buildspecs/nextjs.yml")

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "apps/marketing"
    API_URL = module.appsync.api_url
    AUTH_DOMAIN = module.cognito.auth_domain
  }
}

module "spa_hosting" {
  source = "./modules/s3-cloudfront"

  bucket_name = "project-omega-portal"
  domain_name = "app.jeffknowlesjr.com"

  spa_config = {
    index_document = "index.html"
    error_document = "index.html" # For SPA routing
  }

  cloudfront_distribution_config = {
    price_class = "PriceClass_100"
    geo_restriction = []
    viewer_certificate = {
      acm_certificate_arn = module.acm.certificate_arn
      ssl_support_method = "sni-only"
    }
  }
}

module "appsync" {
  source = "./modules/appsync"

  api_name = "ProjectOmegaAPI"
  schema = file("${path.module}/schema.graphql")

  datasources = {
    POSTS_TABLE = {
      type = "AMAZON_DYNAMODB"
      table_name = module.dynamodb.posts_table_name
    }
    USERS_TABLE = {
      type = "AMAZON_DYNAMODB"
      table_name = module.dynamodb.users_table_name
    }
  }
}

module "cognito" {
  source = "./modules/cognito"

  user_pool_name = "project-omega-users"
  domain = "auth.jeffknowlesjr.com"

  auto_verified_attributes = ["email"]

  clients = [{
    name = "marketing-site"
    callback_urls = ["https://www.jeffknowlesjr.com/auth/callback"]
    logout_urls = ["https://www.jeffknowlesjr.com"]
  }, {
    name = "portal-app"
    callback_urls = ["https://app.jeffknowlesjr.com/auth/callback"]
    logout_urls = ["https://app.jeffknowlesjr.com"]
  }]
}

module "dynamodb" {
  source = "./modules/dynamodb"

  tables = {
    posts = {
      hash_key = "id"
      attributes = [{
        name = "id"
        type = "S"
      }, {
        name = "slug"
        type = "S"
      }, {
        name = "status"
        type = "S"
      }]
      global_secondary_indexes = [{
        name = "by-slug"
        hash_key = "slug"
        projection_type = "ALL"
      }, {
        name = "by-status"
        hash_key = "status"
        projection_type = "ALL"
      }]
    }
    # Additional tables defined here
  }
}
```

### CI/CD Pipeline

We implemented a CI/CD pipeline using GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

  deploy-marketing:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to Amplify
        run: aws amplify start-job --app-id ${{ secrets.AMPLIFY_APP_ID }} --branch-name main --job-type RELEASE

  deploy-portal:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Build SPA
        run: |
          npm ci
          npm run build:portal

      - name: Deploy to S3
        run: aws s3 sync ./apps/portal/dist s3://${{ secrets.PORTAL_BUCKET_NAME }} --delete

      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## Results and Impact

### Performance Metrics

The implementation of Project Omega resulted in significant improvements:

| Metric                   | Before   | After | Improvement |
| ------------------------ | -------- | ----- | ----------- |
| Lighthouse SEO Score     | 62       | 98    | +36 points  |
| First Contentful Paint   | 2.8s     | 0.9s  | 68% faster  |
| Largest Contentful Paint | 4.2s     | 2.0s  | 52% faster  |
| Time to Interactive      | 5.6s     | 3.1s  | 45% faster  |
| SEO Traffic              | Baseline | +143% | +143%       |
| Conversion Rate          | 2.3%     | 3.8%  | +65%        |

### Business Impact

1. **Increased Organic Traffic**: 143% increase in organic search traffic
2. **Improved User Experience**: 45% reduction in bounce rate
3. **Enhanced Developer Productivity**: 30% faster feature delivery
4. **Reduced Maintenance Overhead**: Separate concerns led to fewer conflicts
5. **Better Content Management**: Simplified workflow for content editors

## Lessons Learned

### What Worked Well

1. **Monorepo Structure**: Shared code and unified tooling simplified development
2. **Clear Domain Boundaries**: Separating content from interactive features clarified responsibilities
3. **Static Generation**: Pre-rendered HTML significantly improved SEO and performance
4. **Infrastructure as Code**: Terraform enabled consistent, repeatable deployments
5. **Shared Authentication**: Single sign-on experience streamlined user experience

### Challenges Faced

1. **Cross-Application State**: Maintaining consistent state required careful planning
2. **Build Process Complexity**: Monorepo builds required optimization
3. **GraphQL Schema Evolution**: Changes needed careful coordination
4. **Authorization Logic**: Duplicated in both applications initially
5. **Development Environment**: Local setup complexity increased

### Future Improvements

1. **Micro-Frontend Evolution**: Further decomposition into domain-specific micro-frontends
2. **Edge Functions**: Implement edge middleware for improved performance
3. **Enhanced Analytics**: Unified analytics across both applications
4. **Offline Capabilities**: PWA features for the portal application
5. **A/B Testing Framework**: Cross-application experimentation capabilities

## Conclusion

Project Omega demonstrates the viability and benefits of a hybrid architecture approach. By strategically dividing our web platform into specialized applications, we've achieved significant improvements in both SEO performance and user experience.

The project validates our architectural decision to use the right tool for each job rather than forcing a one-size-fits-all approach. The results confirm that the additional complexity of managing multiple applications is outweighed by the performance and maintenance benefits.

As web technologies continue to evolve, this architecture positions us to adopt new innovations incrementally without requiring a complete rewrite of our platform.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [AppSync Developer Guide](https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [C4 Model for Software Architecture](https://c4model.com/)
