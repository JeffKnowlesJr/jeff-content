import { Metadata } from 'next'
import { BlogLayout } from '@/components/BlogLayout'

export const metadata: Metadata = {
  title: 'AppSync Contact Form Integration Debugging | Dev Log',
  description:
    'Debugging process and resolution for AppSync contact form integration issues, including schema configuration and API key authentication.',
  openGraph: {
    title: 'AppSync Contact Form Integration Debugging | Dev Log',
    description:
      'Debugging process and resolution for AppSync contact form integration issues, including schema configuration and API key authentication.',
    type: 'article',
    publishedTime: '2024-04-09T03:11:00.000Z',
    authors: ['Jeff Knowles Jr'],
    tags: ['AppSync', 'GraphQL', 'AWS', 'Debugging', 'Contact Form']
  }
}

export default function AppSyncDebuggingPage() {
  return (
    <BlogLayout>
      <article className='prose dark:prose-invert max-w-none'>
        <h1>AppSync Contact Form Integration Debugging</h1>
        <div className='text-sm text-gray-500 dark:text-gray-400 mb-8'>
          Published on April 9, 2024
        </div>

        <h2>Issue: Contact Form Submission Failing with 500 Error</h2>
        <p>
          During the implementation of the contact form using AWS AppSync, we
          encountered a 500 Internal Server Error with the message "You are not
          authorized to make this call". This document outlines our debugging
          process and the eventual resolution.
        </p>

        <h3>Error Details</h3>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          POST http://localhost:3000/api/contact/submit 500 (Internal Server
          Error) Error: You are not authorized to make this call
        </pre>

        <h3>Debugging Process</h3>

        <h4>1. Initial Investigation</h4>
        <ul>
          <li>
            Checked the API route implementation in{' '}
            <code>src/app/api/contact/submit/route.ts</code>
          </li>
          <li>
            Verified the API service implementation in{' '}
            <code>src/services/api.ts</code>
          </li>
          <li>
            Examined the GraphQL mutation in{' '}
            <code>src/graphql/mutations.ts</code>
          </li>
        </ul>

        <h4>2. Environment Variables Verification</h4>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          NEXT_PUBLIC_APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
          NEXT_PUBLIC_APPSYNC_API_KEY=da2-3zzxvx3farclpmnwq7ihrrrx3e
        </pre>

        <h4>3. AppSync API Configuration Check</h4>
        <p>Using AWS CLI, we verified the API configuration and API keys:</p>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          # List available AppSync APIs aws appsync list-graphql-apis # Check
          API keys for the ContactFormAPI aws appsync list-api-keys --api-id
          jdarmqqnpnfvnpsvxzkubf5a7y
        </pre>

        <h4>4. Code Implementation Review</h4>

        <h5>GraphQL Mutation</h5>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          {`export const createContactForm = /* GraphQL */ \`
  mutation CreateContactForm(
    $input: CreateContactFormInput!
  ) {
    createContactForm(input: $input) {
      id
      name
      email
      subject
      message
      createdAt
      status
    }
  }
\`;`}
        </pre>

        <h5>API Service Implementation</h5>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          {`export async function submitContactForm(formData: ContactFormData) {
  const endpoint = process.env.NEXT_PUBLIC_APPSYNC_API_URL
  const apiKey = process.env.NEXT_PUBLIC_APPSYNC_API_KEY

  if (!endpoint || !apiKey) {
    throw new Error('AppSync configuration missing')
  }

  const variables = {
    input: {
      id: \`contact-\${Date.now()}-\${Math.random().toString(36).substring(2, 10)}\`,
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
      throw new Error(\`HTTP error! status: \${response.status}\`)
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
}`}
        </pre>

        <h3>Root Cause Analysis</h3>
        <p>
          The error "You are not authorized to make this call" indicated one of
          several potential issues:
        </p>
        <ol>
          <li>
            <strong>Schema Mismatch</strong>: The GraphQL schema in AppSync
            didn't match the mutation we were trying to execute
          </li>
          <li>
            <strong>API Key Permissions</strong>: The API key didn't have the
            necessary permissions to execute the mutation
          </li>
          <li>
            <strong>Resolver Configuration</strong>: The resolver for the{' '}
            <code>createContactForm</code> mutation wasn't properly configured
          </li>
        </ol>

        <h3>Required AppSync Schema</h3>
        <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          {`type ContactForm {
  id: ID!
  name: String!
  email: String!
  subject: String!
  message: String!
  createdAt: AWSDateTime!
  status: String!
}

input CreateContactFormInput {
  id: ID!
  name: String!
  email: String!
  subject: String!
  message: String!
  createdAt: AWSDateTime!
  status: String!
}

type Mutation {
  createContactForm(input: CreateContactFormInput!): ContactForm
}

type Query {
  getContactForm(id: ID!): ContactForm
}`}
        </pre>

        <h3>Resolution Steps</h3>
        <ol>
          <li>
            <strong>Verify AppSync Schema</strong>
            <ul>
              <li>
                Ensure the schema matches the expected types and mutations
              </li>
              <li>Check that all required fields are present</li>
            </ul>
          </li>
          <li>
            <strong>Configure Resolver</strong>
            <ul>
              <li>
                Create a resolver for the <code>createContactForm</code>{' '}
                mutation
              </li>
              <li>Set up the DynamoDB data source</li>
              <li>Configure the resolver mapping template</li>
            </ul>
          </li>
          <li>
            <strong>API Key Permissions</strong>
            <ul>
              <li>Verify the API key has access to the resolver</li>
              <li>Check IAM roles and policies</li>
            </ul>
          </li>
          <li>
            <strong>Testing</strong>
            <ul>
              <li>Use the AppSync console to test the mutation</li>
              <li>Verify the DynamoDB table structure</li>
              <li>Test with sample data</li>
            </ul>
          </li>
        </ol>

        <h3>Best Practices</h3>
        <ol>
          <li>
            <strong>Error Handling</strong>
            <ul>
              <li>Implement comprehensive error handling in the API service</li>
              <li>Log detailed error information for debugging</li>
              <li>Provide user-friendly error messages</li>
            </ul>
          </li>
          <li>
            <strong>Security</strong>
            <ul>
              <li>Never expose API keys in client-side code</li>
              <li>Use environment variables for sensitive information</li>
              <li>Implement proper input validation</li>
            </ul>
          </li>
          <li>
            <strong>Monitoring</strong>
            <ul>
              <li>Set up CloudWatch alarms for API errors</li>
              <li>Monitor DynamoDB table metrics</li>
              <li>Track API usage and performance</li>
            </ul>
          </li>
        </ol>

        <h3>Additional Resources</h3>
        <ul>
          <li>
            <a
              href='https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              AppSync Documentation
            </a>
          </li>
          <li>
            <a
              href='https://graphql.org/learn/schema/'
              target='_blank'
              rel='noopener noreferrer'
            >
              GraphQL Schema Design
            </a>
          </li>
          <li>
            <a
              href='https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              DynamoDB Best Practices
            </a>
          </li>
        </ul>
      </article>
    </BlogLayout>
  )
}
