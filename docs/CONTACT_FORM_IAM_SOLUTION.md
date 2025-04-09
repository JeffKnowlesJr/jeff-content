# Contact Form IAM Authentication Solution

This document explains the implementation of IAM authentication for our contact form submission to AppSync.

## Problem Statement

The contact form initially encountered authentication errors with AppSync, showing:

```
Error submitting contact form: Error: Server configuration error
```

This occurred because:

1. The form was trying to communicate with AppSync without proper authentication
2. Environment variables were missing or misconfigured
3. The authentication method needed to be standardized across environments

## Solution Implementation

### 1. IAM Authentication Approach

We implemented IAM role-based authentication for AppSync instead of API keys because:

- It eliminates the need to manage and rotate API keys
- It leverages AWS's secure credential management
- It provides better audit trails and security compliance
- It's consistent with our AWS Amplify production environment

### 2. Environment Variables

We simplified the environment variables required:

- Simplified to using only `APPSYNC_API_URL` and `REGION`
- Avoided `AWS_` prefixed variables which are reserved in Amplify
- Used the defaultProvider() from AWS SDK to get credentials from runtime environment

```
# Local Development (.env.local)
APPSYNC_API_URL=https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1

# Production (Amplify Console)
APPSYNC_API_URL=https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
```

### 3. Code Implementation

We implemented SignatureV4 signing for AppSync in `src/app/api/contact/submit/route.ts`:

1. Prepare a properly formatted HTTP request
2. Sign it using AWS SigV4 with credentials from the provider chain
3. Send the signed request to AppSync

```typescript
const signer = new SignatureV4({
  credentials: defaultProvider(),
  region,
  service: 'appsync',
  sha256: Sha256
})

const signedRequest = await signer.sign(requestToBeSigned)
```

### 4. Local Development Mode

We added a local development fallback that:

- Activates when the AppSync URL is not set or in development mode
- Stores submissions in memory for testing
- Simulates successful responses
- Provides detailed logs for troubleshooting

### 5. Deployment Process

We created deployment scripts to configure the AWS environment:

- `scripts/update-amplify-env.sh`: Updates environment variables in Amplify
- `scripts/deploy-to-amplify.sh`: Simplifies finding and deploying to your Amplify app

Our Amplify app ID is: `dopcvdkp4snbc`

## Security Considerations

1. **Credential Management**:

   - AWS credentials are never hardcoded or exposed in environment variables
   - Local development uses AWS CLI credentials
   - Production uses Amplify service role credentials

2. **Access Control**:

   - IAM policies should follow the principle of least privilege
   - Only allow the specific GraphQL mutations needed

3. **Security Best Practices**:
   - Deployment scripts and credential files are in .gitignore
   - We use environment-specific variables that don't cross boundaries

## Success Criteria

The implementation is successful when:

1. Contact form submissions work in local development
2. Contact form submissions work in production (Amplify)
3. No credentials or API keys are hardcoded or exposed
4. The solution follows AWS security best practices

## References

- [AWS Amplify AppSync Documentation](https://docs.aws.amazon.com/appsync/latest/devguide/security-authz.html)
- [IAM Authentication Guide](./APPSYNC_IAM_AUTHENTICATION.md)
- [Contact Form Quick Fix](./CONTACT_FORM_QUICKFIX.md)
