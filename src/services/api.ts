import { createContactForm } from '../graphql/mutations'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitContactForm(formData: ContactFormData) {
  const endpoint = process.env.NEXT_PUBLIC_APPSYNC_API_URL
  const apiKey = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

  if (!endpoint || !apiKey) {
    throw new Error('AppSync configuration missing')
  }

  const variables = {
    input: {
      id: `contact-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: 'new'
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        query: createContactForm,
        variables
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (result.errors) {
      console.error('AppSync errors:', result.errors)
      throw new Error(result.errors[0].message)
    }

    if (!result.data?.createContactForm) {
      throw new Error('Invalid response format from AppSync')
    }

    return result.data.createContactForm
  } catch (error) {
    console.error('Error in submitContactForm:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to submit contact form')
  }
}
