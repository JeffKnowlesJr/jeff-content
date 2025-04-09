# Contact Form Production Debugging

**Status**: 🟡 INVESTIGATING - Contact form working in development but still returning 500 error in production.

## Issue Overview

The contact form on the live site (`https://www.jeffknowlesjr.com`) is still experiencing a 500 Internal Server Error when attempting to submit form data via the `/api/contact/submit` endpoint, even though it works correctly in the development environment.

```
POST https://www.jeffknowlesjr.com/api/contact/submit 500 (Internal Server Error)
```

Client-side error:

```
Error submitting contact form: Error: Failed to submit form. Please try again later.
```

## CLI Investigation Findings

After checking the AWS configuration using the CLI, the following issues were identified:

1. **Missing Environment Variables**: The main branch of the Amplify app has no environment variables set. This is critical because the application needs AWS credentials to access DynamoDB.

2. **Insufficient IAM Permissions**: The IAM role `jeff-content-amplify-role` has a DynamoDB policy attached, but it only grants `PutItem` permission. It's missing permissions for `GetItem` and `Query` operations.

3. **DynamoDB Table**: The table `jeff-dev-contact-forms` exists and is accessible, but the IAM role doesn't have sufficient permissions to interact with it properly.

## Build Log Analysis

The Amplify build logs reveal several potential issues:

1. **Missing AppSync Configuration**:

   ```
   [WARNING]: Missing AppSync configuration. Please check your environment variables.
   ```

2. **SSM Secrets Setup Failure**:

   ```
   [WARNING]: !Failed to set up process.env.secrets
   ```

3. **Environment Variables**: The build process is trying to set up environment variables, but some critical ones appear to be missing.

## Root Causes

1. **Missing Environment Variables**: The production environment is missing required environment variables for AWS credentials or DynamoDB configuration.

2. **IAM Role Issues**: The IAM role attached to the Amplify app has insufficient permissions for DynamoDB operations.

3. **DynamoDB Table Access**: The production environment might not have proper access to the DynamoDB table due to missing permissions.

## Resolution Steps

1. **Add Required Environment Variables**: Set the following environment variables in the Amplify console for the main branch:

   - `CONTACT_FORM_TABLE`: jeff-dev-contact-forms

2. **Update IAM Policy**: Modified the DynamoDB policy to include all necessary permissions:

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

3. **Enhanced Error Logging**: Updated the API route to capture more details about DynamoDB errors, including:
   - Using environment variables for table name and region
   - Adding more detailed error logging
   - Handling specific error types with appropriate responses

## Changes Made

1. **Updated IAM Policy**: Created a new policy version with expanded permissions for DynamoDB operations.

2. **Set Environment Variables**: Added the `CONTACT_FORM_TABLE` environment variable to the main branch.

3. **Enhanced API Route**: Updated the contact form submission API route with:
   - Environment variable support for table name and region
   - More detailed error logging
   - Better error handling for specific DynamoDB error types

## Next Steps

1. **Deploy Changes**: The changes need to be deployed to the production environment.

2. **Monitor Logs**: After deployment, monitor the logs for any errors when submitting the contact form.

3. **Test Form Submission**: Test the contact form on the live site to verify that it's working correctly.

## Verification

Once the issue is resolved, verify by:

1. Submitting a test form on the live site
2. Checking for a 200 OK response from the API
3. Verifying that the item appears in the DynamoDB table
