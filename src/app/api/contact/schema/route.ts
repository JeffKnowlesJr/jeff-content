import { NextResponse } from 'next/server'

const APPSYNC_API_URL = process.env.NEXT_PUBLIC_APPSYNC_API_URL
const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

export async function GET() {
  try {
    const response = await fetch(APPSYNC_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY!
      },
      body: JSON.stringify({
        query: `
          query IntrospectionQuery {
            __schema {
              types {
                name
                kind
                inputFields {
                  name
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
                fields {
                  name
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        `
      })
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Schema fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schema' },
      { status: 500 }
    )
  }
}
