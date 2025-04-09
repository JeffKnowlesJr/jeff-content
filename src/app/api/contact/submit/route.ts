import { NextResponse } from 'next/server'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { dynamoClient, CONTACT_FORM_TABLE } from '@/lib/aws-config'

// Initialize the DynamoDB document client
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: Request) {
  try {
    // Check AWS credentials only in development environment
    if (
      process.env.NODE_ENV !== 'production' &&
      (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
    ) {
      console.error('Missing AWS credentials in development:', {
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const data = await request.json()
    const { name, email, message } = data

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasMessage: !!message,
        timestamp: new Date().toISOString()
      })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Log the received data for debugging (without sensitive info)
    console.log('Received contact form data:', {
      hasName: !!name,
      hasEmail: !!email,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    })

    try {
      // Create unique ID and timestamp
      const timestamp = new Date().toISOString()
      const uniqueId = `contact-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`

      // Prepare item for DynamoDB
      const item = {
        id: uniqueId,
        createdAt: timestamp,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        status: 'new', // Required field based on table schema
        processedAt: null // Required for the GSI
      }

      // Save to DynamoDB
      await docClient.send(
        new PutCommand({
          TableName: CONTACT_FORM_TABLE,
          Item: item
        })
      )

      // Log success (without sensitive info)
      console.log('Contact form submitted successfully:', {
        id: uniqueId,
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        id: uniqueId,
        message: 'Contact form submitted successfully'
      })
    } catch (error) {
      // Log detailed error information
      console.error('Error saving to DynamoDB:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })

      // Return a more specific error message
      return NextResponse.json(
        {
          error: 'Failed to submit form. Please try again later.',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    // Log parsing errors
    console.error('Error processing contact form:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        error: 'Invalid request data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}
