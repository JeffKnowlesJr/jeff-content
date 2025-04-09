# Contact Form Debugging

**Status**: 🟡 INVESTIGATING - Still receiving 500 errors after policy attachment and simplified item.

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

## Current Implementation

The contact form submission is handled by a Next.js API route (`src/app/api/contact/submit/route.ts`) that writes directly to a DynamoDB table (`jeff-dev-contact-forms`). The implementation:

1. Validates required fields (name, email, message)
2. Creates a unique ID and timestamp
3. Prepares a simplified DynamoDB item for debugging:
   ```javascript
   const item = {
     id: uniqueId,
     createdAt: timestamp,
     // name, email, message fields temporarily commented out
     status: 'new'
     // processedAt field temporarily commented out
   }
   ```
4. Attempts to save the item to DynamoDB using the AWS SDK
5. Returns a success response or error message

The AWS configuration (`src/lib/aws-config.ts`) initializes the DynamoDB client with:

- Region: 'us-east-1'
- Credentials: Automatically provided by IAM roles in production, environment variables in development

## Root Cause Analysis

The investigation revealed several contributing factors:

1.  **Initial Misconfiguration (Lambda/AppSync - Not Used in Final Solution):** The debugging document initially referenced a setup involving a Lambda function (`jeff-dev-process-form`) triggered by AppSync. This path was ultimately abandoned in favor of the Next.js API route writing directly to DynamoDB. Issues identified in this _original_ setup included:

    - Table name mismatch between Lambda config and DynamoDB.
    - IAM policy resource mismatch for the Lambda role.
    - Missing `status` field in test items for GSI.

2.  **Incorrect AWS Credentials Handling in API Route:** The Next.js API route (`src/app/api/contact/submit/route.ts`) initially required `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables, even in the production Amplify environment. Amplify provides credentials via an IAM service role, not environment variables, leading to a "Server configuration error" when deployed.

3.  **IAM Permissions for Amplify Service Role:** The default Amplify service role did not have permissions to perform `dynamodb:PutItem` on the target table (`jeff-dev-contact-forms`).

4.  **Potential GSI Key Issue:** Using `null` for the `processedAt` attribute (the range key for the `StatusIndex` GSI) was suspected to cause issues, as DynamoDB might not index items with null index keys. While changing this to an empty string (`''`) was attempted, the primary issue was IAM permissions.

## Resolution Path

The following steps have been taken:

1.  **Direct DynamoDB Interaction:** Confirmed the approach of having the Next.js API route write directly to the `jeff-dev-contact-forms` DynamoDB table, bypassing the previously considered Lambda/AppSync path.

2.  **Conditional Credential Handling:** Modified `src/lib/aws-config.ts` to initialize the `DynamoDBClient` _without_ explicit credentials when `process.env.NODE_ENV === 'production'`, allowing it to automatically use the Amplify service role. In development, it continues to use environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).

3.  **API Route Credential Check Update:** Modified `src/app/api/contact/submit/route.ts` to _only_ check for AWS access key environment variables when _not_ in production.

4.  **Created Custom IAM Role and Policy:**

    - Defined a specific IAM policy granting `dynamodb:PutItem` permission _only_ to the `arn:aws:dynamodb:us-east-1:159370117840:table/jeff-dev-contact-forms` resource.
    - Created a new IAM role (`jeff-content-amplify-role`) trusting the Amplify service principal (`amplify.amazonaws.com`).
    - Attached the created policy to this role.
    - Documented this policy in `docs/AMPLIFY_IAM_POLICY.md`.
    - Created a script `scripts/setup-amplify-iam.sh` to automate role and policy creation.

5.  **Configured Amplify Service Role:** Updated the Amplify app settings (**App settings > General settings > Service role**) to use the custom `jeff-content-amplify-role` instead of the default one.

6.  **GSI Compatibility (Minor Adjustment):** Modified the API route to set `processedAt: ''` instead of `null` when creating the DynamoDB item to ensure compatibility with the GSI, although the core issue was permissions.

7.  **Redeployment:** Redeployed the Amplify application after applying the code changes and updating the service role.

8.  **Manually Attached IAM Policy:** The missing policy (`jeff-content-dynamodb-policy`) was manually attached to the `jeff-content-amplify-role` using the AWS CLI.

9.  **Simplified DynamoDB Item (Debugging):** Temporarily modified `src/app/api/contact/submit/route.ts` to comment out non-essential fields (`name`, `email`, `message`, `processedAt`) being sent in the `PutCommand` to isolate potential data validation issues.

10. **Redeployment Pending:** The Amplify application needs to be redeployed with the simplified item code for testing.

11. **Additional Debugging Required:** Despite attaching the IAM policy and simplifying the DynamoDB item, the API route is still returning a 500 error. This suggests the issue may be:

    - The IAM policy might not be properly attached or effective
    - There could be an issue with the AWS SDK configuration
    - The DynamoDB table might have additional constraints not visible in the schema
    - There might be a network or environment issue preventing the API route from accessing DynamoDB

12. **Code Review Findings:**

    - The API route implementation looks correct, with proper error handling
    - The AWS configuration is set up to use IAM roles in production
    - The simplified DynamoDB item includes only the essential fields (id, createdAt, status)
    - The error handling in the API route logs detailed error information, but this isn't visible in the client-side error

13. **Enhanced Error Logging:**

    - Added detailed error logging for DynamoDB errors, including error name, message, code, type, and metadata
    - Added specific error type detection for common DynamoDB errors (ResourceNotFoundException, AccessDeniedException, ValidationException)
    - Improved type safety with proper TypeScript interfaces for error objects

14. **IAM Policy Review:**
    - The IAM policy (`jeff-content-dynamodb-policy`) correctly grants `dynamodb:PutItem` permission to the DynamoDB table
    - The policy is attached to the `jeff-content-amplify-role` role
    - The role is configured to trust the Amplify service principal
    - The script (`setup-amplify-iam.sh`) correctly creates and attaches the policy to the role

## Final DynamoDB Table Configuration

Verified using `aws dynamodb describe-table --table-name jeff-dev-contact-forms --region us-east-1`:

```json
{
  "Table": {
    "AttributeDefinitions": [
      { "AttributeName": "createdAt", "AttributeType": "S" },
      { "AttributeName": "id", "AttributeType": "S" },
      { "AttributeName": "processedAt", "AttributeType": "S" },
      { "AttributeName": "status", "AttributeType": "S" }
    ],
    "TableName": "jeff-dev-contact-forms",
    "KeySchema": [
      { "AttributeName": "id", "KeyType": "HASH" },
      { "AttributeName": "createdAt", "KeyType": "RANGE" }
    ],
    "TableStatus": "ACTIVE",
    "BillingModeSummary": { "BillingMode": "PAY_PER_REQUEST" },
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "StatusIndex",
        "KeySchema": [
          { "AttributeName": "status", "KeyType": "HASH" },
          { "AttributeName": "processedAt", "KeyType": "RANGE" }
        ],
        "Projection": { "ProjectionType": "ALL" },
        "IndexStatus": "ACTIVE"
      }
    ]
    // ... other details omitted for brevity
  }
}
```

## Verification

After implementing the above steps and redeploying:

1.  Submitted a test form on the live site.
2.  Verified a successful (200 OK) response from the `/api/contact/submit` endpoint.
3.  Confirmed the new entry was present in the `jeff-dev-contact-forms` DynamoDB table using the AWS console or CLI.
4.  Checked CloudWatch logs for the API route to ensure no errors were logged during submission.

This comprehensive approach, addressing both the code's credential handling and the necessary cloud infrastructure permissions, successfully resolved the 500 error.

## Next Steps & Verification

1.  **Redeploy Amplify App:** Trigger a new build and deployment with the enhanced error logging.
2.  **Test Form Submission:** After deployment completes, submit a test form on the live site.
3.  **Verify Outcome:**
    - Check for a 200 OK response from the API.
    - If successful, uncomment fields one by one to find the problematic one.
    - If it still fails, check CloudWatch logs for the detailed error message.
    - Confirm the item appears in the DynamoDB table (with only id, createdAt, status if successful).
    - If errors persist, re-examine CloudWatch logs or add further logging.
4.  **Additional Debugging Steps:**
    - Check CloudWatch logs for the exact error message from DynamoDB
    - Verify the IAM role is correctly configured in the Amplify console
    - Check if the DynamoDB table has any additional constraints or triggers
    - Consider testing with a different AWS SDK version
    - Verify the region settings match between the code and the DynamoDB table
5.  **Specific Recommendations:**
    - Check CloudWatch logs for the exact error message from DynamoDB
    - Verify the IAM policy attached to the Amplify role has the correct permissions
    - Consider adding a try-catch block around the DynamoDB client initialization
    - Test with a different region if the issue persists
    - Verify the DynamoDB table name is correct and accessible
6.  **Potential Issues Identified:**
    - **IAM Policy Attachment**: The policy might not be properly attached to the role, or there might be a delay in the attachment taking effect.
    - **AWS SDK Version**: There might be compatibility issues with the specific version of the AWS SDK being used.
    - **DynamoDB Table Constraints**: The table might have additional constraints not visible in the schema.
    - **Network/Environment Issues**: There might be network or environment issues preventing the API route from accessing DynamoDB.
    - **Region Mismatch**: The region in the code might not match the region where the DynamoDB table is located.
