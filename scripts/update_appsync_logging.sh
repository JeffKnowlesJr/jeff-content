#!/bin/bash

# Set variables
API_ID="p2s524zsande3cecseghtsxo5a"
ROLE_NAME="AppSyncLoggingRole"
REGION="us-east-1"
ACCOUNT_ID="159370117840"

# Create directory for policy backups
mkdir -p policy_backups
timestamp=$(date +%Y%m%d_%H%M%S)

echo "Downloading existing role policies..."
# Get existing role policies
aws iam list-role-policies --role-name $ROLE_NAME > policy_backups/role_policies_${timestamp}.json || echo "No inline policies found"
aws iam list-attached-role-policies --role-name $ROLE_NAME > policy_backups/attached_policies_${timestamp}.json || echo "No attached policies found"

# Download each inline policy
policies=$(aws iam list-role-policies --role-name $ROLE_NAME --query 'PolicyNames[]' --output text || echo "")
for policy in $policies; do
    aws iam get-role-policy --role-name $ROLE_NAME --policy-name $policy > policy_backups/inline_policy_${policy}_${timestamp}.json
done

echo "Creating new CloudWatch Logs policy..."
# Create new policy document combining existing permissions with CloudWatch Logs permissions
cat > policy_backups/new_policy_${timestamp}.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:${REGION}:${ACCOUNT_ID}:log-group:/aws/appsync/*"
            ]
        }
    ]
}
EOF

echo "Updating role policy..."
# Update the role policy
aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name AppSyncCloudWatchLogsPolicy \
    --policy-document file://policy_backups/new_policy_${timestamp}.json

echo "Updating AppSync API logging configuration..."
# Update AppSync API to use the role for logging
aws appsync update-graphql-api \
    --api-id $API_ID \
    --name jeff-dev \
    --authentication-type API_KEY \
    --log-config fieldLogLevel=ALL,cloudWatchLogsRoleArn=arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}

echo "Done! Policy backups saved in policy_backups directory" 