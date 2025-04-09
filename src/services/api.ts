// Define the interface directly in this file
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

export async function submitContactForm(data: ContactFormData) {
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
      variables
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
      console.error('AppSync Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`
      )
    }

    const result = await response.json()

    if (result.errors) {
      console.error('AppSync GraphQL Errors:', result.errors)
      throw new Error(result.errors[0].message)
    }

    console.log('AppSync mutation successful:', result.data)
    return result.data.createContactForm
  } catch (error) {
    console.error('Error in submitContactForm:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
}
