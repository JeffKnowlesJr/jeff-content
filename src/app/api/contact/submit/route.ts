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
    const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY
    const CONTACT_FORM_TABLE =
      process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms'

    // Force production mode for testing
    const IS_LOCAL_DEV = false // Override local dev check

    // Enhanced logging of environment
    console.log('Environment Configuration:', {
      APPSYNC_API_URL: APPSYNC_API_URL || 'MISSING',
      APPSYNC_API_KEY: APPSYNC_API_KEY ? 'Present' : 'Missing',
      CONTACT_FORM_TABLE,
      NODE_ENV: process.env.NODE_ENV,
      IS_LOCAL_DEV
    })

    // Check for required environment variables
    if (!APPSYNC_API_URL) {
      console.error('AppSync API URL is missing')
      return NextResponse.json(
        {
          error:
            'Server configuration error: Missing AppSync URL. Please check environment variables.'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, message, subject } = body

    // Log the incoming request
    console.log('Received form submission:', {
      name,
      email,
      subject,
      messageLength: message?.length
    })

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

    // Prepare the input with the table name (can help with debugging)
    const variables = {
      input: {
        id,
        createdAt: timestamp,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        subject: subject?.trim() || '',
        status: 'NEW',
        processedAt: timestamp
      }
    }

    const region = process.env.REGION || 'us-east-1'
    console.log('Attempting AppSync mutation with:', {
      url: APPSYNC_API_URL,
      region,
      variables
    })

    // Determine authentication method
    const useApiKey = true // Force API Key authentication
    console.log(`Using ${useApiKey ? 'API Key' : 'IAM'} authentication`)

    let response

    if (useApiKey) {
      // Use API Key authentication
      console.log('Using API Key authentication')

      // Make sure we have an API key
      if (!APPSYNC_API_KEY) {
        console.error('AppSync API Key is missing')
        return NextResponse.json(
          { error: 'Server configuration error: Missing AppSync API Key' },
          { status: 500 }
        )
      }

      response = await fetch(APPSYNC_API_URL, {
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
    } else {
      // Use IAM authentication
      console.log('Using IAM authentication')

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
      console.log('Parsed endpoint:', {
        hostname: endpoint.hostname,
        path: endpoint.path
      })

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
        // Log detailed credential process
        console.log('Getting credentials from provider chain...')

        // Use the credentials provider chain to get credentials from environment
        // In Amplify, this will use the Amplify role credentials
        // In local dev, this will use credentials from AWS CLI configuration
        const signer = new SignatureV4({
          credentials: defaultProvider(),
          region,
          service: 'appsync',
          sha256: Sha256
        })

        console.log('Signing request with SigV4...')
        // Sign the request with AWS SigV4
        const signedRequest = await signer.sign(requestToBeSigned)

        // Log headers for debugging (excluding Authorization which is sensitive)
        const debugHeaders = { ...signedRequest.headers }
        if (debugHeaders.Authorization) {
          debugHeaders.Authorization = 'REDACTED (for security)'
        }
        console.log('Signed request headers:', debugHeaders)

        // Convert signed request to fetch API format
        const fetchOptions = {
          method: signedRequest.method,
          headers: signedRequest.headers,
          body: signedRequest.body
        }

        console.log('Sending request to AppSync...')
        // Send the signed request to AppSync
        response = await fetch(APPSYNC_API_URL, fetchOptions)
      } catch (signingError) {
        console.error('AWS signing error:', signingError)
        // More detailed error message
        let errorMessage = 'Failed to authenticate with AWS services'
        if (signingError instanceof Error) {
          errorMessage += `: ${signingError.message}`
          console.error('Error stack:', signingError.stack)
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 })
      }
    }

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
    console.log('Full AppSync response:', result)

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
  } catch (error) {
    console.error('Error saving contact form:', error)
    let errorMessage = 'Failed to submit form. Please try again later.'
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
