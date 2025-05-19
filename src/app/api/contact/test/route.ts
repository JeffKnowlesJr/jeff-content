import { NextResponse } from 'next/server'

/**
 * Test endpoint for contact form diagnostics
 * This helps identify issues with AppSync connectivity and environment configuration
 */
export async function GET(request: Request) {
  // Get AppSync configuration
  const APPSYNC_API_URL = process.env.APPSYNC_API_URL
  const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY ? 'Present' : 'Missing'
  const CONTACT_FORM_TABLE =
    process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms'
  const REGION = process.env.REGION || 'us-east-1'
  const IS_LOCAL_DEV = process.env.NODE_ENV === 'development'

  // Test connectivity to AppSync
  let appsyncConnectivity = 'Not tested'
  let appsyncError = null

  if (APPSYNC_API_URL && process.env.APPSYNC_API_KEY) {
    try {
      // Create a simple introspection query to test the connection
      const query = `{ __schema { types { name } } }`
      const response = await fetch(APPSYNC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.APPSYNC_API_KEY
        },
        body: JSON.stringify({ query })
      })

      if (response.ok) {
        const data = await response.json()
        // Check if we got a valid response with schema types
        if (
          data &&
          data.data &&
          data.data.__schema &&
          Array.isArray(data.data.__schema.types)
        ) {
          appsyncConnectivity = 'Connected successfully'
        } else {
          appsyncConnectivity = 'Connected but received unexpected data format'
        }
      } else {
        appsyncConnectivity = `Failed with status ${response.status} ${response.statusText}`
        const errorText = await response.text()
        appsyncError = errorText
      }
    } catch (error) {
      appsyncConnectivity = 'Connection error'
      appsyncError = error instanceof Error ? error.message : String(error)
    }
  } else {
    appsyncConnectivity = 'Not attempted - missing credentials'
  }

  // Get network connectivity details
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const clientIP =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'Unknown'

  // Test domain configuration
  const host = request.headers.get('host') || 'Unknown'
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const referer = request.headers.get('referer') || 'None'

  // Build diagnostic response
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'Unknown',
    isLocalDev: IS_LOCAL_DEV,
    appSync: {
      apiUrl: APPSYNC_API_URL || 'Missing',
      apiKey: APPSYNC_API_KEY,
      region: REGION,
      table: CONTACT_FORM_TABLE,
      connectivity: appsyncConnectivity,
      error: appsyncError
    },
    request: {
      userAgent,
      clientIP,
      host,
      protocol,
      referer
    },
    serverConfig: {
      platform: process.platform,
      nodeVersion: process.version
    }
  }

  return NextResponse.json({
    success: true,
    diagnostics
  })
}
