#!/bin/bash

# Script to set up IAM policies for AppSync authentication
# This script creates and attaches IAM policies for AppSync GraphQL operations

# Exit on error
set -e

# Default values
ROLE_NAME="jeff-content-amplify-role"
POLICY_NAME="jeff-content-appsync-policy"
REGION="us-east-1"
APPSYNC_API_ID=""
MUTATION_NAME="createContactForm"

# Terminal colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display help
function display_help() {
  echo -e "${BLUE}AppSync IAM Setup Script${NC}"
  echo "This script configures IAM policies for AppSync authentication."
  echo
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -a, --api-id ID        AppSync API ID (required)"
  echo "  -r, --region REGION    AWS region (default: us-east-1)"
  echo "  -p, --policy NAME      Policy name (default: jeff-content-appsync-policy)"
  echo "  -o, --role NAME        Role name (default: jeff-content-amplify-role)"
  echo "  -m, --mutation NAME    GraphQL mutation name (default: createContactForm)"
  echo "  -h, --help             Display this help message"
  echo
}

# Process arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -a|--api-id)
      APPSYNC_API_ID="$2"
      shift 2
      ;;
    -r|--region)
      REGION="$2"
      shift 2
      ;;
    -p|--policy)
      POLICY_NAME="$2"
      shift 2
      ;;
    -o|--role)
      ROLE_NAME="$2"
      shift 2
      ;;
    -m|--mutation)
      MUTATION_NAME="$2"
      shift 2
      ;;
    -h|--help)
      display_help
      exit 0
      ;;
    *)
      echo -e "${RED}Error: Unknown option $1${NC}"
      display_help
      exit 1
      ;;
  esac
done

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if API ID is provided
if [ -z "$APPSYNC_API_ID" ]; then
    echo -e "${RED}Error: AppSync API ID is required. Use -a or --api-id option.${NC}"
    display_help
    exit 1
fi

# Get AWS account ID
echo -e "${YELLOW}Retrieving AWS account ID...${NC}"
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to get AWS account ID. Check your AWS credentials.${NC}"
    exit 1
fi
echo -e "Account ID: ${GREEN}$ACCOUNT_ID${NC}"

# Verify the AppSync API exists
echo -e "${YELLOW}Verifying AppSync API exists...${NC}"
aws appsync get-graphql-api --api-id $APPSYNC_API_ID --region $REGION &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: AppSync API with ID '$APPSYNC_API_ID' not found in region '$REGION'.${NC}"
    exit 1
fi
echo -e "AppSync API ${GREEN}$APPSYNC_API_ID${NC} verified."

# Create JSON policy document
echo -e "${YELLOW}Creating policy document...${NC}"
RESOURCE_ARN="arn:aws:appsync:$REGION:$ACCOUNT_ID:apis/$APPSYNC_API_ID/types/Mutation/fields/$MUTATION_NAME"
cat > appsync-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "appsync:GraphQL"
      ],
      "Resource": [
        "$RESOURCE_ARN"
      ]
    }
  ]
}
EOF
echo -e "Policy document created for resource: ${GREEN}$RESOURCE_ARN${NC}"

# Check if the policy exists
echo -e "${YELLOW}Checking if policy '$POLICY_NAME' exists...${NC}"
POLICY_EXISTS=false
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

aws iam get-policy --policy-arn $POLICY_ARN &> /dev/null
if [ $? -eq 0 ]; then
    POLICY_EXISTS=true
    echo -e "Policy ${GREEN}$POLICY_NAME${NC} already exists."
else
    echo -e "Policy ${YELLOW}$POLICY_NAME${NC} does not exist. Will create it."
fi

# Create or update the policy
if [ "$POLICY_EXISTS" = true ]; then
    echo -e "${YELLOW}Creating new version of existing policy...${NC}"
    aws iam create-policy-version \
        --policy-arn $POLICY_ARN \
        --policy-document file://appsync-policy.json \
        --set-as-default
    if [ $? -eq 0 ]; then
        echo -e "Policy ${GREEN}$POLICY_NAME${NC} updated successfully."
    else
        echo -e "${RED}Failed to update policy.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Creating new policy: $POLICY_NAME${NC}"
    aws iam create-policy \
        --policy-name $POLICY_NAME \
        --policy-document file://appsync-policy.json \
        --description "Allows GraphQL operations on AppSync API for contact form submissions"
    
    if [ $? -eq 0 ]; then
        echo -e "Policy ${GREEN}$POLICY_NAME${NC} created successfully."
    else
        echo -e "${RED}Failed to create policy.${NC}"
        exit 1
    fi
fi

# Check if the role exists
echo -e "${YELLOW}Checking if role '$ROLE_NAME' exists...${NC}"
aws iam get-role --role-name $ROLE_NAME &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Role '$ROLE_NAME' does not exist. Please create it first or use an existing role.${NC}"
    echo -e "You can use our existing script: ${BLUE}scripts/setup-amplify-iam.sh${NC}"
    rm appsync-policy.json
    exit 1
fi
echo -e "Role ${GREEN}$ROLE_NAME${NC} exists."

# Attach the policy to the role
echo -e "${YELLOW}Attaching policy to role...${NC}"
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn $POLICY_ARN

if [ $? -eq 0 ]; then
    echo -e "Policy ${GREEN}$POLICY_NAME${NC} attached to role ${GREEN}$ROLE_NAME${NC} successfully."
else
    echo -e "${RED}Failed to attach policy to role.${NC}"
    rm appsync-policy.json
    exit 1
fi

# Clean up
rm appsync-policy.json

# Verify the policy attachment
echo -e "${YELLOW}Verifying policy attachment...${NC}"
aws iam list-attached-role-policies --role-name $ROLE_NAME --query "AttachedPolicies[?PolicyName=='$POLICY_NAME'].PolicyName" --output text
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to verify policy attachment.${NC}"
    exit 1
fi

echo -e "\n${GREEN}=== AppSync IAM Setup Complete ===${NC}"
echo -e "AppSync API ID: ${BLUE}$APPSYNC_API_ID${NC}"
echo -e "IAM Policy ARN: ${BLUE}$POLICY_ARN${NC}"
echo -e "IAM Role: ${BLUE}$ROLE_NAME${NC}"
echo -e "GraphQL Mutation: ${BLUE}$MUTATION_NAME${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Ensure these environment variables are set in your Amplify console:"
echo -e "   ${BLUE}APPSYNC_API_URL${NC} = https://$APPSYNC_API_ID.appsync-api.$REGION.amazonaws.com/graphql"
echo -e "   ${BLUE}AWS_REGION${NC} = $REGION"
echo -e "2. Redeploy your application to apply the changes"
echo -e "3. Monitor CloudWatch logs for any authentication errors" 