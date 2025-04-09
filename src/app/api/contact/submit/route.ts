import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Initialize DynamoDB client with explicit credentials configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: Request) {
  try {
    // Verify credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials missing. Check environment variables.')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a unique ID and timestamp
    const id = uuidv4()
    const timestamp = new Date().toISOString()

    // Prepare the item for DynamoDB
    const item = {
      id,
      name,
      email,
      message,
      createdAt: timestamp,
      processedAt: timestamp,
      status: 'NEW'
    }

    // Save to DynamoDB
    const command = new PutCommand({
      TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
      Item: item
    })

    await docClient.send(command)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Contact form submission failed:', error)
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
