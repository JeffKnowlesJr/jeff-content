# Amplify IAM Policy for Contact Form

This document outlines the IAM policy that needs to be added to the Amplify app to allow the contact form to write to DynamoDB.

## Policy Document

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:159370117840:table/jeff-dev-contact-forms"
    }
  ]
}
```

## Implementation Steps

1. **Create a Custom IAM Role for Amplify**:

   - Go to the AWS IAM console
   - Create a new role named `jeff-content-amplify-role`
   - Select "AWS service" as the trusted entity type
   - Select "Amplify" as the use case
   - Attach the policy document above as a custom policy

2. **Attach the Role to the Amplify App**:

   - Go to the AWS Amplify console
   - Select your app
   - Go to "App settings" > "Access control"
   - Select "Custom IAM role"
   - Choose the `jeff-content-amplify-role` you created

3. **Verify the Configuration**:
   - After attaching the role, redeploy your app
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
- The policy only allows PutItem operations, not read or delete operations
