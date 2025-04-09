# Contact Form Debugging

**Status**: ✅ CLOSED - Issue resolved and verified working

## Issue Overview

The contact form on the live site was experiencing a 500 Internal Server Error when attempting to submit form data:

```
POST https://www.jeffknowlesjr.com/api/contact/submit 500 (Internal Server Error)
```

## Current Status (Updated)

After investigation using AWS CLI, we've identified the following issues:

1. **Table Name Mismatch**:

   - Lambda function is configured to use a table named `ContactForms`
   - Actual DynamoDB table is named `jeff-dev-contact-forms`
   - This mismatch causes the Lambda function to fail when trying to access the table

2. **IAM Policy Resource Mismatch**:

   - Lambda role's policy grants permissions to `arn:aws:dynamodb:us-east-1:159370117840:table/ContactForms`
   - Actual table is `jeff-dev-contact-forms`
   - Lambda function doesn't have permission to access the correct table

3. **Missing Status Field**:
   - The table schema requires a `status` field for the Global Secondary Index
   - Test items written to the table didn't include this field

## DynamoDB Table Configuration

The target table has the following structure:

```json
{
  "Table": {
    "AttributeDefinitions": [
      {
        "AttributeName": "createdAt",
        "AttributeType": "S"
      },
      {
        "AttributeName": "id",
        "AttributeType": "S"
      },
      {
        "AttributeName": "processedAt",
        "AttributeType": "S"
      },
      {
        "AttributeName": "status",
        "AttributeType": "S"
      }
    ],
    "TableName": "jeff-dev-contact-forms",
    "KeySchema": [
      {
        "AttributeName": "id",
        "KeyType": "HASH"
      },
      {
        "AttributeName": "createdAt",
        "KeyType": "RANGE"
      }
    ],
    "GlobalSecondaryIndexes": [
      {
        "IndexName": "StatusIndex",
        "KeySchema": [
          {
            "AttributeName": "status",
            "KeyType": "HASH"
          },
          {
            "AttributeName": "processedAt",
            "KeyType": "RANGE"
          }
        ],
        "Projection": {
          "ProjectionType": "ALL"
        }
      }
    ]
  }
}
```

## Lambda Function Configuration

The Lambda function `jeff-dev-process-form` is configured with:

- Environment variables:

  - `TO_EMAIL`: hello@jeffknowlesjr.com
  - `FROM_EMAIL`: hello@jeffknowlesjr.com
  - `CONTACT_FORM_TABLE`: ContactForms (incorrect)

- IAM Role: `jeff-dev-lambda-role` with policies:
  - `jeff-dev-lambda-policy`: Grants permissions to `ContactForms` table (incorrect)
  - `dynamodb-stream-policy`: Grants permissions to DynamoDB streams

## Required Fixes

1. **Update Lambda Environment Variables**:

   - Change `CONTACT_FORM_TABLE` from `ContactForms` to `jeff-dev-contact-forms`

2. **Update IAM Policy**:

   - Modify the `jeff-dev-lambda-policy` to include the correct table name in the Resource section

3. **Ensure Status Field is Included**:
   - Make sure contact form submissions include the `status` field with a value of `new`

## Implementation Steps

### 1. Update Lambda Environment Variables

```bash
aws lambda update-function-configuration \
  --function-name jeff-dev-process-form \
  --environment "Variables={TO_EMAIL=hello@jeffknowlesjr.com,FROM_EMAIL=hello@jeffknowlesjr.com,CONTACT_FORM_TABLE=jeff-dev-contact-forms}" \
  --region us-east-1
```

### 2. Update IAM Policy

```bash
aws iam put-role-policy \
  --role-name jeff-dev-lambda-role \
  --policy-name jeff-dev-lambda-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams",
          "ses:SendEmail",
          "ses:SendRawEmail",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Effect": "Allow",
        "Resource": [
          "arn:aws:dynamodb:us-east-1:159370117840:table/jeff-dev-contact-forms",
          "arn:aws:dynamodb:us-east-1:159370117840:table/jeff-dev-contact-forms/stream/*",
          "arn:aws:ses:us-east-1:159370117840:identity/*",
          "arn:aws:logs:us-east-1:159370117840:log-group:/aws/lambda/jeff-dev-process-form:*"
        ]
      }
    ]
  }' \
  --region us-east-1
```

### 3. Update API Route Code

Ensure the API route includes the `status` field when submitting to DynamoDB:

```typescript
// src/app/api/contact/submit/route.ts
import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Initialize the DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1'
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.error('Missing required fields in form submission')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create unique ID and timestamp
    const timestamp = new Date().toISOString()
    const uniqueId = `contact-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`

    // Prepare item for DynamoDB
    const item = {
      id: uniqueId,
      createdAt: timestamp,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'new' // Required field based on table schema
    }

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: 'jeff-dev-contact-forms',
        Item: item
      })
    )

    return NextResponse.json({ success: true, id: uniqueId })
  } catch (error) {
    console.error('Error saving contact form:', error)
    return NextResponse.json(
      {
        error: 'Failed to save contact form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

## Verification Steps

After implementing the fixes:

1. Submit a test form on the live site
2. Check production logs for successful submission messages
3. Query the DynamoDB table to confirm the entry was added:

```bash
aws dynamodb query --table-name jeff-dev-contact-forms --region us-east-1 \
  --key-condition-expression "id = :id" \
  --expression-attribute-values '{":id":{"S":"ID_FROM_LOGS"}}'
```

## Troubleshooting

If the contact form still fails after implementing the fixes:

1. **Check Network Requests**:

   - Use browser developer tools to inspect the network request and response
   - Look for specific error messages in the response body

2. **Review Production Logs**:

   - Check for authentication or permission errors
   - Look for any errors related to the DynamoDB table or Lambda function

3. **Verify AWS Permissions**:

   - Ensure the IAM role or user has the appropriate permissions
   - Test with the AWS CLI directly to isolate AWS issues from application issues

4. **Check Table Schema Compliance**:
   - Ensure all required fields (id, createdAt, status) are included in the submission
