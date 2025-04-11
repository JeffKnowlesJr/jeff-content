/**
 * Shared AppSync GraphQL Client
 * This centralizes all AppSync API interactions to avoid code duplication
 */

import { APPSYNC_CONFIG } from '@/utils/appsync-config'

type GraphQLResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

type FetchOptions = {
  isServer?: boolean // Whether this is a server-side or client-side request
}

// Client-side API configuration uses a secure proxy route
const CLIENT_PROXY_URL = '/api/graphql' // Secure server-side proxy route

// Server-side API configuration (not exposed to client)
const SERVER_APPSYNC_API_URL =
  process.env.APPSYNC_API_URL ||
  process.env.NEXT_PUBLIC_APPSYNC_API_URL ||
  APPSYNC_CONFIG.SERVER_APPSYNC_API_URL
const SERVER_APPSYNC_API_KEY =
  process.env.APPSYNC_API_KEY || process.env.NEXT_PUBLIC_APPSYNC_API_KEY

/**
 * Execute a GraphQL query or mutation against AppSync
 */
export async function executeGraphQL<TData = Record<string, unknown>>(
  query: string,
  variables?: Record<string, unknown>,
  options: FetchOptions = {}
): Promise<TData> {
  const { isServer = false } = options

  try {
    console.log(
      `Executing GraphQL operation${variables ? ' with variables' : ''}`,
      isServer ? '(server-side)' : '(client-side)'
    )

    // Choose the appropriate endpoint based on context
    if (isServer) {
      // For server-side requests, use AppSync directly (API key not exposed to client)
      if (!SERVER_APPSYNC_API_URL || !SERVER_APPSYNC_API_KEY) {
        console.error('Server-side AppSync configuration missing')
        throw new Error('Server-side AppSync configuration is missing')
      }

      const response = await fetch(SERVER_APPSYNC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SERVER_APPSYNC_API_KEY
        },
        body: JSON.stringify({
          query,
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
        throw new Error(`Failed to execute GraphQL operation: ${errorText}`)
      }

      const result = (await response.json()) as GraphQLResponse<TData>

      if (result.errors && result.errors.length > 0) {
        console.error('AppSync GraphQL Errors:', result.errors)
        throw new Error(result.errors[0].message)
      }

      return result.data
    } else {
      // For client-side requests, use the secure proxy route
      const response = await fetch(CLIENT_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('GraphQL Proxy Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Failed to execute GraphQL operation: ${errorText}`)
      }

      const result = (await response.json()) as GraphQLResponse<TData>

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL Proxy Errors:', result.errors)
        throw new Error(result.errors[0].message)
      }

      return result.data
    }
  } catch (error) {
    console.error('Error executing GraphQL operation:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
