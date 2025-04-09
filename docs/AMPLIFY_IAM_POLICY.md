# Amplify IAM Policy for Contact Form

This document outlines the IAM policy that needs to be added to the Amplify app to allow the contact form to write to DynamoDB.

## Policy Document

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

## Implementation Steps

1. **Update the Existing IAM Role for Amplify**:

   - Go to the AWS IAM console
   - Find the existing role named `jeff-content-amplify-role`
   - Go to the "Permissions" tab
   - Find the existing policy and click "Edit"
   - Replace the policy document with the one above
   - Save the changes

2. **Verify the Configuration**:
   - After updating the policy, redeploy your app
   - Test the contact form to ensure it can write to DynamoDB

## Troubleshooting

If the contact form still fails after implementing these changes:

1. Check the CloudWatch logs for the Amplify app to see detailed error messages
2. Verify that the IAM role has the correct permissions
3. Ensure the DynamoDB table exists and has the correct schema
4. Check that the table name in the code matches the actual table name

## Security Considerations

- The policy follows the principle of least privilege, only granting the minimum permissions needed
- The policy is scoped to a specific DynamoDB table
- The policy allows PutItem, GetItem, and Query operations, which are necessary for the contact form to function properly
