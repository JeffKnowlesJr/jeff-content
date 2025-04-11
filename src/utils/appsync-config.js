/**
 * AppSync Configuration File
 *
 * This file provides a fallback configuration for production when environment
 * variables are not properly loaded.
 */

export const APPSYNC_CONFIG = {
  // Client-side API configuration
  CLIENT_APPSYNC_API_URL:
    'https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql',
  CLIENT_APPSYNC_API_KEY: 'da2-a235twu7m5f3zfxim7zftusewe',

  // Server-side API configuration (same values for now)
  SERVER_APPSYNC_API_URL:
    'https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql',
  SERVER_APPSYNC_API_KEY: 'da2-a235twu7m5f3zfxim7zftusewe'
}
