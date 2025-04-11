/**
 * Shared AppSync GraphQL Client
 * This centralizes all AppSync API interactions to avoid code duplication
 */

// REMOVED: import { APPSYNC_CONFIG } from '@/utils/appsync-config'
import dotenv from 'dotenv'

// Load environment variables from .env.local (if running locally)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' })
}

// Define types for GraphQL errors
type GraphQLErrorDetail = {
  message: string
  locations?: Array<{ line: number; column: number; sourceName?: string }>
  path?: Array<string | number>
  extensions?: Record<string, unknown>
  errorType?: string // Important for AppSync errors
  errorInfo?: unknown
  data?: unknown
}

type GraphQLAggregateError = {
  message: string
  errors: GraphQLErrorDetail[]
}

// Type guard to check if an error object conforms to GraphQLAggregateError
function isGraphQLAggregateError(
  error: unknown
): error is GraphQLAggregateError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as GraphQLAggregateError).errors)
  )
}

type GraphQLResponse<T> = {
  data: T
  errors?: GraphQLErrorDetail[] // Use the detailed type here
}

type FetchOptions = {
  isServer?: boolean // Whether this is a server-side or client-side request
}

// Client-side API configuration uses a secure proxy route
const getClientProxyUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser context: use window.location
    return `${window.location.origin}/api/graphql`
  } else if (process.env.NEXT_PUBLIC_BASE_URL) {
    // Server/Build context with BASE_URL: use it
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`
  } else {
    // Fallback for local development SSR/Build or if BASE_URL is not set
    // This might still cause issues in Amplify build if called inappropriately
    console.log(
      'Warning: Constructing relative proxy URL. Ensure NEXT_PUBLIC_BASE_URL is set in production environments or that client-side logic is not called server-side.'
    )
    return '/api/graphql'
  }
}

// Server-side API configuration (strictly non-public variables)
const SERVER_APPSYNC_API_URL = process.env.APPSYNC_API_URL
const SERVER_APPSYNC_API_KEY = process.env.APPSYNC_API_KEY

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
      // For server-side requests, use AppSync directly
      if (!SERVER_APPSYNC_API_URL || !SERVER_APPSYNC_API_KEY) {
        console.error(
          'Server-side AppSync configuration missing (APPSYNC_API_URL or APPSYNC_API_KEY)'
        )
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
        throw {
          message: 'AppSync GraphQL operation failed',
          errors: result.errors
        }
      }

      return result.data
    } else {
      // For client-side requests, use the secure proxy route
      const currentProxyUrl = getClientProxyUrl()
      console.log(`Client-side request using proxy URL: ${currentProxyUrl}`)

      const response = await fetch(currentProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // No API key sent from client
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
        throw {
          message: 'GraphQL Proxy operation failed',
          errors: result.errors
        }
      }

      return result.data
    }
  } catch (error) {
    // Use the type guard to handle the thrown error object
    if (isGraphQLAggregateError(error)) {
      console.error('GraphQL operation failed with errors:', error.errors)
      throw error // Re-throw the object with the errors array
    } else {
      console.error('Error executing GraphQL operation (non-GraphQL error):', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error instanceof Error ? error : new Error(String(error))
    }
  }
}
