# GraphQL API Implementation

This document provides an overview of the GraphQL API implementation for the blog system, including schema definition, queries, and testing procedures.

## Architecture Overview

The blog system uses a dual-source content architecture:

1. **Development Environment**: Content is loaded from local markdown files in the `/content` directory
2. **Production Environment**: Content is fetched from DynamoDB via AWS AppSync GraphQL API

This separation allows for flexible content development while maintaining a robust production data source.

## GraphQL Schema

The core schema for blog posts is defined in `schema.graphql`:

```graphql
type BlogPost {
  author: String!
  content: String!
  createdAt: AWSDateTime!
  excerpt: String!
  featuredImage: String
  publishedAt: AWSDateTime!
  readingTime: Int!
  slug: String!
  status: String!
  tags: [String!]!
  title: String!
  updatedAt: AWSDateTime!
}

type BlogPostConnection {
  items: [BlogPost!]!
  nextToken: String
}

type Query {
  getBlogPost(slug: String!): BlogPost
  listBlogPosts(limit: Int, nextToken: String): BlogPostConnection
  # ... other queries
}
```

Note that the `BlogPost` type does not have an `id` field in the schema, as the `slug` is used as the primary identifier.

## GraphQL Queries

The application uses three main queries for blog content:

1. **List Blog Posts**: Retrieves a list of all blog posts

   ```graphql
   query ListBlogPosts {
     listBlogPosts {
       items {
         slug
         title
         excerpt
         content
         author
         tags
         readingTime
         featuredImage
         status
         publishedAt
         updatedAt
       }
     }
   }
   ```

2. **Get Blog Post by Slug**: Retrieves a single blog post by its slug

   ```graphql
   query GetBlogPost($slug: String!) {
     getBlogPost(slug: $slug) {
       slug
       title
       excerpt
       content
       author
       tags
       readingTime
       featuredImage
       status
       publishedAt
       updatedAt
     }
   }
   ```

3. **Get Recent Blog Posts**: Retrieves a limited number of recent posts
   ```graphql
   query GetRecentBlogPosts($limit: Int) {
     listBlogPosts(limit: $limit, filter: { status: { eq: "published" } }) {
       items {
         slug
         title
         excerpt
         author
         tags
         publishedAt
       }
     }
   }
   ```

## Field Mapping

To maintain compatibility between the GraphQL schema and the application's internal data model, field mapping is implemented:

| GraphQL Schema Field | Application Model Field | Notes                                |
| -------------------- | ----------------------- | ------------------------------------ |
| `publishedAt`        | `datePublished`         | Both used interchangeably in the app |
| `updatedAt`          | `dateModified`          | Both used interchangeably in the app |
| N/A                  | `id`                    | Optional in app model, not in schema |

The `content-loader.ts` utility handles this mapping automatically when loading content from either source.

## Testing GraphQL Schema Compatibility

A dedicated script (`scripts/test-graphql-schema.js`) validates that all GraphQL queries match the schema definition. The script:

1. Extracts all GraphQL queries from the codebase
2. Fetches the schema via introspection from AppSync
3. Validates that all operations and fields exist in the schema
4. Provides detailed output of any issues found

Run the script with:

```bash
npm run test:graphql-schema
```

## Testing Production API

The production API can be tested without deployment using the `test-production-api.js` script. This script:

1. Sets NODE_ENV to "production"
2. Connects to the AppSync endpoint
3. Executes GraphQL queries against the live API
4. Verifies that data can be retrieved correctly

Run the script with:

```bash
npm run test:prod-api
```

## Common Issues and Solutions

### Field Name Mismatches

- **Issue**: Field names in queries don't match schema (e.g., `datePublished` vs `publishedAt`)
- **Solution**: Update GraphQL queries to use exact field names from schema

### Missing Fields

- **Issue**: Queries request fields not in the schema (e.g., querying for `id` when it doesn't exist)
- **Solution**: Remove fields not defined in the schema from queries

### Operation Name Mismatches

- **Issue**: Operation names don't match schema (e.g., `getBlogPostBySlug` vs `getBlogPost`)
- **Solution**: Update operation names to match schema exactly

## Best Practices

1. **Schema Validation**: Always run the schema validation test after modifying GraphQL queries
2. **Field Consistency**: Use the exact field names defined in the schema
3. **Model Flexibility**: Keep the application model flexible with optional fields to handle different data shapes
4. **Testing**: Test both in development (markdown) and production (GraphQL) modes regularly

## Troubleshooting

If you encounter GraphQL errors in production:

1. Verify your AppSync API URL and key are correct
2. Run the schema validation test to identify any mismatches
3. Check field names and operation names against the schema
4. Verify that the filter syntax is supported by your AppSync resolvers

For more information on testing, see the [Testing Guide](TESTING.md).
