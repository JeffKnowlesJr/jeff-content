#!/usr/bin/env node

/**
 * Script to check AppSync API key permissions
 * This helps verify what operations our API key can access
 */

import fetch from 'node-fetch'

const API_URL =
  'https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql'
const API_KEY = 'da2-a235twu7m5f3zfxim7zftusewe'

// Test operations
const operations = [
  {
    name: 'Query: List Blog Posts',
    query: `
      query ListBlogPosts {
        listBlogPosts {
          items {
            slug
            title
          }
        }
      }
    `
  },
  {
    name: 'Query: Get Blog Post',
    query: `
      query GetBlogPost($slug: String!) {
        getBlogPost(slug: $slug) {
          slug
          title
        }
      }
    `,
    variables: { slug: 'obsidian-for-developers' }
  },
  {
    name: 'Mutation: Create Blog Post (Should Fail)',
    query: `
      mutation CreateBlogPost($input: CreateBlogPostInput!) {
        createBlogPost(input: $input) {
          slug
          title
        }
      }
    `,
    variables: {
      input: {
        author: 'Test Author',
        content: 'Test Content',
        excerpt: 'Test Excerpt',
        publishedAt: new Date().toISOString(),
        readingTime: 1,
        slug: 'test-permission-post',
        status: 'draft',
        tags: ['test'],
        title: 'Test Permission Post'
      }
    }
  },
  {
    name: 'Mutation: Delete Blog Post (Should Fail)',
    query: `
      mutation DeleteBlogPost($input: DeleteBlogPostInput!) {
        deleteBlogPost(input: $input) {
          slug
        }
      }
    `,
    variables: {
      input: {
        slug: 'test-permission-post'
      }
    }
  }
]

// Execute each operation and check the result
async function testPermissions() {
  console.log('Testing AppSync API Key Permissions\n')
  console.log(`API URL: ${API_URL}`)
  console.log(
    `API Key: ${API_KEY.substring(0, 6)}...${API_KEY.substring(
      API_KEY.length - 4
    )}`
  )
  console.log('\n=== RESULTS ===\n')

  for (const op of operations) {
    try {
      console.log(`🔍 Testing: ${op.name}`)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          query: op.query,
          variables: op.variables || {}
        })
      })

      const result = await response.json()

      if (result.errors) {
        console.log(`❌ FAILED: ${result.errors[0].message}`)

        // Check if it's an authentication/authorization error
        if (
          result.errors[0].message.includes('Not Authorized') ||
          result.errors[0].message.includes('denied')
        ) {
          console.log('   👍 Good! This operation is properly restricted')
        } else {
          console.log('   ⚠️ Failed for reasons other than permissions')
        }
      } else {
        console.log('✅ SUCCESS: Operation allowed')

        // For read operations, that's expected
        if (op.name.startsWith('Query:')) {
          console.log(
            "   👍 This is a read operation, so it's expected to succeed"
          )
        } else {
          console.log(
            '   ⚠️ WARNING: Write operation succeeded - potential security issue!'
          )
        }
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`)
    }

    console.log() // Empty line for readability
  }

  console.log('=== SECURITY ASSESSMENT ===\n')
  console.log('Based on the tests:')
  console.log(
    '1. If only read operations succeeded, this API key is properly restricted.'
  )
  console.log(
    "2. If any write operations succeeded, you should review your API's authorization settings."
  )
  console.log(
    '3. This API key is exposed in the client-side code, so it should ONLY have read permissions.'
  )
}

testPermissions().catch(console.error)
