import fetch from 'node-fetch'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Configuration to test - check ONLY non-prefixed variables
const config = {
  APPSYNC_API_URL: process.env.APPSYNC_API_URL,
  APPSYNC_API_KEY: process.env.APPSYNC_API_KEY,
  // Add other variables if needed for future tests
  REGION: process.env.REGION,
  CONTACT_FORM_TABLE: process.env.CONTACT_FORM_TABLE
}

// Log actual values being used (redacting API key)
console.log('Using configuration:', {
  APPSYNC_API_URL: config.APPSYNC_API_URL,
  APPSYNC_API_KEY: config.APPSYNC_API_KEY ? '***[REDACTED]***' : undefined,
  REGION: config.REGION,
  CONTACT_FORM_TABLE: config.CONTACT_FORM_TABLE
})

// Test queries
const TEST_QUERIES = {
  listBlogPosts: `
    query ListBlogPosts {
      listBlogPosts {
        items {
          slug
          title
        }
      }
    }
  `,
  getBlogPost: `
    query GetBlogPost($slug: String!) {
      getBlogPost(slug: $slug) {
        title
        excerpt
        author
      }
    }
  `
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
}

// Logging utilities
const log = {
  success: (msg) => console.log(colors.green + '✓ ' + msg + colors.reset),
  error: (msg) => console.log(colors.red + '✗ ' + msg + colors.reset),
  info: (msg) => console.log(colors.bright + 'ℹ ' + msg + colors.reset),
  warning: (msg) => console.log(colors.yellow + '⚠ ' + msg + colors.reset)
}

async function testAppSyncConfig() {
  log.info('Testing AppSync Configuration...\n')

  // 1. Check environment variables
  log.info('1. Checking environment variables:')
  let hasErrors = false

  if (!config.APPSYNC_API_URL) {
    log.error('APPSYNC_API_URL is not set')
    hasErrors = true
  } else {
    log.success('APPSYNC_API_URL is set')
  }

  if (!config.APPSYNC_API_KEY) {
    log.error('APPSYNC_API_KEY is not set')
    hasErrors = true
  } else {
    log.success('APPSYNC_API_KEY is set')
  }

  // Add checks for other variables if needed
  if (!config.REGION) {
    log.warning(
      'REGION environment variable is not set (optional for this test)'
    )
  } else {
    log.success('REGION is set')
  }
  if (!config.CONTACT_FORM_TABLE) {
    log.warning(
      'CONTACT_FORM_TABLE environment variable is not set (optional for this test)'
    )
  } else {
    log.success('CONTACT_FORM_TABLE is set')
  }

  if (!config.APPSYNC_API_URL || !config.APPSYNC_API_KEY) {
    log.error(
      '\nRequired environment variables missing. Please set them in .env.local and try again.'
    )
    process.exit(1)
  }

  // 2. Test API Connectivity
  log.info('\n2. Testing API Connectivity:')
  try {
    const response = await fetch(config.APPSYNC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.APPSYNC_API_KEY
      },
      body: JSON.stringify({
        query: TEST_QUERIES.listBlogPosts
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      log.error('GraphQL errors received:')
      console.error(data.errors)
      hasErrors = true
    } else {
      log.success('Successfully connected to AppSync API')

      // Check if we got any blog posts
      const posts = data.data?.listBlogPosts?.items || []
      if (posts.length > 0) {
        log.success(`Found ${posts.length} blog posts`)
        log.info('Sample post: ' + posts[0].title)
      } else {
        log.warning('No blog posts found in DynamoDB')
      }
    }
  } catch (error) {
    log.error('Failed to connect to AppSync API:')
    console.error(error)
    hasErrors = true
  }

  // 3. Test Proxy Route
  log.info('\n3. Testing API Proxy Route:')
  try {
    // Get the base URL from environment or use localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const proxyUrl = `${baseUrl}/api/graphql`

    log.info(`Testing proxy route at: ${proxyUrl}`)

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: TEST_QUERIES.listBlogPosts
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      log.error('GraphQL proxy errors received:')
      console.error(data.errors)
      hasErrors = true
    } else {
      log.success('Successfully connected through proxy route')
    }
  } catch (error) {
    log.error('Failed to connect through proxy route:')
    console.error(error)
    log.warning('Note: This test requires the development server to be running')
    hasErrors = true
  }

  // Summary
  console.log('\n' + colors.bright + 'Test Summary:' + colors.reset)
  if (hasErrors) {
    log.error('Some tests failed. Please check the errors above.')
  } else {
    log.success('All tests passed successfully!')
  }
}

// Run the tests
testAppSyncConfig().catch(console.error)
