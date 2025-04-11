#!/usr/bin/env node

/**
 * Script to test the blog API in a production-like environment
 *
 * This allows testing production blog APIs without deploying:
 * 1. Sets NODE_ENV to 'production'
 * 2. Tests connections to AppSync
 * 3. Attempts to fetch blog posts via the GraphQL API
 */

// Force production mode
process.env.NODE_ENV = 'production'

// We need to set the environment variables before anything else
process.env.NEXT_PUBLIC_APPSYNC_API_URL =
  process.env.NEXT_PUBLIC_APPSYNC_API_URL ||
  'https://example-api.appsync-api.region.amazonaws.com/graphql'
process.env.NEXT_PUBLIC_APPSYNC_API_KEY =
  process.env.NEXT_PUBLIC_APPSYNC_API_KEY || 'dummy-api-key-for-testing'

// Import node-fetch if we're in Node.js environment (not needed in newer Node versions)
import fetch from 'node-fetch'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Helper to format log messages
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) =>
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) =>
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.magenta}${msg}${colors.reset}\n`)
}

// Instead of importing TypeScript modules directly, we'll use fetch for API testing
// This allows us to test the API endpoints without TypeScript build issues

// Check environment variables
async function checkEnvironment() {
  log.header('Checking Environment Variables')

  const requiredVars = [
    'NEXT_PUBLIC_APPSYNC_API_URL',
    'NEXT_PUBLIC_APPSYNC_API_KEY'
  ]

  let allPresent = true

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log.error(`Missing environment variable: ${varName}`)
      allPresent = false
    } else {
      log.success(`Found environment variable: ${varName}`)
    }
  }

  if (!allPresent) {
    log.warning(
      'Using fallback values for missing environment variables. This is only for testing!'
    )
  }

  // Verify NODE_ENV is set to production
  if (process.env.NODE_ENV !== 'production') {
    log.error('NODE_ENV is not set to production!')
    process.exit(1)
  } else {
    log.success('NODE_ENV is correctly set to production')
  }

  return true
}

// Execute a GraphQL query directly
async function executeGraphQL(query, variables) {
  const apiUrl = process.env.NEXT_PUBLIC_APPSYNC_API_URL
  const apiKey = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      )
    }

    const result = await response.json()

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message)
    }

    return result.data
  } catch (error) {
    throw error
  }
}

// Test AppSync connection
async function testAppSyncConnection() {
  log.header('Testing AppSync Connection')

  try {
    // Simple introspection query
    const query = `
      query {
        __schema {
          queryType {
            name
          }
        }
      }
    `

    log.info('Sending introspection query to AppSync...')

    const result = await executeGraphQL(query)

    if (result.__schema && result.__schema.queryType) {
      log.success('Successfully connected to AppSync GraphQL API')
      return true
    } else {
      log.warning('Connected to AppSync, but schema information is incomplete')
      return false
    }
  } catch (error) {
    log.error(`Failed to connect to AppSync: ${error.message}`)
    return false
  }
}

// Test fetching all blog posts
async function testFetchAllBlogPosts() {
  log.header('Testing Blog Posts Fetching')

  try {
    log.info('Fetching all blog posts...')

    const query = `
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
    `

    const result = await executeGraphQL(query)
    const posts = result.listBlogPosts?.items || []

    if (Array.isArray(posts)) {
      log.success(`Successfully fetched ${posts.length} blog posts`)

      // Filter published posts
      const publishedPosts = posts.filter(
        (post) => post.status?.toLowerCase() === 'published'
      )
      log.info(`Found ${publishedPosts.length} published blog posts`)

      if (publishedPosts.length > 0) {
        const sample = publishedPosts[0]
        log.info(`Sample post: "${sample.title}" by ${sample.author}`)
      } else {
        log.warning('No published blog posts found in DynamoDB')
      }

      return { success: true, posts: publishedPosts }
    } else {
      log.error('Invalid response format for blog posts')
      return { success: false, posts: [] }
    }
  } catch (error) {
    log.error(`Failed to fetch blog posts: ${error.message}`)
    return { success: false, posts: [], error: error.message }
  }
}

// Test fetching a specific blog post by slug
async function testFetchBlogPostBySlug(slug) {
  log.header('Testing Blog Post by Slug Fetching')

  try {
    if (!slug) {
      log.warning('No slug provided, skipping test')
      return false
    }

    log.info(`Fetching blog post with slug: ${slug}`)

    const query = `
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
    `

    const result = await executeGraphQL(query, { slug })
    const post = result.getBlogPost

    if (post) {
      log.success(`Successfully fetched blog post: "${post.title}"`)
      return true
    } else {
      log.error(`Failed to fetch blog post with slug: ${slug}`)
      return false
    }
  } catch (error) {
    log.error(`Error fetching blog post by slug: ${error.message}`)
    return false
  }
}

// Main function to run all tests
async function runTests() {
  log.header('TESTING PRODUCTION BLOG API')
  log.info(`Timestamp: ${new Date().toISOString()}`)

  let success = true

  try {
    // Step 1: Check environment
    success = (await checkEnvironment()) && success

    // Step 2: Test AppSync connection
    success = (await testAppSyncConnection()) && success

    // Step 3: Test fetchAllBlogPosts
    const blogPostsResult = await testFetchAllBlogPosts()
    success = blogPostsResult.success && success

    // Step 4: Test fetchBlogPostBySlug (if we have posts)
    if (blogPostsResult.posts?.length > 0) {
      const testSlug = blogPostsResult.posts[0].slug
      success = (await testFetchBlogPostBySlug(testSlug)) && success
    } else {
      log.warning('Skipping blog post by slug test as no posts were found')
    }

    // Summary
    log.header('TEST SUMMARY')

    if (success) {
      log.success(
        'All tests passed successfully! Your production API is ready.'
      )
    } else {
      log.error('Some tests failed. Please check the logs above for details.')
      process.exit(1)
    }
  } catch (error) {
    log.error(`Unexpected error during tests: ${error.message}`)
    log.error(error.stack)
    process.exit(1)
  }
}

// Run the tests
runTests()
  .then(() => {
    log.info('Test script completed')
  })
  .catch((error) => {
    log.error(`Fatal error: ${error.message}`)
    process.exit(1)
  })
