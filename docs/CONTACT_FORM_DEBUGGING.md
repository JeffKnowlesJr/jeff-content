# Contact Form Debugging

## Current Status: 🟡 INVESTIGATING

### Current Implementation

- Using AppSync GraphQL API with IAM authentication
- Table: `jeff-dev-contact-forms`
- Region: `us-east-1`
- AppSync API URL: `https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql`
- Composite key: `id` (hash) + `createdAt` (range)
- StatusIndex: `status` (hash) + `processedAt` (range)

### Implementation History

1. Initially used AppSync with GraphQL mutations
2. Switched to direct DynamoDB access for troubleshooting
3. Added comprehensive error logging and testing endpoints
4. Discovered local development was using a mock implementation
5. Created new AppSync API with proper IAM authentication
6. Updated Amplify environment variables with new AppSync endpoint
7. **Latest Issue**: GraphQL schema mismatch causing "Variable 'input' has coerced Null value for NonNull type 'String!'" error
8. **Schema Flip-Flopping**: Attempted multiple approaches to match the schema:
   - First attempt: Added all fields from local implementation
   - Second attempt: Simplified to only required fields
   - Third attempt: Reverted back to all fields
   - Current attempt: Simplified to only name, email, and message
9. **Resolver Mismatch**: Discovered that the resolver expects a `status` field, but it's not defined in the schema

### Current Flow

1. Form submission from `/contact` page
2. POST request to `/api/contact/submit`
3. API route uses AppSync with IAM authentication to create submission
4. Item structure:
   ```typescript
   {
     id: string,           // UUID v4
     createdAt: string,    // ISO timestamp (part of composite key)
     name: string,         // Required
     email: string,        // Required
     message: string,      // Required
     subject: string,      // Optional
     status: 'NEW',        // Required for StatusIndex
     processedAt: string,  // ISO timestamp (required for StatusIndex)
     updatedAt: string     // ISO timestamp
   }
   ```

### AppSync Configuration

1. **API Details**:

   - Name: JeffContactFormAPI
   - Authentication: IAM
   - Region: us-east-1
   - API ID: 5o56c4gzlfaohlo7gnaauyffsy

2. **Data Source**:

   - Name: ContactFormTable
   - Type: DynamoDB
   - Table: jeff-dev-contact-forms
   - IAM Role: AmplifyAppRole

3. **Resolvers**:
   - Mutation.createContactForm: Creates new contact form submissions
   - Query.getContactForm: Retrieves contact form submissions by ID

### Environment Variables

```
# Production (Amplify Console)
APPSYNC_API_URL=https://5o56c4gzlfaohlo7gnaauyffsy.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### Latest Error Investigation

**Error Message**: "Variable 'input' has coerced Null value for NonNull type 'String!'"

**Root Cause Analysis**:

1. **Schema Mismatch**: The GraphQL schema in AppSync doesn't match what we're sending

   - Our code is sending: `{ name, email, message }`
   - AppSync schema expects: Different structure (possibly with additional required fields)

2. **Schema Verification**:

   - We need to verify the exact schema in AppSync
   - The error suggests a required String field is missing or null

3. **Solution Attempts**:

   - First attempt: Added all fields from our local implementation
   - Second attempt: Simplified to only required fields
   - Third attempt: Reverted back to all fields
   - Current attempt: Simplified to only name, email, and message based on schema.graphql

4. **Schema Flip-Flopping**:

   - We've been inconsistent in our approach to matching the schema
   - This suggests we need to verify the actual schema in AppSync
   - The schema in our codebase might not match what's deployed

5. **Resolver Mismatch**:
   - The resolver for `createContactForm` expects a `status` field in the input
   - This field is not defined in the schema in `schema.graphql`
   - We've updated our code to include this field, even though it's not in the schema

### Next Steps

1. **Verify AppSync Schema**:

   - Use AWS CLI to get the current schema: `aws appsync get-introspection-schema --api-id 5o56c4gzlfaohlo7gnaauyffsy --format SDL`
   - Compare with our expected schema

2. **Check Resolver Configuration**:

   - Verify the resolver mapping template for the createContactForm mutation
   - Ensure it correctly handles the input structure

3. **Test with AWS Console**:

   - Use the AppSync console to test the mutation directly
   - Compare successful request structure with our code

4. **Update Code to Match Schema**:
   - Once we have the correct schema, update our code to match exactly
   - Ensure all required fields are provided with correct types

### Resolution Steps Taken

1. **Created New AppSync API**:

   - Set up with IAM authentication
   - Created DynamoDB data source
   - Configured resolvers for mutations and queries

2. **Updated Environment Variables**:

   - Added APPSYNC_API_URL to Amplify Console
   - Set REGION to us-east-1
   - Configured CONTACT_FORM_TABLE

3. **Implemented IAM Authentication**:

   - Added necessary IAM permissions to AmplifyAppRole
   - Updated code to use AWS Signature V4 for authentication

4. **Added Comprehensive Logging**:

   - Enhanced error handling and logging
   - Added detailed request/response logging for debugging

5. **Schema Investigation**:
   - Identified potential schema mismatch
   - Attempted to align code with expected schema structure
   - Tried multiple approaches to match the schema
   - Discovered resolver mismatch with schema

### Testing Endpoints

1. **Local Development**:

   - `http://localhost:3000/api/contact/submit` (POST)
   - Uses mock implementation when `IS_LOCAL_DEV` is true

2. **Production**:

   - `https://jeff-content.vercel.app/api/contact/submit` (POST)
   - Uses AppSync with IAM authentication

3. **Debug Endpoints**:
   - `http://localhost:3000/api/contact/debug` (GET)
   - `http://localhost:3000/api/contact/test` (GET)
   - `http://localhost:3000/api/contact/error` (GET)

### Monitoring

1. **CloudWatch Logs**:

   - Check Amplify logs for deployment status
   - Monitor AppSync logs for operation details

2. **AppSync Console**:
   - Monitor queries and mutations
   - Check resolver performance

### Lessons Learned

1. Always verify environment variables in production deployments
2. Use comprehensive error logging to identify issues
3. Create test endpoints to isolate and verify functionality
4. Ensure IAM permissions are correctly configured
5. Test locally with the same configuration as production
6. Be aware of mock implementations in development
7. Use proper tooling (scripts) for AWS resource creation
8. Document all configuration changes and endpoints

### Next Steps

1. Monitor production usage for any issues
2. Consider adding additional logging if needed
3. Set up CloudWatch alarms for error monitoring
4. Document any future changes in this file
