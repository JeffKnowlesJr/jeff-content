#!/bin/bash

# Exit on error
set -e

# Create AppSync API
echo "Creating AppSync API..."
API_RESPONSE=$(aws appsync create-graphql-api \
  --name "JeffContactFormAPI" \
  --authentication-type "AWS_IAM" \
  --region us-east-1)

# Extract API ID and URL using grep and sed instead of jq
API_ID=$(echo "$API_RESPONSE" | grep -o '"apiId": "[^"]*' | sed 's/"apiId": "//')
API_URL=$(echo "$API_RESPONSE" | grep -o '"GRAPHQL": "[^"]*' | sed 's/"GRAPHQL": "//')

echo "Created API with ID: $API_ID"
echo "API URL: $API_URL"

# Create schema
echo "Creating GraphQL schema..."
SCHEMA=$(cat << 'EOF'
type ContactForm {
  id: ID!
  createdAt: String!
  name: String!
  email: String!
  message: String!
  subject: String
  status: String!
  processedAt: String!
  updatedAt: String!
}

input CreateContactFormInput {
  id: ID!
  createdAt: String!
  name: String!
  email: String!
  message: String!
  subject: String
  status: String!
  processedAt: String!
  updatedAt: String!
}

type Mutation {
  createContactForm(input: CreateContactFormInput!): ContactForm
}

type Query {
  getContactForm(id: ID!): ContactForm
}

schema {
  query: Query
  mutation: Mutation
}
EOF
)

# Base64 encode the schema
SCHEMA_BASE64=$(echo "$SCHEMA" | base64)

aws appsync start-schema-creation \
  --api-id $API_ID \
  --definition "$SCHEMA_BASE64"

# Wait for schema creation to complete
echo "Waiting for schema creation to complete..."
while true; do
  STATUS=$(aws appsync get-schema-creation-status --api-id $API_ID | grep -o '"status": "[^"]*' | sed 's/"status": "//')
  if [ "$STATUS" = "SUCCESS" ]; then
    echo "Schema creation completed successfully"
    break
  elif [ "$STATUS" = "FAILED" ]; then
    echo "Schema creation failed"
    exit 1
  fi
  echo "Schema creation in progress..."
  sleep 5
done

# Create DynamoDB data source
echo "Creating DynamoDB data source..."
aws appsync create-data-source \
  --api-id $API_ID \
  --name ContactFormTable \
  --type AMAZON_DYNAMODB \
  --service-role-arn "arn:aws:iam::159370117840:role/AmplifyAppRole" \
  --dynamodb-config "tableName=jeff-dev-contact-forms,awsRegion=us-east-1"

# Create resolvers
echo "Creating resolvers..."
aws appsync create-resolver \
  --api-id $API_ID \
  --type-name Mutation \
  --field-name createContactForm \
  --data-source-name ContactFormTable \
  --request-mapping-template '{"version": "2018-05-29", "operation": "PutItem", "key": {"id": {"S": "$input.id"}}, "attributeValues": {"createdAt": {"S": "$input.createdAt"}, "name": {"S": "$input.name"}, "email": {"S": "$input.email"}, "message": {"S": "$input.message"}, "subject": {"S": "$input.subject"}, "status": {"S": "$input.status"}, "processedAt": {"S": "$input.processedAt"}, "updatedAt": {"S": "$input.updatedAt"}}}' \
  --response-mapping-template '{"version": "2018-05-29", "operation": "PutItem", "key": {"id": {"S": "$input.id"}}, "attributeValues": {"createdAt": {"S": "$input.createdAt"}, "name": {"S": "$input.name"}, "email": {"S": "$input.email"}, "message": {"S": "$input.message"}, "subject": {"S": "$input.subject"}, "status": {"S": "$input.status"}, "processedAt": {"S": "$input.processedAt"}, "updatedAt": {"S": "$input.updatedAt"}}}'

aws appsync create-resolver \
  --api-id $API_ID \
  --type-name Query \
  --field-name getContactForm \
  --data-source-name ContactFormTable \
  --request-mapping-template '{"version": "2018-05-29", "operation": "GetItem", "key": {"id": {"S": "$input.id"}}}' \
  --response-mapping-template '{"version": "2018-05-29", "operation": "GetItem", "key": {"id": {"S": "$input.id"}}}'

echo "AppSync API setup complete!"
echo "API ID: $API_ID"
echo "API URL: $API_URL" 