# Contact Form Quick Fix

## Required Dependencies

The contact form relies on AWS SDK packages for SES integration. The following dependencies are already added to package.json with compatible versions:

```bash
npm install
```

Or if you need to install them manually:

```bash
npm install @aws-sdk/client-ses@^3.360.0 @aws-sdk/credential-provider-node@^3.360.0 @aws-sdk/signature-v4@^3.360.0 @aws-crypto/sha256-js@^2.0.0 @aws-sdk/protocol-http@^3.360.0 @aws-sdk/url-parser@^3.360.0
```

## Implementation

The contact form uses AWS SES (Simple Email Service) to send emails. The form submission code is located in `src/app/api/contact/submit/route.ts`.

Key AWS credentials required:

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

These credentials should be stored in environment variables and not committed to the repository.

## Troubleshooting

If you encounter errors with the contact form submission:

1. Verify all required dependencies are installed
2. Check that AWS credentials are properly configured
3. Ensure the SES service is properly set up in your AWS account
4. Verify the recipient email is verified in SES (if in sandbox mode)
