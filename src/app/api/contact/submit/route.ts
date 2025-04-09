import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})
const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: Request) {
  try {
    // Log environment variables (without sensitive values)
    console.log('Environment check:', {
      hasRegion: !!process.env.AWS_REGION,
      region: process.env.AWS_REGION,
      hasTable: !!process.env.CONTACT_FORM_TABLE,
      tableName: process.env.CONTACT_FORM_TABLE,
      nodeEnv: process.env.NODE_ENV
    })

    const body = await request.json()
    const { name, email, message, subject } = body

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields:', { name, email, message })
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
      createdAt: timestamp, // This is part of the composite key
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: subject?.trim(), // Optional field
      status: 'NEW',
      processedAt: timestamp, // Required for the StatusIndex
      updatedAt: timestamp
    }

    console.log('Attempting to save to DynamoDB:', {
      tableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
      itemId: id
    })

    // Save to DynamoDB
    try {
      await docClient.send(
        new PutCommand({
          TableName: process.env.CONTACT_FORM_TABLE || 'jeff-dev-contact-forms',
          Item: item
        })
      )
      console.log('Successfully saved to DynamoDB:', { id })
    } catch (dbError) {
      console.error('DynamoDB error:', dbError)
      return NextResponse.json(
        { error: 'Database error. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again later.' },
      { status: 500 }
    )
  }
}
