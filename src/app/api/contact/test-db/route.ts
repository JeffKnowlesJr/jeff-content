import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})
const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    // Log environment variables (without sensitive values)
    console.log('Environment check:', {
      hasRegion: !!process.env.AWS_REGION,
      region: process.env.AWS_REGION,
      hasTable: !!process.env.CONTACT_FORM_TABLE,
      tableName: process.env.CONTACT_FORM_TABLE,
      nodeEnv: process.env.NODE_ENV
    })

    // Test data
    const testItem = {
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString(),
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      status: 'NEW',
      processedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Attempting to write to DynamoDB:', {
      tableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
      itemId: testItem.id
    })

    // Try to write to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
        Item: testItem
      })
    )
    console.log('Successfully wrote to DynamoDB')

    // Try to read from DynamoDB
    console.log('Attempting to read from DynamoDB...')
    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
        Key: {
          id: testItem.id,
          createdAt: testItem.createdAt
        }
      })
    )
    console.log('Successfully read from DynamoDB:', result.Item)

    return NextResponse.json({
      success: true,
      message: 'DynamoDB test successful',
      item: result.Item
    })
  } catch (error) {
    console.error('Error testing DynamoDB:', error)
    return NextResponse.json(
      {
        error: 'DynamoDB test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
