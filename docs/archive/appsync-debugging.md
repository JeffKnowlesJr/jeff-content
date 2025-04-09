# AppSync Integration Debugging Guide

**Status**: ✅ CLOSED - Issue resolved with contact form implementation

## Issue: Contact Form Submission Failing with 500 Error

### Error Details

```
POST http://localhost:3000/api/contact/submit 500 (Internal Server Error)
Error: You are not authorized to make this call
```

### Debugging Process

#### 1. Initial Investigation

- Checked the API route implementation in `src/app/api/contact/submit/route.ts`
- Verified the API service implementation in `src/services/api.ts`
- Examined the GraphQL mutation in `src/graphql/mutations.ts`

#### 2. Environment Variables Verification

```bash
# Check if environment variables are properly set
NEXT_PUBLIC_APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_APPSYNC_API_KEY=da2-3zzxvx3farclpmnwq7ihrrrx3e
```

#### 3. AppSync API Configuration Check

```bash
# List available AppSync APIs
aws appsync list-graphql-apis

# Check API keys for the ContactFormAPI
aws appsync list-api-keys --api-id jdarmqqnpnfvnpsvxzkubf5a7y
```

#### 4. Code Implementation Review

##### GraphQL Mutation (`src/graphql/mutations.ts`)

```typescript
export const createContactForm = /* GraphQL */ `
  mutation CreateContactForm($input: CreateContactFormInput!) {
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
`
```

##### API Service (`src/services/api.ts`)

```typescript
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
```

### Root Cause Analysis

The error "You are not authorized to make this call" indicates one of several potential issues:

1. **Schema Mismatch**: The GraphQL schema in AppSync doesn't match the mutation we're trying to execute
2. **API Key Permissions**: The API key doesn't have the necessary permissions to execute the mutation
3. **Resolver Configuration**: The resolver for the `createContactForm` mutation is not properly configured

### Required AppSync Schema

```graphql
type ContactForm {
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
}
```

### Resolution Steps

1. **Verify AppSync Schema**:

   - Ensure the schema matches the expected types and mutations
   - Check that all required fields are present

2. **Configure Resolver**:

   - Create a resolver for the `createContactForm` mutation
   - Set up the DynamoDB data source
   - Configure the resolver mapping template

3. **API Key Permissions**:

   - Verify the API key has access to the resolver
   - Check IAM roles and policies

4. **Testing**:
   - Use the AppSync console to test the mutation
   - Verify the DynamoDB table structure
   - Test with sample data

### Best Practices

1. **Error Handling**:

   - Implement comprehensive error handling in the API service
   - Log detailed error information for debugging
   - Provide user-friendly error messages

2. **Security**:

   - Never expose API keys in client-side code
   - Use environment variables for sensitive information
   - Implement proper input validation

3. **Monitoring**:
   - Set up CloudWatch alarms for API errors
   - Monitor DynamoDB table metrics
   - Track API usage and performance

### Additional Resources

- [AppSync Documentation](https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html)
- [GraphQL Schema Design](https://graphql.org/learn/schema/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
