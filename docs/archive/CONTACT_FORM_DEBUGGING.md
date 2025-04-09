# Contact Form Debugging

**Status**: 🟢 RESOLVED - Fixed ValidationException by setting a valid value for processedAt field. Working in development, pending production verification.

## Issue Overview

The contact form on the live site (`https://www.jeffknowlesjr.com`) was experiencing a 500 Internal Server Error when attempting to submit form data via the `/api/contact/submit` endpoint.

```
POST https://www.jeffknowlesjr.com/api/contact/submit 500 (Internal Server Error)
```

Initial client-side errors indicated a "Server configuration error" and later "Failed to submit form. Please try again later."

**Latest Errors (2023-XX-XX):**

```
api/contact/submit:1 Failed to load resource: the server responded with a status of 500 ()
hook.js:608 Error submitting contact form: Error: Failed to submit form. Please try again later.
```

## Root Cause

The investigation revealed a ValidationException from DynamoDB:

```
ValidationException: One or more parameter values are not valid. A value specified for a secondary index key is not supported. The AttributeValue for a key attribute cannot contain an empty string value. IndexName: StatusIndex, IndexKey: processedAt
```

The issue was that the `processedAt` field is part of a secondary index (StatusIndex) in DynamoDB, and it cannot contain an empty string value. When we tried to save an item with an empty string for `processedAt`, DynamoDB rejected it with a ValidationException.

## Current Implementation

The contact form submission is handled by a Next.js API route (`src/app/api/contact/submit/route.ts`) that writes directly to a DynamoDB table (`jeff-dev-contact-forms`). The implementation:

1. Validates required fields (name, email, message)
2. Creates a unique ID and timestamp
3. Prepares a DynamoDB item with all required fields:
   ```javascript
   const item = {
     id: uniqueId,
     createdAt: timestamp,
     name: body.name,
     email: body.email,
     subject: body.subject || '',
     message: body.message,
     status: 'new',
     processedAt: timestamp // Set to timestamp instead of empty string
   }
   ```
4. Attempts to save the item to DynamoDB using the AWS SDK
5. Returns a success response or error message

The AWS configuration (`src/lib/aws-config.ts`) initializes the DynamoDB client with:

- Region: 'us-east-1'
- Credentials: Automatically provided by IAM roles in production, environment variables in development

## Test Route

There is a test route available at `/api/contact/test` that can be used to verify the contact form submission functionality. This route:

1. Uses the `testContactFormSubmission` function from `src/services/server-api.ts`
2. Submits a test contact form with predefined data
3. Returns the result of the submission

To test the contact form submission:

1. Start the local development server (`npm run dev`)
2. Navigate to `http://localhost:3000/api/contact/test` in your browser
3. Check the console logs for any errors
4. Verify that the test submission is successful

## Resolution Path

The following steps were taken:

1. **Enhanced Error Logging**: Added detailed error logging for DynamoDB errors, including error name, message, code, type, and metadata.
2. **Error Analysis**: Identified the specific ValidationException from DynamoDB regarding the `processedAt` field.
3. **Code Fix**: Updated the API route to set `processedAt` to the same timestamp as `createdAt` instead of an empty string.
4. **Verification**: Verified the fix in the development environment using the test route.

## Final DynamoDB Table Configuration

The DynamoDB table `jeff-dev-contact-forms` has the following configuration:

- **Primary Key**: `id` (String)
- **Global Secondary Index**: `StatusIndex`
  - **Partition Key**: `status` (String)
  - **Sort Key**: `processedAt` (String)
- **Required Fields**:
  - `id` (String)
  - `createdAt` (String)
  - `name` (String)
  - `email` (String)
  - `message` (String)
  - `status` (String)
  - `processedAt` (String) - Cannot be empty

## Verification

The fix has been verified in the development environment:

1. **Test Route**: Used the test route at `/api/contact/test` to verify the contact form submission.
2. **Manual Testing**: Submitted a contact form through the website interface and confirmed no errors.
3. **DynamoDB Check**: Verified that the item appears in the DynamoDB table with all fields correctly set.

## Next Steps

1. **Deploy to Production**: Deploy the fix to the production environment.
2. **Monitor**: Monitor the contact form submissions to ensure they continue to work correctly.
3. **Documentation**: Update the documentation to reflect the correct usage of the `processedAt` field.

## Lessons Learned

1. **DynamoDB Constraints**: When using DynamoDB with secondary indexes, all key attributes must have valid values (not empty strings).
2. **Error Logging**: Detailed error logging is essential for quickly identifying and fixing issues.
3. **Schema Validation**: Always validate the item structure against the table schema before attempting to save to DynamoDB.
