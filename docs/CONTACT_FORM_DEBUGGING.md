# Contact Form Debugging

## Current Status: 🟢 RESOLVED

### Current Implementation

- Using AppSync GraphQL API with API Key authentication
- Table: `jeff-dev-contact-forms`
- Region: `us-east-1`
- AppSync API URL: `https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql`
- AppSync API ID: `p2s524zsande3cecseghtsxo5a`
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
10. **Authentication Issue**: Discovered that the AppSync API was using API Key authentication, not IAM authentication
11. **Final Solution**: Updated code to use API Key authentication and include all required fields in the input

### Current Flow

1. Form submission from `/contact` page
2. POST request to `/api/contact/submit`
3. API route uses AppSync with API Key authentication to create submission
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

   - Name: jeff-dev
   - Authentication: API_KEY
   - Region: us-east-1
   - API ID: p2s524zsande3cecseghtsxo5a
   - API Key ID: da2-a235twu7m5f3zfxim7zftusewe

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
APPSYNC_API_URL=https://zbrsmpwbkfanvfqqnrj7s5ucwq.appsync-api.us-east-1.amazonaws.com/graphql
APPSYNC_API_KEY=da2-a235twu7m5f3zfxim7zftusewe
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

   - We verified the exact schema in AppSync using `aws appsync get-introspection-schema`
   - The schema requires additional fields: `id`, `createdAt`, `processedAt`, and `status`

3. **Authentication Issue**:

   - The AppSync API was using API Key authentication, not IAM authentication
   - Our code was trying to use IAM authentication
   - We updated the code to use API Key authentication

4. **Solution**:

   - Updated the code to include all required fields in the input
   - Switched from IAM authentication to API Key authentication
   - Added the API Key to the Amplify environment variables

### Resolution Steps Taken

1. **Created New AppSync API**:

   - Set up with API Key authentication
   - Created DynamoDB data source
   - Configured resolvers for mutations and queries

2. **Updated Environment Variables**:

   - Added APPSYNC_API_URL to Amplify Console
   - Added APPSYNC_API_KEY to Amplify Console
   - Set REGION to us-east-1
   - Configured CONTACT_FORM_TABLE

3. **Updated Code**:

   - Modified authentication method to use API Key
   - Included all required fields in the GraphQL mutation input
   - Added error handling for missing API Key

4. **Added Comprehensive Logging**:

   - Enhanced error handling and logging
   - Added detailed request/response logging for debugging

5. **Schema Investigation**:
   - Identified potential schema mismatch
   - Retrieved the actual schema from AppSync
   - Updated code to match the schema requirements

### Testing Endpoints

1. **Local Development**:

   - `http://localhost:3000/api/contact/submit` (POST)
   - Uses mock implementation when `IS_LOCAL_DEV` is true

2. **Production**:

   - `https://www.jeffknowlesjr.com/api/contact/submit` (POST)
   - Uses AppSync with API Key authentication

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
4. Ensure authentication method matches the AppSync API configuration
5. Test locally with the same configuration as production
6. Be aware of mock implementations in development
7. Use proper tooling (scripts) for AWS resource creation
8. Document all configuration changes and endpoints
9. Verify the actual schema in AppSync before implementing code
10. Include all required fields in GraphQL mutations

### Next Steps

1. Monitor production usage for any issues
2. Consider adding additional logging if needed
3. Set up CloudWatch alarms for error monitoring
4. Document any future changes in this file
