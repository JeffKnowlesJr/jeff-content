---
title: 'Directory-Based Domain Splitting in AWS: A Practical Approach'
slug: 'directorybased-domain-splitting-in-aws-a-practical-approach'
excerpt: 'Learn how to route different parts of your website to specialized backend services using AWS CloudFront and API Gateway while maintaining a unified frontend experience.'
author: 'Jeff Knowles Jr'
tags: ['AWS', 'Architecture', 'CloudFront', 'API Gateway', 'Infrastructure']
readingTime: '12 min read'
datePublished: '2024-04-04'
dateModified: '2024-04-04'
status: 'published'
featuredImage: '/images/blog/featured/smit-patel-xMNQketH4tU-unsplash-16x9.jpg'
---

Directory-based domain splitting is a powerful architectural pattern in AWS that allows you to route different parts of your website to different backend services based on URL paths. This approach gives you the flexibility to use specialized services for specific sections of your application while maintaining a unified frontend experience for users.

> **Note**: Code examples in this article use syntax highlighting with colors inspired by the blue waves in the featured image.

## The Problem

Many modern web applications have different sections with varying requirements:

- Marketing pages that need SEO optimization
- Interactive dashboards requiring rich client-side functionality
- API endpoints for data exchange
- Admin sections with different authentication requirements

Traditionally, you'd need to choose between:

1. Building everything as a monolith
2. Splitting into separate subdomains (app.example.com, api.example.com)

## The Solution: Path-Based Routing

AWS offers several ways to implement directory-based domain splitting, using CloudFront and API Gateway as the routing layer. This allows you to:

```plaintext
example.com/           → Static website (S3)
example.com/app/*      → Single Page Application (S3 + CloudFront Function)
example.com/api/*      → REST API (API Gateway)
example.com/admin/*    → Admin SPA (different S3 bucket)
```

## Implementation Options

### 1. CloudFront with Origin Groups

The most flexible approach uses CloudFront distributions with multiple origins:

```typescript
const distribution = new aws.cloudfront.Distribution({
  origins: [
    {
      domainName: 'marketing-site.s3.amazonaws.com',
      originId: 'marketingSite',
      s3OriginConfig: {
        /* ... */
      }
    },
    {
      domainName: 'app.s3.amazonaws.com',
      originId: 'spaApp',
      s3OriginConfig: {
        /* ... */
      }
    },
    {
      domainName: 'api.execute-api.us-east-1.amazonaws.com',
      originId: 'apiGateway',
      customOriginConfig: {
        /* ... */
      }
    }
  ],
  defaultCacheBehavior: {
    targetOriginId: 'marketingSite'
    // Default behavior for root path
  },
  orderedCacheBehaviors: [
    {
      pathPattern: 'app/*',
      targetOriginId: 'spaApp'
      // SPA-specific cache settings
    },
    {
      pathPattern: 'api/*',
      targetOriginId: 'apiGateway'
      // API-specific forwarding settings
    }
  ]
})
```

### 2. API Gateway with Base Path Mappings

For API-heavy applications:

```typescript
// Create multiple API Gateway REST APIs
const marketingApi = new aws.apigateway.RestApi('marketing')
const appApi = new aws.apigateway.RestApi('app')
const dataApi = new aws.apigateway.RestApi('data')

// Map them to different paths in a custom domain
const domainName = new aws.apigateway.DomainName('example-domain', {
  domainName: 'example.com',
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/abc123'
})

// Map base paths to different APIs
new aws.apigateway.BasePathMapping('marketing-mapping', {
  restApiId: marketingApi.id,
  stageName: 'prod',
  domainName: domainName.domainName,
  basePath: '' // Root path
})

new aws.apigateway.BasePathMapping('app-mapping', {
  restApiId: appApi.id,
  stageName: 'prod',
  domainName: domainName.domainName,
  basePath: 'app' // /app/* path
})

new aws.apigateway.BasePathMapping('data-mapping', {
  restApiId: dataApi.id,
  stageName: 'prod',
  domainName: domainName.domainName,
  basePath: 'api' // /api/* path
})
```

## CloudFront Functions for SPA Routing

For single-page applications, you'll need to handle client-side routing. CloudFront Functions make this easy:

```javascript
function handler(event) {
  var request = event.request
  var uri = request.uri

  // Check if request is for a file with extension
  if (uri.match(/\.[a-zA-Z0-9]+$/)) {
    // Request is for a file, continue normally
    return request
  }

  // For paths starting with /app/ that don't point to a file,
  // route to the SPA's index.html
  if (uri.startsWith('/app/')) {
    request.uri = '/app/index.html'
  }

  return request
}
```

## Benefits of Directory-Based Domain Splitting

1. **Unified User Experience**: Users see a single domain across all sections
2. **Flexible Architecture**: Deploy different sections with appropriate technologies
3. **Independent Deployment**: Update sections independently without affecting others
4. **Optimal Performance**: Use the right service for each section (static S3, dynamic Lambda)
5. **Shared Authentication**: Cookies and local storage work across all paths

## Common Challenges and Solutions

### Cross-Origin Resource Sharing (CORS)

Even though everything appears under one domain to users, backend services might be hosted separately. Configure CORS carefully:

```typescript
// API Gateway CORS configuration
new aws.apigateway.Resource('apiResource', {
  // Resource configuration
  corsConfiguration: {
    allowOrigins: ['https://example.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowCredentials: true
  }
})
```

### Cookie Sharing

Set cookies at the domain root to ensure they're available across all paths:

```javascript
// Set a cookie available to all paths
document.cookie =
  'sessionId=abc123; path=/; domain=example.com; secure; samesite=strict'
```

### Caching Strategies

Different sections need different caching rules:

- Marketing pages: Long cache times with invalidation on content updates
- SPAs: Cache HTML shell, but not API responses
- API endpoints: Minimal or no caching

Configure each CloudFront behavior with appropriate TTL settings.

## Conclusion

Directory-based domain splitting in AWS provides a flexible, scalable architecture for complex web applications. By leveraging CloudFront, API Gateway, and purpose-built backend services, you can create a unified user experience while maintaining the benefits of a microservices approach.

This pattern works especially well for transitioning monolithic applications to microservices incrementally, allowing you to modernize one section at a time while maintaining a consistent user experience.

---

_Featured image: Photo by [Smit Patel](https://unsplash.com/@smitpatel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-blue-and-white-abstract-background-with-wavy-lines-xMNQketH4tU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
