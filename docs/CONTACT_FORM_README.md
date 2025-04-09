# Contact Form Documentation

## Quick Reference

### Current Status

🟢 RESOLVED - Contact form is working in production with AppSync and IAM authentication.

### Essential Information

- **AppSync API URL**: `https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql`
- **DynamoDB Table**: `jeff-dev-contact-forms`
- **Region**: `us-east-1`
- **Amplify App ID**: `dopcvdkp4snbc`

### Environment Variables

```bash
APPSYNC_API_URL=https://x6mic4j5tbaufjtov5p7svfa7q.appsync-api.us-east-1.amazonaws.com/graphql
REGION=us-east-1
CONTACT_FORM_TABLE=jeff-dev-contact-forms
```

### Common Tasks

1. **Testing the Form**

   ```bash
   # Local Development
   npm run dev
   # Visit http://localhost:3001/contact
   ```

2. **Updating AppSync Schema**

   ```bash
   ./scripts/setup-appsync.sh
   ```

3. **Deploying Changes**
   ```bash
   aws amplify start-job --app-id dopcvdkp4snbc --branch-name main --job-type RELEASE
   ```

### Monitoring

- Check CloudWatch logs in AWS Console
- Monitor AppSync operations in AppSync Console
- Review Amplify deployment logs

## Documentation Index

1. [IAM Authentication Solution](./CONTACT_FORM_IAM_SOLUTION.md)

   - Complete IAM setup and configuration
   - Security best practices
   - Maintenance procedures

2. [Debugging Guide](./CONTACT_FORM_DEBUGGING.md)
   - Implementation details
   - Troubleshooting steps
   - Monitoring instructions

## Architecture

```
Client -> AppSync API -> DynamoDB Table
   ↑          ↑             ↑
   └──────────┴─────────────┘
        IAM Authentication
```

## Support

For issues or updates:

1. Check CloudWatch logs
2. Review AppSync metrics
3. Verify IAM permissions
4. Test locally with development environment

## Historical Documentation

Archived documentation can be found in `docs/archive/`.
