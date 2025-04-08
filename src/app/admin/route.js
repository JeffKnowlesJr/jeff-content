import { NextResponse } from 'next/server'

// This route handler ensures all admin routes are treated as dynamic
export const dynamic = 'force-dynamic'

// Prevent static generation of admin routes
export async function GET() {
  return NextResponse.json({ status: 'Admin API is working' })
}
