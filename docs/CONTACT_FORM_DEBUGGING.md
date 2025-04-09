# Contact Form Debugging

## Current Status: �� INVESTIGATING

### Current Implementation

- Using direct DynamoDB access via AWS SDK v3
- Table: `jeff-dev-contact-forms`
- Region: `us-east-1`
- Composite key: `id` (hash) + `createdAt` (range)
- StatusIndex: `status` (hash) + `processedAt` (range)

### Implementation History

1. Initially used AppSync with GraphQL mutations
2. Switched to direct DynamoDB access for better reliability
3. Added comprehensive error logging and testing endpoints

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

### Testing Endpoints

1. `/api/contact/submit` - Main endpoint for form submissions
2. `/api/contact/test-db` - Test endpoint to verify DynamoDB access
3. `scripts/test-dynamodb-access.js` - Standalone script for testing DynamoDB access

### Local Testing Results

- Server running on port 3001 (3000 in use)
- POST requests to `/api/contact/submit` return 200
- DynamoDB write operations succeed locally
- No errors in server logs when testing locally
- Test endpoint `/api/contact/test-db` successfully writes and reads from DynamoDB

### Production Error

- POST to `https://www.jeffknowlesjr.com/api/contact/submit` returns 500
- Error message: `{"error":"Server configuration error"}`
- Client-side error: `Error submitting contact form: Error: Failed to submit form. Please try again later.`
- Additional error: `Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received`

### Root Cause Analysis

After extensive debugging, the most likely causes are:

1. **Missing Environment Variables in Production**:

   - The Amplify deployment may not have the required environment variables
   - `AWS_REGION` and `CONTACT_FORM_TABLE` need to be set in the Amplify console

2. **IAM Role Permissions**:

   - The IAM role attached to the Amplify app may not have the correct permissions
   - The policy needs to allow `dynamodb:PutItem`, `dynamodb:GetItem`, and `dynamodb:Query`

3. **DynamoDB Table Configuration**:
   - The table has a composite key (id + createdAt) which requires both fields for operations
   - The StatusIndex requires both status and processedAt fields

### Debugging Steps Taken

1. Added comprehensive logging to the API route
2. Created a test endpoint to verify DynamoDB access
3. Created a standalone test script
4. Verified local DynamoDB access works correctly
5. Confirmed the table schema and permissions

### Next Steps

1. **Verify Amplify Environment Variables**:

   - Check if `AWS_REGION` and `CONTACT_FORM_TABLE` are set in the Amplify console
   - Ensure they match the local values

2. **Verify IAM Role Permissions**:

   - Confirm the role has access to the DynamoDB table
   - Check if the table ARN is correct

3. **Test in Production**:

   - Visit `/api/contact/test-db` in production to test DynamoDB access
   - Check CloudWatch logs for detailed error messages

4. **Deploy Updated Code**:
   - Ensure the latest code with enhanced error logging is deployed
   - Monitor logs after deployment

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

### Lessons Learned

1. Always verify environment variables in production deployments
2. Use comprehensive error logging to identify issues
3. Create test endpoints to isolate and verify functionality
4. Ensure IAM permissions are correctly configured
5. Test locally with the same configuration as production
