import { NextResponse } from 'next/server'
import { testApiKey } from '@/services/server-api'

export async function GET() {
  try {
    const result = await testApiKey()
    return NextResponse.json(result)
  } catch (error) {
    console.error('API key test route error:', error)
    return NextResponse.json(
      { error: 'Failed to test API key' },
      { status: 500 }
    )
  }
}
