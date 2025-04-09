# Contact Form Quick Fix Guide

## Required Dependencies

The contact form relies on several AWS SDK packages for AppSync and SES integration. The following dependencies are required:

```bash
npm install @aws-sdk/client-ses @aws-sdk/credential-provider-node @aws-sdk/signature-v4 @aws-crypto/sha256-js @aws-sdk/protocol-http @aws-sdk/url-parser uuid
```

All of these dependencies are already included in the project's package.json.

## Implementation Overview

The contact form system consists of:

1. **Frontend Component**: `src/components/ContactForm.tsx`
2. **API Endpoint**: `src/app/api/contact/submit/route.ts`
3. **DynamoDB Table**: Stores form submissions
4. **Lambda Function**: Processes new submissions and sends email notifications
5. **Amazon SES**: Sends the notification emails

## Environment Variables

Create a `.env.local` file for local development with:

```
# AppSync Configuration
APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

## Authentication

The system uses IAM authentication with AWS Signature Version 4 (SigV4) to communicate with AppSync. In production (Amplify), the application automatically uses instance role credentials.

## Troubleshooting

If you encounter issues with form submissions:

1. **Check environment variables** - Ensure APPSYNC_API_URL, REGION, and CONTACT_FORM_TABLE are set
2. **Verify AWS credentials** - Local development uses AWS CLI credentials
3. **Check network requests** - Look for specific error codes in browser dev tools
4. **Review logs** - Check console logs for detailed error messages
5. **Email delivery issues** - Check spam folders and Lambda function logs

## Local Development Mode

The system includes a local development mode that activates when:

- APPSYNC_API_URL is not set, or
- You manually set IS_LOCAL_DEV = true in the route.ts file

This stores submissions in memory for testing without requiring AWS resources.

## Additional Resources

For more details about the contact form system, see:

- [CONTACT_FORM_SYSTEM.md](./CONTACT_FORM_SYSTEM.md) - Complete system architecture documentation
- Lambda function: `lambda/contact-form-processor/index.js` - Email notification handler
