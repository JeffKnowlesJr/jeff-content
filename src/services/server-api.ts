interface ContactFormData {
  name: string
  email: string
  message: string
  status?: string
}

const APPSYNC_API_URL = process.env.NEXT_PUBLIC_APPSYNC_API_URL
const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
  console.error(
    'Missing AppSync configuration. Please check your environment variables.'
  )
}

export async function submitContactFormServer(data: ContactFormData) {
  if (!APPSYNC_API_URL || !APPSYNC_API_KEY) {
    console.error('AppSync configuration missing:', {
      hasUrl: !!APPSYNC_API_URL,
      hasKey: !!APPSYNC_API_KEY
    })
    throw new Error('AppSync configuration is missing')
  }

  const mutation = `
    mutation CreateContactForm($input: CreateContactFormInput!) {
      createContactForm(input: $input) {
        id
        name
        email
        message
        createdAt
        status
      }
    }
  `

  const variables = {
    input: {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
      status: data.status || 'NEW'
    }
  }

  try {
    console.log('Attempting AppSync mutation with:', {
      url: APPSYNC_API_URL,
      hasApiKey: !!APPSYNC_API_KEY,
      variables: JSON.stringify(variables, null, 2)
    })

    const response = await fetch(APPSYNC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY
      },
      body: JSON.stringify({
        query: mutation,
        variables
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server AppSync Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
        requestUrl: APPSYNC_API_URL,
        requestHeaders: {
          'Content-Type': 'application/json',
          'x-api-key': APPSYNC_API_KEY
            ? '***' + APPSYNC_API_KEY.slice(-4)
            : 'missing'
        }
      })
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      )
    }

    const result = await response.json()

    if (result.errors) {
      console.error('Server AppSync GraphQL Errors:', result.errors)
      throw new Error(result.errors[0].message)
    }

    console.log('Server AppSync mutation successful:', result.data)
    return result.data.createContactForm
  } catch (error) {
    console.error('Error in submitContactFormServer:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}

export async function testContactFormSubmission() {
  console.log('Environment variables check:', {
    hasApiUrl: !!APPSYNC_API_URL,
    apiUrlLength: APPSYNC_API_URL?.length,
    hasApiKey: !!APPSYNC_API_KEY,
    apiKeyLength: APPSYNC_API_KEY?.length,
    apiKeyPrefix: APPSYNC_API_KEY?.substring(0, 4) + '...'
  })

  const testData: ContactFormData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message to verify the contact form submission.',
    status: 'NEW'
  }

  try {
    console.log('Starting contact form test submission with data:', testData)
    const result = await submitContactFormServer(testData)
    console.log('Test submission successful:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Test submission failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function testApiKey() {
  const query = `
    query {
      __schema {
        types {
          name
        }
      }
    }
  `

  try {
    console.log('Testing API key with schema query...')
    const response = await fetch(APPSYNC_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': APPSYNC_API_KEY!
      },
      body: JSON.stringify({ query })
    })

    const result = await response.json()
    console.log('Schema query result:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Schema query failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
