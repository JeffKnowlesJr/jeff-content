#!/bin/bash

# Script to set up IAM role for Amplify app
# This script creates an IAM role with permissions to write to DynamoDB

# Exit on error
set -e

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Variables
ROLE_NAME="jeff-content-amplify-role"
POLICY_NAME="jeff-content-dynamodb-policy"
TABLE_NAME="jeff-dev-contact-forms"
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
REGION="us-east-1"

# Create the policy document
cat > policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_NAME}"
    }
  ]
}
EOF

# Create the trust policy document
cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "amplify.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the IAM role
echo "Creating IAM role: $ROLE_NAME"
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://trust-policy.json

# Create the policy
echo "Creating IAM policy: $POLICY_NAME"
POLICY_ARN=$(aws iam create-policy \
  --policy-name $POLICY_NAME \
  --policy-document file://policy.json \
  --query "Policy.Arn" \
  --output text)

# Attach the policy to the role
echo "Attaching policy to role"
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn $POLICY_ARN

# Clean up
rm policy.json trust-policy.json

echo "IAM role setup complete!"
echo "Role ARN: arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
echo ""
echo "Next steps:"
echo "1. Go to the AWS Amplify console"
echo "2. Select your app"
echo "3. Go to 'App settings' > 'Access control'"
echo "4. Select 'Custom IAM role'"
echo "5. Choose the role you just created: ${ROLE_NAME}"
echo "6. Redeploy your app" 