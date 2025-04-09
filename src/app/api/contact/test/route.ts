import { NextResponse } from 'next/server'
import { testContactFormSubmission } from '@/services/server-api'

export async function GET() {
  try {
    const result = await testContactFormSubmission()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json(
      { error: 'Failed to run test submission' },
      { status: 500 }
    )
  }
}
