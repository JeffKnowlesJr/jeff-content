# Contact Form Notification System

This document provides a comprehensive overview of the contact form system implemented in this project, including form submission, data storage, and email notifications.

## System Architecture

The contact form system uses the following AWS services:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐     ┌────────────────┐
│                 │     │                  │     │                     │     │                │
│  Contact Form   │────▶│  AppSync GraphQL │────▶│  DynamoDB Table     │────▶│  Lambda        │
│  (Next.js)      │     │  API             │     │  (Stream Enabled)   │     │  Function      │
│                 │     │                  │     │                     │     │                │
└─────────────────┘     └──────────────────┘     └─────────────────────┘     └────────┬───────┘
                                                                                      │
                                                                                      ▼
                                                                             ┌────────────────┐
                                                                             │                │
                                                                             │  Amazon SES    │
                                                                             │  (Email)       │
                                                                             │                │
                                                                             └────────────────┘
```

## Components

### 1. Contact Form (Frontend)

The contact form is implemented in `src/components/ContactForm.tsx` and sends form data to an API endpoint at `/api/contact/submit`.

### 2. API Endpoint (Backend)

The API endpoint is implemented in `src/app/api/contact/submit/route.ts`. It:

- Receives form submissions
- Validates required fields
- Uses IAM authentication to send data to AppSync
- Returns success/error responses to the client

### 3. DynamoDB Table

- Table Name: `jeff-dev-contact-forms`
- Stream: Enabled with `NEW_AND_OLD_IMAGES`
- Key fields:
  - `id` (UUID generated for each submission)
  - `createdAt` (ISO timestamp)

### 4. Lambda Function

- Name: `contact-form-notifications`
- Runtime: Node.js 20.x
- Handler: `notifyContactForm.handler`
- Environment Variables:
  - `FROM_EMAIL`: hello@jeffknowlesjr.com
  - `TO_EMAIL`: hello@jeffknowlesjr.com
  - `CC_EMAIL`: jeffknowlesjr@gmail.com
- Trigger: DynamoDB Stream from `jeff-dev-contact-forms` table

### 5. Amazon SES

- Verified Identities:
  - Domain: `jeffknowlesjr.com`
  - Email: `hello@jeffknowlesjr.com`
- Sending Status: Production (not in sandbox)
- Daily Sending Quota: 200 emails

## Configuration

### Environment Variables

The system requires the following environment variables:

#### Local Development (.env.local)

```
APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

#### Production (Amplify App: dopcvdkp4snbc)

```
APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### AWS IAM Permissions

The system uses IAM roles for authentication:

1. **Amplify App Role**:

   - Needs permissions to execute AppSync GraphQL operations
   - Configured by `scripts/setup-appsync-iam.sh`

2. **Lambda Role**:
   - Name: `contact-form-lambda-role`
   - Needs permissions for:
     - DynamoDB Stream reading
     - SES email sending
     - CloudWatch logging

## Email Notification Flow

1. User submits the contact form
2. Form data is sent to the API endpoint
3. API endpoint stores the data in DynamoDB
4. DynamoDB Stream triggers the Lambda function
5. Lambda function formats and sends email using SES
6. Email is delivered to the recipient(s)

## Troubleshooting

### Common Issues and Solutions

#### Email Delivery Issues

1. **Emails Not Received**:

   - Check spam/junk folders
   - Verify the Lambda function logs for errors
   - Ensure SES sending limits haven't been reached

2. **Lambda Errors**:

   - Check CloudWatch logs at `/aws/lambda/contact-form-notifications`
   - Verify IAM permissions for the Lambda role

3. **DynamoDB Stream Issues**:
   - Confirm stream is enabled and properly configured
   - Check the event source mapping status

### Monitoring

Monitor the system using:

1. **CloudWatch Metrics**:

   - Lambda execution metrics
   - DynamoDB write operations
   - SES delivery metrics

2. **CloudWatch Logs**:
   - Lambda function logs for notification issues
   - API Gateway logs for submission issues

## Maintaining the System

### Adding Additional Recipients

To add additional email recipients:

```bash
aws lambda update-function-configuration \
  --function-name contact-form-notifications \
  --environment "Variables={FROM_EMAIL=hello@jeffknowlesjr.com,TO_EMAIL=hello@jeffknowlesjr.com,CC_EMAIL=additional@example.com}"
```

### Updating SES Configuration

If you need to change sending limits or other SES settings:

1. Navigate to the Amazon SES console
2. Request production access if needed
3. Add and verify new sending identities as required

### Checking Form Submissions

To view recent contact form submissions:

```bash
aws dynamodb scan --table-name jeff-dev-contact-forms --limit 5
```

## Security Considerations

1. **Email Content**: Email contents are not encrypted by default. Consider sensitive data handling.
2. **IAM Authentication**: The system uses IAM roles for secure authentication instead of API keys.
3. **SES Configuration**: SES is configured to prevent email spoofing by verifying sending domains.

## Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
- [Amazon SES Documentation](https://docs.aws.amazon.com/ses/latest/dg/welcome.html)
- [DynamoDB Streams Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html)
