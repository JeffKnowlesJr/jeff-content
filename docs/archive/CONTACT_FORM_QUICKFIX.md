# Contact Form Quick Fix

## Required Dependencies

The contact form relies on AWS SDK packages for SES integration. The following dependencies are already added to package.json with compatible versions:

```bash
npm install
```

Or if you need to install them manually:

```bash
npm install @aws-sdk/client-ses@^3.398.0 @aws-sdk/credential-provider-node@^3.398.0 @aws-sdk/signature-v4@^3.398.0 @aws-crypto/sha256-js@^2.0.0 @aws-sdk/protocol-http@^3.398.0 @aws-sdk/url-parser@^3.398.0
```

## Implementation

The contact form uses AWS AppSync and IAM authentication to store contact form submissions. The form submission code is located in `src/app/api/contact/submit/route.ts`.

### Email Notifications

The system sends email notifications for new contact form submissions via:

1. DynamoDB Streams: Triggers when new contact form entries are added
2. Lambda Function: `contact-form-notifications` processes the stream events
3. Amazon SES: Sends the notification emails to configured recipients

For detailed information about the notification system, see [CONTACT_FORM_SYSTEM.md](./CONTACT_FORM_SYSTEM.md).

### Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
# AppSync Configuration
APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
# Region specification (not using AWS_ prefix since it's reserved in Amplify)
REGION=us-east-1
# DynamoDB table for contact form submissions
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

**Note:** AWS credentials should be configured through IAM roles in production. For local development, use your AWS CLI configuration (in `~/.aws/credentials`).

## Local Development

The contact form implementation includes a local development mode that activates when:

- `APPSYNC_API_URL` is not set, or
- `NODE_ENV` is set to 'development'

In local mode, form submissions are stored in memory (not persisted) and you'll see detailed logs in the console.

## AWS Configuration

### Amplify Configuration

The application is deployed using AWS Amplify with the app ID: `dopcvdkp4snbc`

Environment variables are set in Amplify (not using AWS\_ prefix as it's reserved):

- `APPSYNC_API_URL`: The GraphQL API endpoint
- `REGION`: AWS region (e.g., 'us-east-1')
- `CONTACT_FORM_TABLE`: DynamoDB table name

### IAM Authentication

The contact form uses IAM authentication with SignatureV4, which provides:

- Enhanced security through temporary credentials
- Consistent authentication model across application
- No need to manage API keys in environment variables
- Better audit trail and compliance through IAM roles

In Amplify, the application automatically uses the instance role credentials.

## Deployment Scripts

Two scripts have been created to help with deployments:

1. `scripts/update-amplify-env.sh`: Updates environment variables in Amplify

   ```bash
   ./scripts/update-amplify-env.sh dopcvdkp4snbc main
   ```

2. `scripts/deploy-to-amplify.sh`: Detects your Amplify app and updates environment variables
   ```bash
   ./scripts/deploy-to-amplify.sh
   ```

**Security Note:** These scripts are added to .gitignore to prevent committing sensitive information.

## Troubleshooting

If you encounter errors with the contact form submission:

1. Check environment variables in `.env.local` (development) or Amplify (production)

   - The AppSync API URL must be correctly configured
   - Make sure you restart your server after updating local env vars

2. Confirm AWS permissions

   - For local development, make sure your AWS CLI is configured with appropriate permissions
   - In production, ensure the Amplify service role has AppSync permissions

3. Check your network tab for specific error messages

   - 500 errors with "Server configuration error" indicate missing environment variables
   - 400 errors indicate validation issues with the form data
   - 403 errors indicate AWS authorization problems

4. Review server logs

   - In development, check your terminal for detailed logs
   - In production, check Amplify's CloudWatch logs

5. Email notification issues
   - Check spam/junk folders for notification emails
   - Verify Lambda function settings in AWS Console
   - See [CONTACT_FORM_SYSTEM.md](./CONTACT_FORM_SYSTEM.md) for more troubleshooting
