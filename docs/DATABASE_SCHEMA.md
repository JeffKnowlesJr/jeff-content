# Database & API Schema

This document outlines the database and API schema used by both the main Next.js website and the backend admin SPA. DynamoDB serves as the **exclusive source of truth** for all content in the application.

## Single Source of Truth

The application exclusively uses DynamoDB for retrieving content via GraphQL. The markdown files in the content directory are only used as a staging area for content that gets uploaded to DynamoDB during the build process - they are **never** accessed directly by application code.

## GraphQL Schema Overview

The AWS AppSync GraphQL API serves as the central data layer for both the public-facing Next.js website and the administrative backend SPA. Below is the complete GraphQL schema that defines the data structure and operations.

```graphql
type BlogPost @model {
  id: ID!
  title: String!
  slug: String! @index(name: "bySlug", queryField: "getBlogPostBySlug")
  content: String!
  excerpt: String
  author: String
  tags: [String]
  category: String
  readingTime: Int
  featuredImage: String
  ogImage: String
  status: ContentStatus!
  datePublished: AWSDateTime
  dateModified: AWSDateTime
  comments: [Comment] @hasMany
}

type Project @model {
  id: ID!
  title: String!
  slug: String! @index(name: "bySlug", queryField: "getProjectBySlug")
  content: String!
  excerpt: String
  client: String
  tags: [String]
  category: String
  featuredImage: String
  ogImage: String
  status: ContentStatus!
  dateCompleted: AWSDateTime
  dateModified: AWSDateTime
  featured: Boolean
  gallery: [GalleryImage]
}

type Comment @model {
  id: ID!
  content: String!
  author: String!
  email: String!
  website: String
  blogPostID: ID! @index(name: "byBlogPost")
  status: CommentStatus!
  dateCreated: AWSDateTime!
}

type GalleryImage {
  url: String!
  alt: String
  caption: String
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
}

type Analytics {
  pageViews: Int!
  uniqueVisitors: Int!
  averageTimeOnPage: Float!
  bounceRate: Float!
  topReferrers: [String]
}

type Query {
  getBlogPostAnalytics(blogPostId: ID!): Analytics
  getProjectAnalytics(projectId: ID!): Analytics
  getOverallAnalytics(startDate: AWSDateTime, endDate: AWSDateTime): Analytics
  searchContent(query: String!): [SearchResult]
}

type Mutation {
  publishScheduledContent: Boolean
  rebuildStaticPages: Boolean
  exportContentToMarkdown(type: String, id: ID): String
  importContentFromMarkdown(type: String, filePath: String!): ID
}

type SearchResult {
  id: ID!
  title: String!
  excerpt: String
  type: String!
  url: String!
  matchConfidence: Float!
}

type Subscription {
  onContentStatusChange(status: ContentStatus): ContentStatusChange
    @aws_subscribe(mutations: ["updateBlogPost", "updateProject"])
}

type ContentStatusChange {
  id: ID!
  title: String!
  type: String!
  status: ContentStatus!
}
```

## Data Flow Architecture

```
┌─────────────────────┐      ┌─────────────────────┐
│                     │      │                     │
│  Next.js Website    │      │  Admin SPA          │
│  (Public-facing)    │      │  (Content Mgmt)     │
│                     │      │                     │
└─────────┬───────────┘      └─────────┬───────────┘
          │                            │
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│              AWS AppSync GraphQL API            │
│                                                 │
└─────────────────────┬───────────────────────────┘
                      │
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│              Amazon DynamoDB                    │
│              (Single Source of Truth)           │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Database Tables (DynamoDB)

| Table Name | Primary Key | Sort Key | GSI1                 | GSI2                                     |
| ---------- | ----------- | -------- | -------------------- | ---------------------------------------- |
| BlogPost   | id          | -        | slug (GSI1-PK)       | status, datePublished (GSI2-PK, GSI2-SK) |
| Project    | id          | -        | slug (GSI1-PK)       | status, featured (GSI2-PK, GSI2-SK)      |
| Comment    | id          | -        | blogPostID (GSI1-PK) | status (GSI2-PK)                         |

## Access Patterns

### Public Website (Next.js)

| Access Pattern                      | Implementation                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Get published blog posts            | `query listBlogPosts(filter: {status: {eq: PUBLISHED}})`                                       |
| Get single blog post by slug        | `query getBlogPostBySlug(slug: "post-slug")`                                                   |
| Get published projects              | `query listProjects(filter: {status: {eq: PUBLISHED}})`                                        |
| Get featured projects               | `query listProjects(filter: {AND: [{status: {eq: PUBLISHED}}, {featured: {eq: true}}]})`       |
| Get project by slug                 | `query getProjectBySlug(slug: "project-slug")`                                                 |
| Get approved comments for blog post | `query listComments(filter: {AND: [{blogPostID: {eq: "post-id"}}, {status: {eq: APPROVED}}]})` |
| Submit new comment                  | `mutation createComment(input: {content, author, email, blogPostID, status: PENDING})`         |

### Admin SPA

| Access Pattern                  | Implementation                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| Get all blog posts (any status) | `query listBlogPosts`                                                                              |
| Get all projects (any status)   | `query listProjects`                                                                               |
| Get pending comments            | `query listComments(filter: {status: {eq: PENDING}})`                                              |
| Update blog post status         | `mutation updateBlogPost(input: {id, status})`                                                     |
| Create new blog post            | `mutation createBlogPost(input: {...})`                                                            |
| Update project                  | `mutation updateProject(input: {id, ...})`                                                         |
| Approve/reject comment          | `mutation updateComment(input: {id, status})`                                                      |
| Delete content                  | `mutation deleteBlogPost(input: {id})` or `mutation deleteProject(input: {id})`                    |
| Export content to Markdown      | `mutation exportContentToMarkdown(type: "BlogPost", id: "post-id")`                                |
| Import content from Markdown    | `mutation importContentFromMarkdown(type: "Project", filePath: "content/projects/new-project.md")` |

## Authentication & Authorization

### Public Website (Next.js)

- Uses API key authentication for read-only operations
- Anonymous users can only access published content
- Comment submission requires basic validation but no authentication

### Admin SPA

- Uses IAM authentication with Cognito User Pools
- Role-based access control (RBAC) using Cognito groups:
  - `Editors`: Can create and edit content, but not change status
  - `Publishers`: Can change content status and schedule publication
  - `Administrators`: Full access to all operations including user management

## Content Management Flow

The system provides a unidirectional content flow from markdown files to DynamoDB:

1. **Markdown Files as Staging Area**:

   - Content authors create and edit markdown files in the `content/` directory
   - These files are never accessed directly by the application

2. **Build-time Processing**:

   - During build or via scheduled jobs, markdown files are processed
   - Content is uploaded to DynamoDB via GraphQL mutations
   - This ensures DynamoDB remains the single source of truth

3. **Application Content Delivery**:
   - The application exclusively queries DynamoDB via GraphQL
   - No fallbacks or references to the filesystem are used

### Export Functionality (for Backup/Version Control)

While markdown files serve as the staging area, the system also provides export functionality:

- The `exportContentToMarkdown` mutation extracts content from DynamoDB
- This is primarily used for backup and version control purposes

## Deployment Considerations

1. **DynamoDB Capacity Mode**:

   - On-demand capacity mode recommended for variable workloads
   - Provisioned capacity with auto-scaling for predictable workloads

2. **AppSync Caching**:

   - Enable caching for queries with low mutation frequency
   - Recommended cache TTL: 60-300 seconds for public content

3. **Security**:
   - Public-facing API operations use API key authentication
   - Admin operations require IAM authorization
   - Use field-level authorization to restrict sensitive data

## Schema Evolution Strategy

When extending the schema:

1. **Additive Changes**: Add new fields or types without breaking existing queries
2. **Version Fields**: For major changes, consider adding version fields
3. **Deprecation**: Use `@deprecated` directive before removing fields
4. **Testing**: Test all access patterns before deploying schema changes

## Monitoring & Performance

Recommended CloudWatch alarms:

1. **Error Rates**: Alert on GraphQL errors exceeding threshold
2. **Latency**: Alert on p95 latency exceeding 200ms
3. **Throttling**: Alert on any throttled requests

## Development Workflow

1. Update GraphQL schema in AppSync console or via Amplify CLI
2. Generate updated TypeScript types using GraphQL codegen
3. Update frontend queries and components
4. Deploy changes via CI/CD pipeline
