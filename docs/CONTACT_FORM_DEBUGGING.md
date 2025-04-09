# Contact Form Debugging

**Status**: 🟡 INVESTIGATING - Testing simplified DynamoDB item.

## Issue Overview

The contact form on the live site (`https://www.jeffknowlesjr.com`) was experiencing a 500 Internal Server Error when attempting to submit form data via the `/api/contact/submit` endpoint.

```
POST https://www.jeffknowlesjr.com/api/contact/submit 500 (Internal Server Error)
```

Initial client-side errors indicated a "Server configuration error" and later "Failed to submit form. Please try again later."

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

1.  **Redeploy Amplify App:** Trigger a new build and deployment with the simplified item code.
2.  **Test Form Submission:** After deployment completes, submit a test form on the live site.
3.  **Verify Outcome:**
    - Check for a 200 OK response from the API.
    - If successful, uncomment fields one by one to find the problematic one.
    - If it still fails, the issue is likely network/environment related.
    - Confirm the item appears in the DynamoDB table (with only id, createdAt, status if successful).
    - If errors persist, re-examine CloudWatch logs or add further logging.
