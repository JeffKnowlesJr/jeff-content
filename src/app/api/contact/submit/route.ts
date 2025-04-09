import { NextResponse } from 'next/server'
import { submitContactForm } from '@/services/api'

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
      console.error('Missing required fields in form submission')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Submit to AppSync
    const result = await submitContactForm({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    })

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      {
        error: 'Failed to save contact form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
