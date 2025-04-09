# Contact Form Debugging

## Current Status: 🟢 RESOLVED

### Current Implementation

- Using AppSync GraphQL API with IAM authentication
- Table: `jeff-dev-contact-forms`
- Region: `us-east-1`
- AppSync API URL: `https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql`
- Composite key: `id` (hash) + `createdAt` (range)
- StatusIndex: `status` (hash) + `processedAt` (range)

### Implementation History

1. Initially used AppSync with GraphQL mutations
2. Switched to direct DynamoDB access for troubleshooting
3. Added comprehensive error logging and testing endpoints
4. Discovered local development was using a mock implementation
5. Created new AppSync API with proper IAM authentication
6. Updated Amplify environment variables with new AppSync endpoint

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
   - API ID: oanhkaegl5felpanhmgplnc6mm

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
APPSYNC_API_URL=https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### Resolution Steps Taken

1. **Created New AppSync API**:

   - Used `scripts/setup-appsync.sh` to create and configure API
   - Set up proper schema and resolvers
   - Connected to existing DynamoDB table

2. **Updated Amplify Configuration**:

   - Updated environment variables with new AppSync endpoint
   - Triggered new deployment to apply changes

3. **Verified Implementation**:
   - Confirmed schema creation success
   - Verified resolver configuration
   - Tested local development environment

### Testing Endpoints

1. `/api/contact/submit` - Main endpoint for form submissions
2. `/api/contact/test-db` - Test endpoint to verify DynamoDB access

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
