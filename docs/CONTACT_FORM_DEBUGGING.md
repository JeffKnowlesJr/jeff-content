# Contact Form Debugging

## Current Status: 🟡 INVESTIGATING

### Latest Implementation

- Using direct DynamoDB access via AWS SDK v3
- Table: `jeff-dev-contact-forms`
- Region: `us-east-1`
- Composite key: `id` (hash) + `createdAt` (range)
- StatusIndex: `status` (hash) + `processedAt` (range)

### Current Flow

1. Form submission from `/contact` page
2. POST request to `/api/contact/submit`
3. API route validates fields and creates DynamoDB item
4. Item structure:
   ```typescript
   {
     id: string,           // UUID v4
     createdAt: string,    // ISO timestamp (part of composite key)
     name: string,         // Required
     email: string,        // Required
     message: string,      // Required
     subject: string,      // Optional
     status: 'NEW',        // Required for StatusIndex
     processedAt: string,  // ISO timestamp (required for StatusIndex)
     updatedAt: string     // ISO timestamp
   }
   ```

### Local Testing Results

- Server running on port 3001 (3000 in use)
- POST requests to `/api/contact/submit` return 200
- DynamoDB write operations succeed
- No errors in server logs

### Next Steps

1. Verify DynamoDB table permissions in production
2. Test form submission in production environment
3. Monitor CloudWatch logs for any errors
4. Consider adding more detailed error logging

### Known Issues

- None currently identified in local testing
- Need to verify production environment configuration

### Environment Variables Required

```
AWS_REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### IAM Policy Required

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Query"],
      "Resource": "arn:aws:dynamodb:us-east-1:159370117840:table/jeff-dev-contact-forms"
    }
  ]
}
```
