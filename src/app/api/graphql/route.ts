import { NextRequest, NextResponse } from 'next/server'

/**
 * Secure GraphQL proxy route
 *
 * This route handles GraphQL requests from the client and adds the API key
 * securely on the server-side, preventing direct client access to the API key.
 */

// Server-side environment variables (not exposed to client)
const APPSYNC_API_URL = process.env.APPSYNC_API_URL
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY

// List of allowed query operations (for security)
const ALLOWED_OPERATIONS = [
  'ListBlogPosts',
  'GetBlogPost',
  'GetRecentBlogPosts'
]

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { query, variables } = body

    // Basic security check - only allow specific read operations
    // Extract operation name from the query
    const operationMatch =
      query.match(/query\s+(\w+)/i) || query.match(/mutation\s+(\w+)/i)

    if (!operationMatch) {
      return NextResponse.json(
        { errors: [{ message: 'Invalid GraphQL operation' }] },
        { status: 400 }
      )
    }

    const operationName = operationMatch[1]

    // Security check - only allow specific operations
    if (!ALLOWED_OPERATIONS.includes(operationName)) {
      console.warn(`Blocked unauthorized operation: ${operationName}`)
      return NextResponse.json(
        { errors: [{ message: 'Operation not allowed' }] },
        { status: 403 }
      )
    }

    // Ensure we have API credentials
    if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
      console.error(
        'AppSync configuration missing (APPSYNC_API_URL or APPSYNC_API_KEY) for proxy route'
      )
      return NextResponse.json(
        { errors: [{ message: 'AppSync configuration is missing' }] },
        { status: 500 }
      )
    }

    // Forward the request to AppSync with the API key
    const response = await fetch(APPSYNC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    // Get the response from AppSync
    const result = await response.json()

    // Return the response
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GraphQL proxy:', error)
    return NextResponse.json(
      { errors: [{ message: 'Internal server error' }] },
      { status: 500 }
    )
  }
}
