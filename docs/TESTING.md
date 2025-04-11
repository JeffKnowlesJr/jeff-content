# Testing Guide

This document provides instructions on how to test the application, with a focus on ensuring production readiness.

## Testing Production-Ready Code

### 1. Using Jest Unit Tests

For unit testing components and API services with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests specifically in a production environment
npm run test:prod
```

The `npm run test:prod` command sets `NODE_ENV=production` when running tests, which allows you to validate that your code behaves correctly in a production environment.

### 2. Testing Production API Integration

To test if your blog content will properly fetch from DynamoDB via AppSync in production, we've created a dedicated script:

```bash
# Test production API integration
npm run test:prod-api
```

This script:

1. Sets `NODE_ENV` to "production"
2. Verifies the necessary environment variables
3. Tests the connection to AppSync GraphQL API
4. Attempts to fetch blog posts from DynamoDB
5. Tests fetching a specific blog post by slug

### 3. Testing GraphQL Schema Compatibility

To validate that your GraphQL queries match the schema defined in AWS AppSync:

```bash
# Test GraphQL schema compatibility
npm run test:graphql-schema
```

This script:

1. Extracts all GraphQL queries from your codebase
2. Fetches the schema from AppSync via introspection
3. Validates that:
   - All query operations exist in the schema
   - All fields requested exist on the respective types
   - Field names match the schema definitions
4. Provides clear validation output with details about any issues

### Environment Variables Required for Testing

To test the production API integration and GraphQL schema compatibility, you need the following environment variables:

```
NEXT_PUBLIC_APPSYNC_API_URL=https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=your-appsync-api-key
```

You can set these variables in a `.env.local` file in the project root:

```
# .env.local
NEXT_PUBLIC_APPSYNC_API_URL=https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=your-appsync-api-key
```

Alternatively, you can set them inline when running the test:

```bash
NEXT_PUBLIC_APPSYNC_API_URL=https://your-endpoint.appsync-api.region.amazonaws.com/graphql NEXT_PUBLIC_APPSYNC_API_KEY=your-api-key npm run test:prod-api
```

### Understanding Test Output

The test scripts produce color-coded output:

- 🟩 Green: SUCCESS - Tests passed successfully
- 🟦 Blue: INFO - Informational messages
- 🟨 Yellow: WARNING - Non-fatal issues
- 🟥 Red: ERROR - Critical failures

Example successful API test output:

```
TESTING PRODUCTION BLOG API

[INFO] Timestamp: 2023-05-15T12:34:56.789Z

Checking Environment Variables

[SUCCESS] Found environment variable: NEXT_PUBLIC_APPSYNC_API_URL
[SUCCESS] Found environment variable: NEXT_PUBLIC_APPSYNC_API_KEY
[SUCCESS] NODE_ENV is correctly set to production

Testing AppSync Connection

[INFO] Sending introspection query to AppSync...
[SUCCESS] Successfully connected to AppSync GraphQL API

Testing Blog Posts Fetching

[INFO] Fetching all blog posts...
[SUCCESS] Successfully fetched 5 blog posts
[INFO] Found 3 published blog posts
[INFO] Sample post: "Modern Website Architecture" by John Doe

Testing Blog Post by Slug Fetching

[INFO] Fetching blog post with slug: modern-website-architecture
[SUCCESS] Successfully fetched blog post: "Modern Website Architecture"

TEST SUMMARY

[SUCCESS] All tests passed successfully! Your production API is ready.
[INFO] Test script completed
```

Example successful GraphQL schema validation output:

```
Testing GraphQL Queries Against Production API

✓ Environment variables found
AppSync API URL: https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql

Found 3 GraphQL queries
Fetching GraphQL schema...
✓ Successfully fetched GraphQL schema

Validating GraphQL Queries...

Validating query: ListBlogPosts
✓ Query field 'listBlogPosts' exists
✓ BlogPostConnection field 'items' exists
✓ BlogPost field 'id' exists
✓ BlogPost field 'slug' exists
✓ BlogPost field 'title' exists
...

Validating query: GetBlogPost
✓ Query field 'getBlogPost' exists
✓ BlogPost field 'id' exists
✓ BlogPost field 'slug' exists
✓ BlogPost field 'title' exists
...

All GraphQL queries are valid against the schema!
```

### Troubleshooting

If the tests fail, check the following:

1. **AppSync Configuration**: Verify your API URL and key are correct
2. **Schema Mismatch**: Ensure your GraphQL schema matches what the script is querying
3. **No Data**: If you have no blog posts in DynamoDB, some tests will be skipped
4. **Network Issues**: Check if your network can reach the AppSync endpoint
5. **Field Name Mismatches**: Ensure the field names in your queries match the schema

## Continuous Integration

When merging changes, it's recommended to run both the Jest tests, the production API test, and the GraphQL schema validation to ensure compatibility:

```bash
# Run all test suites
npm test && npm run test:prod-api && npm run test:graphql-schema
```

## Testing During Development

During development, you can also test your local content by running the application normally:

```bash
npm run dev
```

This will use the local markdown files from the `/content` directory instead of fetching from DynamoDB.
