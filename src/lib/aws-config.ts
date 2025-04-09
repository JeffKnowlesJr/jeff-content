import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

// AWS Configuration
export const CONTACT_FORM_TABLE = 'jeff-dev-contact-forms'

// Initialize DynamoDB client
export const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  // In production (Amplify), credentials are automatically provided by IAM roles
  // In development, use access keys from environment variables
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      })
})
