import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Initialize the DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prepare item for DynamoDB
    const item = {
      id: `contact-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString()
    }

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: 'jeff-dev-contact-forms',
        Item: item
      })
    )

    return NextResponse.json({ success: true, id: item.id })
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      { error: 'Failed to save contact form' },
      { status: 500 }
    )
  }
}
