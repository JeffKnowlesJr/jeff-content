import { NextResponse } from 'next/server'

// AppSync configuration
const APPSYNC_API_URL = process.env.APPSYNC_API_URL
const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY

export async function GET() {
  try {
    // Validate AppSync configuration
    if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
      console.error('AppSync configuration missing:', {
        hasUrl: !!APPSYNC_API_URL,
        hasKey: !!APPSYNC_API_KEY
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create test data
    const testData = {
      id: `test-${Date.now()}`,
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify the contact form submission.',
      createdAt: new Date().toISOString(),
      status: 'NEW'
    }

    // Prepare the mutation
    const mutation = `
      mutation CreateContactForm($input: CreateContactFormInput!) {
        createContactForm(input: $input) {
          id
          name
          email
          message
          createdAt
          status
        }
      }
    `

    const variables = {
      input: testData
    }

    // Send to AppSync
    const response = await fetch(APPSYNC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY
      },
      body: JSON.stringify({
        query: mutation,
        variables
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AppSync Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      return NextResponse.json(
        { error: 'Failed to submit test form' },
        { status: 500 }
      )
    }

    const result = await response.json()

    if (result.errors) {
      console.error('AppSync GraphQL Errors:', result.errors)
      return NextResponse.json(
        { error: result.errors[0].message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: testData })
  } catch (error) {
    console.error('Test submission failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    )
  }
}
