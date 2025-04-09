# AppSync IAM Authentication Guide

This guide explains how we implement IAM authentication for AppSync GraphQL APIs in our Next.js application.

## Overview

We use AWS IAM (Identity and Access Management) for authenticating requests to our AppSync GraphQL API instead of API keys. This approach offers enhanced security and follows AWS best practices.

## Implementation Details

Our implementation involves the following components:

1. **AWS SDK**: We use several AWS SDK packages to handle the authentication process:

   - `@aws-sdk/signature-v4`: For signing requests using AWS Signature Version 4
   - `@aws-crypto/sha256-js`: For hash calculation required by the signing process
   - `@aws-sdk/credential-provider-node`: To obtain AWS credentials
   - `@aws-sdk/protocol-http` and `@aws-sdk/url-parser`: For HTTP request handling

2. **Authentication Flow**:
   - We prepare an HTTP request with our GraphQL operation
   - We sign the request using AWS Signature Version 4 (SigV4)
   - We send the signed request to the AppSync endpoint
   - The signature proves our identity and authorization to AWS services

## Code Implementation

The key part of our implementation in `src/app/api/contact/submit/route.ts`:

```typescript
// Prepare the request for signing
const endpoint = parseUrl(APPSYNC_API_URL)
const requestToBeSigned = new HttpRequest({
  hostname: endpoint.hostname || '',
  path: endpoint.path || '/',
  body: JSON.stringify({
    query: mutation,
    variables
  }),
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    host: endpoint.hostname || ''
  }
})

// Create a signer with the AWS SDK
const signer = new SignatureV4({
  credentials: defaultProvider(),
  region,
  service: 'appsync',
  sha256: Sha256
})

// Sign the request with AWS SigV4
const signedRequest = await signer.sign(requestToBeSigned)

// Convert signed request to fetch API format and send
const fetchOptions = {
  method: signedRequest.method,
  headers: signedRequest.headers,
  body: signedRequest.body
}
const response = await fetch(APPSYNC_API_URL, fetchOptions)
```

## Environment Configuration

### Local Development

For local development, we utilize AWS credentials from your AWS CLI configuration:

1. Make sure you have AWS CLI installed and configured with `aws configure`
2. Your credentials should have permission to access the AppSync API
3. The `.env.local` file should contain:
   ```
   APPSYNC_API_URL=https://your-appsync-api-url.amazonaws.com/graphql
   REGION=us-east-1
   ```

### Production (Amplify)

In AWS Amplify:

1. The application uses the Amplify service role
2. Environment variables are set in the Amplify Console:
   ```
   APPSYNC_API_URL=https://your-appsync-api-url.amazonaws.com/graphql
   REGION=us-east-1
   ```
3. We avoid using variables with `AWS_` prefix as those are reserved in Amplify

## IAM Policies

The IAM role or user needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["appsync:GraphQL"],
      "Resource": ["arn:aws:appsync:REGION:ACCOUNT_ID:apis/YOUR_API_ID/*"]
    }
  ]
}
```

## Advantages Over API Keys

1. **Security**: No static API keys to manage or potentially expose
2. **Fine-grained access control**: IAM allows specific permissions for each operation
3. **Audit trail**: AWS CloudTrail logs all IAM authentication attempts
4. **Credential rotation**: IAM roles in Amplify provide temporary credentials that rotate automatically

## Fallback Mechanism

Our implementation includes a local development fallback that activates when:

- The AppSync URL is not configured
- The application is running in development mode

This allows for easier local development without requiring a full AWS setup.

## Troubleshooting

Common authentication issues:

1. **403 Forbidden errors**: Check IAM permissions and roles
2. **Missing credentials**: Ensure AWS CLI is configured for local development
3. **Signature mismatch**: Verify the region matches between the request and API
4. **AppSync API not found**: Verify the AppSync URL is correct

For production issues, check Amplify CloudWatch logs and ensure the service role has the necessary permissions.

## Resources

- [AWS AppSync Authentication and Authorization](https://docs.aws.amazon.com/appsync/latest/devguide/security.html)
- [AWS SigV4 Signing Process](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
