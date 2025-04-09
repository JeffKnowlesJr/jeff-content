import { NextResponse } from 'next/server'
import { submitContactFormServer } from '@/services/server-api'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, subject, message } = data

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('Missing required fields:', {
        name,
        email,
        subject,
        message
      })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Log the received data for debugging
    console.log('Received contact form data:', {
      name,
      email,
      subject,
      messageLength: message.length
    })

    try {
      // Submit to AppSync using server-side service
      const result = await submitContactFormServer(data)
      if (!result) {
        console.error('No result returned from submitContactFormServer')
        throw new Error('No result returned from form submission')
      }
      return NextResponse.json({ success: true, id: result.id })
    } catch (error) {
      console.error('Error submitting to AppSync:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      return NextResponse.json(
        { error: 'Failed to submit form. Please try again later.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing contact form:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}
