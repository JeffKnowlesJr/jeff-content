import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Initialize the DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1' // Explicitly set to us-east-1 based on our testing
  // Use environment variables if available, otherwise rely on AWS credential provider chain
  // This will work with AWS IAM roles in production
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Log received data (excluding sensitive info)
    console.log('Contact form submission received:', {
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasSubject: !!data.subject,
      messageLength: data.message?.length || 0
    })

    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.error('Missing required fields in form submission:', {
        hasName: !!data.name,
        hasEmail: !!data.email,
        hasSubject: !!data.subject,
        hasMessage: !!data.message
      })

      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create unique ID and timestamp
    const timestamp = new Date().toISOString()
    const uniqueId = `contact-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`

    // Prepare item for DynamoDB
    const item = {
      id: uniqueId,
      createdAt: timestamp,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'new'
    }

    console.log(
      'Attempting to save contact form to DynamoDB with ID:',
      uniqueId
    )

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: 'jeff-dev-contact-forms',
        Item: item
      })
    )

    console.log('Contact form saved successfully with ID:', uniqueId)

    return NextResponse.json({ success: true, id: uniqueId })
  } catch (error) {
    console.error('Error saving contact form to DynamoDB:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown error type',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    })

    return NextResponse.json(
      {
        error: 'Failed to save contact form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
