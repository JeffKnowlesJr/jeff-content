import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
  // In production, credentials are automatically provided by IAM roles
  // In development, credentials are provided by environment variables
})

const docClient = DynamoDBDocumentClient.from(client)

// Define error types for better type safety
interface DynamoDBError extends Error {
  name: string
  message: string
  code?: string
  type?: string
  $metadata?: {
    requestId?: string
    cfId?: string
    extendedRequestId?: string
    httpStatusCode?: number
    attempts?: number
    totalRetryDelay?: number
  }
  stack?: string
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log('Received contact form data:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      messageLength: body.message ? body.message.length : 0
    })

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      console.error('Missing required fields:', {
        hasName: !!body.name,
        hasEmail: !!body.email,
        hasMessage: !!body.message
      })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create a unique ID and timestamp
    const uniqueId = uuidv4()
    const timestamp = new Date().toISOString()

    // Get the table name from environment variables
    const tableName = process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms'
    console.log('Using DynamoDB table:', tableName)

    // Prepare the item for DynamoDB
    const item = {
      id: uniqueId,
      createdAt: timestamp,
      name: body.name,
      email: body.email,
      subject: body.subject || '',
      message: body.message,
      status: 'new',
      processedAt: timestamp
    }

    console.log('Attempting to save to DynamoDB:', {
      tableName,
      itemId: uniqueId,
      itemKeys: Object.keys(item)
    })

    try {
      // Save to DynamoDB
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: item
        })
      )

      console.log('Successfully saved to DynamoDB:', {
        itemId: uniqueId,
        timestamp
      })

      return NextResponse.json({ success: true })
    } catch (dbError: unknown) {
      // Enhanced error logging for DynamoDB errors
      const error = dbError as DynamoDBError
      console.error('DynamoDB error details:', {
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        errorType: error.type,
        metadata: error.$metadata,
        stack: error.stack
      })

      // Check for specific error types
      if (error.name === 'ValidationException') {
        return NextResponse.json(
          { error: 'Invalid data format. Please check your input.' },
          { status: 400 }
        )
      } else if (error.name === 'ResourceNotFoundException') {
        console.error('DynamoDB table not found:', tableName)
        return NextResponse.json(
          { error: 'Server configuration error. Please try again later.' },
          { status: 500 }
        )
      } else if (error.name === 'AccessDeniedException') {
        console.error('Access denied to DynamoDB table:', tableName)
        return NextResponse.json(
          { error: 'Server configuration error. Please try again later.' },
          { status: 500 }
        )
      }

      // Generic error response
      return NextResponse.json(
        { error: 'Failed to submit form. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error: unknown) {
    console.error('Unexpected error in contact form submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    )
  }
}
