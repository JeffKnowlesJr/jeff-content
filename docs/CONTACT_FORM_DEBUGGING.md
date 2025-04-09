# Contact Form Debugging Guide

## Issue Overview

The contact form on the live site was experiencing a 500 Internal Server Error when attempting to submit form data:

```
POST https://www.jeffknowlesjr.com/api/contact/submit 500 (Internal Server Error)
```

This document outlines the debugging process, identified issues, and implemented solution for the contact form integration with the DynamoDB table `jeff-dev-contact-forms`.

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

## Debugging Steps

### 1. AWS CLI Verification

We verified table access and structure using AWS CLI commands:

```bash
# Describe the table to confirm its structure
aws dynamodb describe-table --table-name jeff-dev-contact-forms --region us-east-1

# Test write access by inserting a test item
aws dynamodb put-item --table-name jeff-dev-contact-forms --region us-east-1 --item '{"id": {"S": "test-cli-123"}, "createdAt": {"S": "2023-05-15T12:00:00Z"}, "name": {"S": "Test User"}, "email": {"S": "test@example.com"}, "subject": {"S": "CLI Test"}, "message": {"S": "Testing DynamoDB access from CLI"}}'

# Verify the item was written correctly
aws dynamodb get-item --table-name jeff-dev-contact-forms --region us-east-1 --key '{"id": {"S": "test-cli-123"}, "createdAt": {"S": "2023-05-15T12:00:00Z"}}'
```

All commands completed successfully, indicating that the AWS credentials had proper read/write access to the table.

### 2. Issues Identified

1. **Missing Schema Fields**: The table schema requires a `status` field which was not included in the original implementation.

2. **Credentials Configuration**: The API route was explicitly using environment variables for credentials which might not be properly set up in the production environment.

3. **Error Logging**: Insufficient error logging made it difficult to diagnose the exact issue in production.

4. **Region Configuration**: Hardcoding the region to match the table's region (`us-east-1`) would eliminate one potential source of error.

## Implemented Solution

### 1. Updated API Route Code

The API route at `src/app/api/contact/submit/route.ts` was updated with these improvements:

```typescript
import { NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

// Initialize the DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: 'us-east-1' // Explicitly set to us-east-1 based on our testing
  // Use environment variables if available, otherwise rely on AWS credential provider chain
  // This will work with AWS IAM roles in production
})

const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Log received data (excluding sensitive info)
    console.log('Contact form submission received:', {
      hasName: !!data.name,
      hasEmail: !!data.email,
      hasSubject: !!data.subject,
      messageLength: data.message?.length || 0
    })

    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.error('Missing required fields in form submission:', {
        hasName: !!data.name,
        hasEmail: !!data.email,
        hasSubject: !!data.subject,
        hasMessage: !!data.message
      })

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

    console.log(
      'Attempting to save contact form to DynamoDB with ID:',
      uniqueId
    )

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: 'jeff-dev-contact-forms',
        Item: item
      })
    )

    console.log('Contact form saved successfully with ID:', uniqueId)

    return NextResponse.json({ success: true, id: uniqueId })
  } catch (error) {
    console.error('Error saving contact form to DynamoDB:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown error type',
      stack: error instanceof Error ? error.stack : 'No stack trace available'
    })

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

### 2. AWS SDK Package Installation

Required AWS SDK packages were installed:

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb --save
```

## Production Considerations

For the contact form to work correctly in production, ensure:

1. **AWS IAM Role Configuration**:

   - The hosting platform (Vercel/Netlify/etc.) should have an IAM role with permissions to write to the DynamoDB table
   - If using IAM roles, no additional configuration is needed in the codebase or environment variables

2. **Alternative: Environment Variables**:

   - If not using IAM roles, set these environment variables in the production hosting platform:
     ```
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=your_access_key_here
     AWS_SECRET_ACCESS_KEY=your_secret_key_here
     ```
   - The IAM user must have permissions to write to the DynamoDB table

3. **Monitoring**:
   - Monitor the production logs for any errors related to the contact form submission
   - The enhanced logging will provide detailed information if errors occur

## Verification Steps

To verify the contact form is working properly:

1. Submit a test form on the live site
2. Check production logs for successful submission messages
3. Query the DynamoDB table to confirm the entry was added:

```bash
aws dynamodb query --table-name jeff-dev-contact-forms --region us-east-1 \
  --key-condition-expression "id = :id" \
  --expression-attribute-values '{":id":{"S":"ID_FROM_LOGS"}}'
```

## Troubleshooting

If the contact form still fails in production:

1. **Check Network Requests**:

   - Use browser developer tools to inspect the network request and response
   - Look for specific error messages in the response body

2. **Review Production Logs**:

   - The enhanced error logging should provide detailed information
   - Check for authentication or permission errors

3. **Verify AWS Permissions**:

   - Ensure the IAM role or user has the appropriate permissions
   - Test with the AWS CLI directly to isolate AWS issues from application issues

4. **Check Table Schema Compliance**:
   - Ensure all required fields (id, createdAt, status) are included in the submission

User: So.. I'm reading your reports and running the commands myself. I've done the test, I am getting failed to save everytime on the deployed app now. Does... the app need permission to access dynamo? that's what it seems like? because then it's dyna lambda and ses right?
