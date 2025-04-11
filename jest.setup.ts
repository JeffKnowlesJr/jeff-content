// Import Jest types
import '@testing-library/jest-dom'

// Make sure global environment variables are set for tests
process.env.NEXT_PUBLIC_APPSYNC_API_URL =
  'https://test-api-url.appsync-api.region.amazonaws.com/graphql'
process.env.NEXT_PUBLIC_APPSYNC_API_KEY = 'test-api-key'
process.env.APPSYNC_API_URL =
  'https://test-api-url.appsync-api.region.amazonaws.com/graphql'
process.env.APPSYNC_API_KEY = 'test-api-key-server'

// Mock environment variables
jest.mock('next/headers', () => ({
  headers: () => new Map(),
  cookies: () => new Map()
}))

// Mock console.log and console.error to reduce noise in test output
global.console = {
  ...console,
  // log: jest.fn(),
  // error: jest.fn(),
  warn: jest.fn()
}
