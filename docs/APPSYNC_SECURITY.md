# AppSync Security Guide

This document outlines the security considerations for using AppSync GraphQL API with API keys.

## Security Vulnerabilities Found

During our security assessment, we identified a critical vulnerability in the initial implementation:

- The AppSync API key was hardcoded in client-side JavaScript
- The API key had full read AND write permissions to the database
- This would allow anyone to extract the key and modify database content

## Implemented Security Measures

To address these vulnerabilities, we implemented the following security measures:

### 1. Created a Secure Server-Side Proxy API Route

We created a server-side API route at `/api/graphql` that:

- Acts as a proxy between the client and AppSync
- Keeps the API key securely on the server-side only
- Implements operation whitelisting to only allow specific read operations

```typescript
// src/app/api/graphql/route.ts
export async function POST(request: NextRequest) {
  // Validate operation is in the whitelist
  const ALLOWED_OPERATIONS = [
    'ListBlogPosts',
    'GetBlogPost',
    'GetRecentBlogPosts'
  ]

  // Only server has access to the API key
  const APPSYNC_API_KEY = process.env.APPSYNC_API_KEY

  // Forward request with API key added securely
  // ...
}
```

### 2. Updated AppSync Client for Secure Requests

Modified the GraphQL client to:

- Use the secure proxy route for all client-side requests
- Only use direct AppSync access for server-side requests
- Remove all hardcoded API keys from client-accessible code

### 3. Environment Variable Best Practices

Updated environment variable handling to:

- Separate server-only variables (`APPSYNC_API_KEY`) from client-accessible ones
- Add security warnings in configuration files
- Document security considerations

## AppSync API Key Management

For AWS AppSync, API keys should be handled with the following considerations:

1. **API Key Permissions**:

   - API keys used in client-side code should be read-only
   - Consider using AWS IAM or Cognito for authentication when write access is needed

2. **API Key Rotation**:

   - Rotate API keys regularly (AWS AppSync allows this)
   - Monitor for unusual API usage patterns

3. **Environment Configuration**:

   - Store API keys in environment variables on the server
   - Never commit API keys to the repository
   - Use secure environment variable handling in CI/CD pipelines

4. **Access Patterns**:
   - Use a server-side proxy for client-side GraphQL requests
   - Implement operation whitelisting
   - Consider rate limiting to prevent abuse

## AWS AppSync Permission Configuration

To properly secure your AppSync API:

1. **API Key with Read-Only Access**:

   ```
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "appsync:GraphQL"
         ],
         "Resource": [
           "arn:aws:appsync:REGION:ACCOUNT_ID:apis/API_ID/types/Query/*"
         ]
       },
       {
         "Effect": "Deny",
         "Action": [
           "appsync:GraphQL"
         ],
         "Resource": [
           "arn:aws:appsync:REGION:ACCOUNT_ID:apis/API_ID/types/Mutation/*"
         ]
       }
     ]
   }
   ```

2. **Create an IAM Role for Admin Access**:
   - Use IAM roles for admin operations
   - Create a separate admin interface with proper authentication

## Recommended Next Steps

1. **API Key Configuration**: Update the AppSync API key to have read-only access
2. **Security Audit**: Review all client-side code for any other hardcoded credentials
3. **API Monitoring**: Set up monitoring and alerting for unusual API activity
4. **Regular Testing**: Periodically test API key permissions to ensure proper configuration
