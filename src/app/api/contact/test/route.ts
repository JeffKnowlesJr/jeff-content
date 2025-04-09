import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

// Initialize DynamoDB client - in production, it will automatically use instance role
const client = new DynamoDBClient({
  region: 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    // Create a unique ID and timestamp
    const uniqueId = uuidv4()
    const timestamp = new Date().toISOString()

    // Get the table name from environment variables
    const tableName = process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms'
    console.log('Using DynamoDB table:', tableName)

    // Prepare test data
    const testData = {
      id: uniqueId,
      createdAt: timestamp,
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message to verify the contact form submission.',
      status: 'new',
      processedAt: timestamp
    }

    console.log('Attempting to save test data to DynamoDB:', {
      tableName,
      itemId: uniqueId,
      itemKeys: Object.keys(testData)
    })

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: testData
      })
    )

    console.log('Successfully saved test data to DynamoDB:', {
      itemId: uniqueId,
      timestamp
    })

    return NextResponse.json({
      success: true,
      message: 'Test data successfully saved to DynamoDB',
      data: {
        id: uniqueId,
        timestamp
      }
    })
  } catch (error) {
    console.error('Test route error:', error)

    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message
              }
            : undefined
      },
      { status: 500 }
    )
  }
}
