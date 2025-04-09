import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'

// Initialize DynamoDB client with region only - will use IAM role in production
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    // Create test data
    const testData = {
      id: `test-${Date.now()}`,
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify the contact form submission.',
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      status: 'NEW'
    }

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
      Item: testData
    })

    await docClient.send(command)

    return NextResponse.json({ success: true, data: testData })
  } catch (error) {
    console.error('Test submission failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    )
  }
}
