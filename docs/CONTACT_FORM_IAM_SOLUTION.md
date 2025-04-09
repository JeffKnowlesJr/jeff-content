# Contact Form IAM Authentication Solution

## Current Implementation

The contact form uses AWS AppSync with IAM authentication to securely store submissions in DynamoDB.

### Architecture

```
Client -> AppSync API -> DynamoDB Table
   ↑          ↑             ↑
   └──────────┴─────────────┘
        IAM Authentication
```

### Components

1. **AppSync API**:

   - Name: JeffContactFormAPI
   - API ID: oanhkaegl5felpanhmgplnc6mm
   - URL: https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql
   - Authentication: AWS IAM
   - Region: us-east-1

2. **DynamoDB Table**:

   - Name: jeff-dev-contact-forms
   - Region: us-east-1
   - Key Schema:
     - Hash Key: id (String)
     - Range Key: createdAt (String)
   - GSI: StatusIndex
     - Hash Key: status (String)
     - Range Key: processedAt (String)

3. **IAM Roles**:
   - AmplifyAppRole: Used by the Amplify app to access AppSync
   - Required Permissions:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": ["appsync:GraphQL"],
           "Resource": "arn:aws:appsync:us-east-1:159370117840:apis/oanhkaegl5felpanhmgplnc6mm/*"
         }
       ]
     }
     ```

### Environment Configuration

```bash
# Production (Amplify Console)
APPSYNC_API_URL=https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### GraphQL Schema

```graphql
type ContactForm {
  id: ID!
  createdAt: String!
  name: String!
  email: String!
  message: String!
  subject: String
  status: String!
  processedAt: String!
  updatedAt: String!
}

input CreateContactFormInput {
  id: ID!
  createdAt: String!
  name: String!
  email: String!
  message: String!
  subject: String
  status: String!
  processedAt: String!
  updatedAt: String!
}

type Mutation {
  createContactForm(input: CreateContactFormInput!): ContactForm
}

type Query {
  getContactForm(id: ID!): ContactForm
}
```

### Setup Scripts

The AppSync API setup is automated using `scripts/setup-appsync.sh`, which:

1. Creates the AppSync API with IAM authentication
2. Configures the GraphQL schema
3. Creates the DynamoDB data source
4. Sets up resolvers for mutations and queries

### Security Considerations

1. **Authentication**:

   - Uses IAM roles instead of API keys
   - No credentials stored in code or environment variables
   - Leverages AWS's secure credential management

2. **Authorization**:

   - AppSync API restricted to authenticated requests only
   - DynamoDB access controlled through AppSync
   - Fine-grained access control through IAM policies

3. **Best Practices**:
   - No hardcoded credentials
   - Principle of least privilege
   - Audit logging through CloudWatch

### Monitoring

1. **CloudWatch Logs**:

   - AppSync operation logs
   - Resolver performance metrics
   - Error tracking

2. **AppSync Console**:
   - Real-time operation monitoring
   - Schema validation
   - Resolver testing

### Maintenance

1. **Updating Schema**:

   ```bash
   ./scripts/setup-appsync.sh
   ```

2. **Updating IAM Policies**:

   ```bash
   aws iam update-role-policy --role-name AmplifyAppRole --policy-name AppSyncAccess --policy-document file://policies/appsync-access.json
   ```

3. **Deploying Changes**:
   ```bash
   aws amplify start-job --app-id dopcvdkp4snbc --branch-name main --job-type RELEASE
   ```

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
