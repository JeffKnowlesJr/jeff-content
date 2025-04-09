import { NextResponse } from 'next/server'
import { submitContactFormServer } from '@/services/server-api'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, message } = data

    // Validate required fields
    if (!name || !email || !message) {
      console.error('Missing required fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasMessage: !!message
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
      // Submit to AppSync using server-side service
      const result = await submitContactFormServer(data)

      if (!result) {
        console.error('No result returned from submitContactFormServer')
        throw new Error('No result returned from form submission')
      }

      // Log success (without sensitive info)
      console.log('Contact form submitted successfully:', {
        id: result.id,
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        id: result.id,
        message: 'Contact form submitted successfully'
      })
    } catch (error) {
      // Log detailed error information
      console.error('Error submitting to AppSync:', {
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
