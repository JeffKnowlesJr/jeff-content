import fetch from 'node-fetch'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { Sha256 } from '@aws-crypto/sha256-js'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { parseUrl } from '@aws-sdk/url-parser'

// Get environment variables from your .env.local file
const APPSYNC_ENDPOINT = process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT || ''
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const TABLE_NAME = process.env.TABLE_NAME || 'jeff-dev-contact-forms'

if (!APPSYNC_ENDPOINT) {
  console.error('⚠️  Missing NEXT_PUBLIC_APPSYNC_ENDPOINT environment variable')
  process.exit(1)
}

console.log('🔍 Debug Info:')
console.log(`AppSync Endpoint: ${APPSYNC_ENDPOINT}`)
console.log(`AWS Region: ${AWS_REGION}`)
console.log(`Table Name: ${TABLE_NAME}`)

async function testAppSync() {
  try {
    // Create the GraphQL mutation
    const query = `
      mutation CreateContactForm($input: CreateContactFormInput!) {
        createContactForm(input: $input) {
          id
          name
          email
          message
          createdAt
        }
      }
    `

    const variables = {
      input: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the debug script',
        createdAt: new Date().toISOString()
      }
    }

    const endpoint = parseUrl(APPSYNC_ENDPOINT)

    // Prepare request
    const request = new HttpRequest({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        host: endpoint.hostname
      },
      hostname: endpoint.hostname,
      path: endpoint.path,
      body: JSON.stringify({
        query,
        variables
      })
    })

    console.log('📝 Signing request with IAM credentials...')

    // Sign the request with IAM
    const signer = new SignatureV4({
      credentials: defaultProvider(),
      region: AWS_REGION,
      service: 'appsync',
      sha256: Sha256
    })

    const signedRequest = await signer.sign(request)
    console.log('✅ Request signed successfully')

    // Send the request
    console.log('🚀 Sending request to AppSync...')
    const response = await fetch(APPSYNC_ENDPOINT, {
      method: 'POST',
      headers: signedRequest.headers,
      body: signedRequest.body
    })

    const result = await response.json()
    console.log('📊 Response status:', response.status)
    console.log('📄 Response body:', JSON.stringify(result, null, 2))

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors)
    } else if (result.data && result.data.createContactForm) {
      console.log(
        '✅ Test successful! Contact form entry created with ID:',
        result.data.createContactForm.id
      )
    } else {
      console.error('❓ Unexpected response format')
    }
  } catch (error) {
    console.error('❌ Error testing AppSync:', error)
  }
}

// Execute the test
console.log('🧪 Starting AppSync connectivity test...')
testAppSync()
