/**
 * Shared AppSync GraphQL Client
 * This centralizes all AppSync API interactions to avoid code duplication
 */

type GraphQLResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

type FetchOptions = {
  isServer?: boolean // Whether this is a server-side or client-side request
}

// Client-side API configuration (prefixed with NEXT_PUBLIC_)
const CLIENT_APPSYNC_API_URL = process.env.NEXT_PUBLIC_APPSYNC_API_URL
const CLIENT_APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

// Server-side API configuration (not exposed to client)
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

  // Determine which credentials to use based on execution context
  const API_URL = isServer ? SERVER_APPSYNC_API_URL : CLIENT_APPSYNC_API_URL
  const API_KEY = isServer ? SERVER_APPSYNC_API_KEY : CLIENT_APPSYNC_API_KEY

  if (!API_URL || !API_KEY) {
    console.error('AppSync configuration missing:', {
      hasUrl: !!API_URL,
      hasKey: !!API_KEY,
      context: isServer ? 'server' : 'client'
    })
    throw new Error('AppSync configuration is missing')
  }

  try {
    console.log(
      `Executing GraphQL operation${variables ? ' with variables' : ''}`,
      isServer ? '(server-side)' : '(client-side)'
    )

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
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
  } catch (error) {
    console.error('Error executing GraphQL operation:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
