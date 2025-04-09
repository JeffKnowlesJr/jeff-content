# Contact Form Authentication Solution

## Problem Overview

The contact form on the website is experiencing errors:

1. `Error submitting contact form: Error: Could not load credentials from any providers`
2. 500 (Internal Server Error) responses from `/api/contact/submit`

## Root Cause Analysis

After investigating the codebase and error logs, we identified the following issues:

1. **Inconsistent Authentication Approaches**:

   - The API routes were using direct DynamoDB access with IAM roles
   - Other parts of the application were using AppSync with API keys
   - This mixed approach led to credential provider conflicts

2. **Missing AWS Credentials in Production**:
   - The Amplify environment didn't have the correct AWS credentials configured
   - The IAM role for the Amplify app lacked necessary permissions

## Solution Implemented

We've standardized on IAM role-based authentication for AppSync across the entire application:

1. **Updated API Implementation**:

   - Modified `/api/contact/submit` to use IAM authentication with AppSync
   - Implemented AWS SigV4 request signing using the AWS SDK credential provider
   - Removed direct DynamoDB client code and API key references

2. **IAM Policy Configuration**:

   - Created a new script (`scripts/setup-appsync-iam.sh`) to set up IAM policies
   - Added documentation explaining why IAM authentication is required

3. **Environment Variables**:
   - Simplified to using only `APPSYNC_API_URL` and `AWS_REGION`
   - No need for API keys or direct AWS credentials

## Implementation Steps Completed

1. **Code Changes**:

   - Updated the contact form API route to use IAM authentication
   - Added necessary AWS SDK dependencies
   - Implemented proper error handling and logging

2. **Documentation**:

   - Created `docs/APPSYNC_IAM_AUTHENTICATION.md` explaining the approach
   - Created this solution document (`CONTACT_FORM_IAM_SOLUTION.md`)
   - Added CLI scripts for implementing required policies

3. **Required Environment Variables**:
   ```
   APPSYNC_API_URL=https://your-appsync-endpoint.appsync-api.us-east-1.amazonaws.com/graphql
   AWS_REGION=us-east-1
   ```

## Using IAM Authentication with AWS CLI

To configure the necessary IAM permissions, use the provided script:

```bash
# Run the IAM setup script
./scripts/setup-appsync-iam.sh --api-id YOUR_APPSYNC_API_ID

# Example with all parameters
./scripts/setup-appsync-iam.sh \
  --api-id abcdefghij \
  --region us-east-1 \
  --policy jeff-content-appsync-policy \
  --role jeff-content-amplify-role \
  --mutation createContactForm
```

## CLI Process Documentation

The `setup-appsync-iam.sh` script performs the following steps:

1. **Validates Prerequisites**:

   - Checks if AWS CLI is installed
   - Verifies AWS credentials are configured
   - Confirms the AppSync API exists

2. **Creates IAM Policy**:

   - Generates a fine-grained policy for specific GraphQL mutations
   - Uses AWS account ID and region from your credentials
   - Creates or updates the policy with versioning

3. **Attaches Policy to Role**:

   - Verifies the IAM role exists
   - Attaches the policy to the role
   - Verifies the attachment was successful

4. **Provides Next Steps**:
   - Outputs the necessary environment variables
   - Explains how to verify the configuration

## Benefits of This Approach

1. **Improved Security**:

   - No long-lived credentials in code or environment variables
   - Fine-grained access control through IAM policies
   - Automatic credential rotation through role assumption

2. **Simplified Maintenance**:

   - Consistent authentication approach across the application
   - Fewer environment variables to manage
   - Clear separation of concerns

3. **Easier Debugging**:
   - Better error visibility in CloudWatch logs
   - Clear IAM error messages when permissions are missing
   - Standardized AWS authentication patterns

## Future Improvements

1. **Automated Testing**:

   - Add automated tests for the contact form with different authentication scenarios
   - Create a test endpoint that verifies the IAM permissions

2. **Monitoring**:

   - Set up CloudWatch alarms for authentication failures
   - Add structured logging for better error analysis

3. **Documentation**:
   - Update architecture diagrams to reflect the authentication approach
   - Create onboarding documentation for new developers
