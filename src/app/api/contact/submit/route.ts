import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { parseUrl } from '@aws-sdk/url-parser'

// Mock storage for local development
const localSubmissions = []

/**
 * Contact Form Submission API Route
 *
 * This route uses IAM role-based authentication for AppSync instead of API keys.
 * This approach follows our documentation hierarchy:
 * 1. See README.md "AppSync IAM Authentication" section for high-level overview
 * 2. See docs/APPSYNC_IAM_AUTHENTICATION.md for detailed implementation guide
 * 3. See docs/CONTACT_FORM_IAM_SOLUTION.md for problem/solution context
 *
 * Benefits of IAM authentication:
 * - Enhanced security through temporary credentials
 * - Consistent authentication model across application
 * - No need to manage API keys in environment variables
 * - Better audit trail and compliance through IAM roles
 */
export async function POST(request: Request) {
  try {
    // Check for AppSync configuration
    const APPSYNC_API_URL = process.env.APPSYNC_API_URL
    const IS_LOCAL_DEV =
      !APPSYNC_API_URL || process.env.NODE_ENV === 'development'

    const body = await request.json()
    const { name, email, message, subject } = body

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields:', { name, email, message })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a unique ID and timestamp
    const id = uuidv4()
    const timestamp = new Date().toISOString()

    // Use local implementation if in development or no AppSync URL
    if (IS_LOCAL_DEV) {
      console.log('Using local development mock implementation')

      // Store submission in local array
      const submission = {
        id,
        createdAt: timestamp,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject?.trim() || '',
        status: 'NEW',
        processedAt: timestamp,
        updatedAt: timestamp
      }

      localSubmissions.push(submission)
      console.log('Stored local submission:', submission)

      return NextResponse.json({
        success: true,
        id,
        data: submission,
        mode: 'local_development'
      })
    }

    // GraphQL mutation for AppSync
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
      input: {
        id,
        createdAt: timestamp,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject?.trim(), // Optional field
        status: 'NEW',
        processedAt: timestamp,
        updatedAt: timestamp
      }
    }

    const region = process.env.REGION || 'us-east-1'
    console.log('Attempting IAM auth AppSync mutation with:', {
      url: APPSYNC_API_URL,
      region,
      variables
    })

    /**
     * IAM Authentication Flow for AppSync
     *
     * 1. Prepare the HTTP request with GraphQL mutation
     * 2. Sign the request using AWS Signature Version 4 (SigV4)
     * 3. Send the signed request to AppSync endpoint
     *
     * This implements the pattern described in docs/APPSYNC_IAM_AUTHENTICATION.md
     * See scripts/setup-appsync-iam.sh for setting up required IAM policies
     */

    // Prepare the request for signing
    const endpoint = parseUrl(APPSYNC_API_URL)
    const requestToBeSigned = new HttpRequest({
      hostname: endpoint.hostname || '',
      path: endpoint.path || '/',
      body: JSON.stringify({
        query: mutation,
        variables
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        host: endpoint.hostname || ''
      }
    })

    // Create a signer with the AWS SDK
    try {
      // Use the credentials provider chain to get credentials from environment
      // In Amplify, this will use the Amplify role credentials
      // In local dev, this will use credentials from AWS CLI configuration
      const signer = new SignatureV4({
        credentials: defaultProvider(),
        region,
        service: 'appsync',
        sha256: Sha256
      })

      // Sign the request with AWS SigV4
      const signedRequest = await signer.sign(requestToBeSigned)

      // Convert signed request to fetch API format
      const fetchOptions = {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: signedRequest.body
      }

      // Send the signed request to AppSync
      const response = await fetch(APPSYNC_API_URL, fetchOptions)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('AppSync Error Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        })
        throw new Error(`Failed to submit form: ${errorText}`)
      }

      const result = await response.json()

      if (result.errors) {
        console.error('AppSync GraphQL Errors:', result.errors)
        throw new Error(result.errors[0].message)
      }

      console.log('AppSync mutation successful:', result.data)
      return NextResponse.json({
        success: true,
        id,
        data: result.data.createContactForm
      })
    } catch (signingError) {
      console.error('AWS signing error:', signingError)
      return NextResponse.json(
        { error: 'Failed to authenticate with AWS services' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    )
  }
}
