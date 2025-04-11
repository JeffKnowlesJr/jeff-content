/**
 * AppSync Configuration File
 *
 * This file provides a fallback configuration for production when environment
 * variables are not properly loaded.
 *
 * ⚠️ SECURITY WARNING ⚠️
 * We are only hardcoding the AppSync endpoint URL, NOT the API key.
 * The API key should ALWAYS come from environment variables to prevent
 * unauthorized database access.
 */

export const APPSYNC_CONFIG = {
  // Client-side API configuration - endpoint only
  CLIENT_APPSYNC_API_URL:
    'https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql',
  CLIENT_APPSYNC_API_KEY: '', // DO NOT hardcode the API key here!

  // Server-side API configuration - endpoint only
  SERVER_APPSYNC_API_URL:
    'https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql',
  SERVER_APPSYNC_API_KEY: '' // DO NOT hardcode the API key here!
}
