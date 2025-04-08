---
title: 'Directory-Based Domain Splitting in AWS'
slug: 'directorybased-domain-splitting-in-aws'
excerpt: 'Implement path-based routing with AWS CloudFront, API Gateway, S3, and Lambda to create a unified domain experience with specialized backend services.'
author: 'Jeff & Claude'
tags:
  [
    'AWS',
    'Architecture',
    'CloudFront',
    'API Gateway',
    'Infrastructure',
    'S3',
    'Lambda'
  ]
readingTime: '15 min read'
datePublished: '2025-04-04'
dateModified: '2025-04-05'
status: 'published'
featuredImage: '/images/blog/featured/smit-patel-xMNQketH4tU-unsplash-optimized.jpg'
---

# Directory-Based Domain Splitting in AWS

Directory-based domain splitting is a powerful architectural pattern that allows you to route different parts of your website to specialized backend services based on URL paths while maintaining a single domain. This comprehensive guide will walk you through implementing this pattern in AWS with detailed configuration steps.

## What is Directory-Based Domain Splitting?

Directory-based domain splitting enables you to:

- Serve different application components from a single domain
- Route requests based on URL paths to different backend services
- Maintain a unified user experience without switching domains

For example:

```
example.com/           → Static marketing website (S3)
example.com/app/*      → Single Page Application (S3 + CloudFront Function)
example.com/api/*      → REST API (API Gateway + Lambda)
example.com/admin/*    → Admin portal (separate S3 bucket)
```

## AWS Services Used in This Architecture

This architecture leverages several AWS services working together:

1. **Amazon CloudFront**: The primary content delivery network (CDN) that serves as the entry point for all requests
2. **Amazon S3**: Hosts static website content and SPA assets
3. **AWS Lambda**: Executes serverless functions for dynamic content
4. **Amazon API Gateway**: Manages and routes API requests
5. **AWS Certificate Manager (ACM)**: Provides SSL/TLS certificates
6. **Amazon Route 53**: Handles DNS configuration (optional)
7. **CloudFront Functions**: Enables request manipulation for SPA routing

## Detailed Implementation Steps

### 1. Domain and SSL Certificate Setup

First, secure your domain with an SSL certificate:

1. **Register your domain** using Route 53 or another registrar
2. **Request a certificate** in AWS Certificate Manager:
   ```bash
   aws acm request-certificate \
     --domain-name example.com \
     --validation-method DNS \
     --subject-alternative-names *.example.com
   ```
3. **Validate the certificate** by adding the CNAME records to your DNS configuration
4. **Note the certificate ARN** for later use in CloudFront

### 2. Create S3 Buckets for Static Content

Create separate S3 buckets for different parts of your application:

```bash
# Marketing site bucket
aws s3 mb s3://example-marketing-site

# SPA application bucket
aws s3 mb s3://example-app

# Admin portal bucket
aws s3 mb s3://example-admin
```

Configure each bucket for static website hosting:

```bash
# For marketing site
aws s3 website s3://example-marketing-site \
  --index-document index.html \
  --error-document error.html

# For SPA
aws s3 website s3://example-app \
  --index-document index.html \
  --error-document index.html

# For admin portal
aws s3 website s3://example-admin \
  --index-document index.html \
  --error-document index.html
```

Apply bucket policies to allow CloudFront access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-marketing-site/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### 3. Set Up API Gateway for API Endpoints

Create an API Gateway REST API for your backend services:

```bash
# Create REST API
aws apigateway create-rest-api \
  --name example-api \
  --endpoint-configuration "types=REGIONAL"

# Get the API ID and Root Resource ID
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='example-api'].id" --output text)
ROOT_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)

# Create a resource for your API
aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE_ID \
  --path-part "users"
```

Set up methods and Lambda integrations:

```bash
# Get the resource ID for the 'users' path
RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/users'].id" --output text)

# Create a GET method
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --authorization-type NONE

# Create Lambda function integration
aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:ACCOUNT_ID:function:getUsersFunction/invocations
```

Enable CORS for cross-origin requests:

```bash
# Enable CORS
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --status-code 200 \
  --response-parameters "method.response.header.Access-Control-Allow-Origin=false"

# Deploy the API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod
```

### 4. Create CloudFront Function for SPA Routing

Create a CloudFront Function to handle client-side routing for SPAs:

```javascript
function handler(event) {
  var request = event.request
  var uri = request.uri

  // Check if request is for a file with extension
  if (uri.match(/\.[a-zA-Z0-9]+$/)) {
    // Request is for a file, continue normally
    return request
  }

  // Handle different path patterns
  if (uri.startsWith('/app/')) {
    // For app paths that don't point to a file, route to app's index.html
    request.uri = '/app/index.html'
  } else if (uri.startsWith('/admin/')) {
    // For admin paths that don't point to a file, route to admin's index.html
    request.uri = '/admin/index.html'
  }

  return request
}
```

Save this function in a file named `url-rewriter.js`, then create the CloudFront Function:

```bash
# Create CloudFront Function
aws cloudfront create-function \
  --name SPAUrlRewriter \
  --function-config "Comment=SPA URL Rewriter,Runtime=cloudfront-js-1.0" \
  --function-code fileb://url-rewriter.js
```

### 5. Set Up CloudFront Distribution with Origin Groups

Create a CloudFront distribution with multiple origins:

```bash
# Create the distribution with multiple origins
aws cloudfront create-distribution \
  --origin-domain-name example-marketing-site.s3.website-us-east-1.amazonaws.com \
  --default-root-object index.html \
  --alias example.com \
  --viewer-certificate "ACMCertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID,SSLSupportMethod=sni-only" \
  --origins "[
    {
      \"Id\": \"marketingSite\",
      \"DomainName\": \"example-marketing-site.s3.website-us-east-1.amazonaws.com\",
      \"CustomOriginConfig\": {
        \"HTTPPort\": 80,
        \"HTTPSPort\": 443,
        \"OriginProtocolPolicy\": \"http-only\"
      }
    },
    {
      \"Id\": \"spaApp\",
      \"DomainName\": \"example-app.s3.website-us-east-1.amazonaws.com\",
      \"CustomOriginConfig\": {
        \"HTTPPort\": 80,
        \"HTTPSPort\": 443,
        \"OriginProtocolPolicy\": \"http-only\"
      }
    },
    {
      \"Id\": \"adminPortal\",
      \"DomainName\": \"example-admin.s3.website-us-east-1.amazonaws.com\",
      \"CustomOriginConfig\": {
        \"HTTPPort\": 80,
        \"HTTPSPort\": 443,
        \"OriginProtocolPolicy\": \"http-only\"
      }
    },
    {
      \"Id\": \"apiGateway\",
      \"DomainName\": \"$API_ID.execute-api.us-east-1.amazonaws.com\",
      \"OriginPath\": \"/prod\",
      \"CustomOriginConfig\": {
        \"HTTPPort\": 80,
        \"HTTPSPort\": 443,
        \"OriginProtocolPolicy\": \"https-only\"
      }
    }
  ]" \
  --cache-behaviors "[
    {
      \"PathPattern\": \"app/*\",
      \"TargetOriginId\": \"spaApp\",
      \"ViewerProtocolPolicy\": \"redirect-to-https\",
      \"DefaultTTL\": 0,
      \"MinTTL\": 0,
      \"MaxTTL\": 0,
      \"FunctionAssociations\": [
        {
          \"EventType\": \"viewer-request\",
          \"FunctionARN\": \"arn:aws:cloudfront::ACCOUNT_ID:function/SPAUrlRewriter\"
        }
      ]
    },
    {
      \"PathPattern\": \"admin/*\",
      \"TargetOriginId\": \"adminPortal\",
      \"ViewerProtocolPolicy\": \"redirect-to-https\",
      \"DefaultTTL\": 0,
      \"MinTTL\": 0,
      \"MaxTTL\": 0,
      \"FunctionAssociations\": [
        {
          \"EventType\": \"viewer-request\",
          \"FunctionARN\": \"arn:aws:cloudfront::ACCOUNT_ID:function/SPAUrlRewriter\"
        }
      ]
    },
    {
      \"PathPattern\": \"api/*\",
      \"TargetOriginId\": \"apiGateway\",
      \"ViewerProtocolPolicy\": \"redirect-to-https\",
      \"AllowedMethods\": [\"DELETE\", \"GET\", \"HEAD\", \"OPTIONS\", \"PATCH\", \"POST\", \"PUT\"],
      \"CachedMethods\": [\"GET\", \"HEAD\", \"OPTIONS\"],
      \"DefaultTTL\": 0,
      \"MinTTL\": 0,
      \"MaxTTL\": 0,
      \"ForwardedValues\": {
        \"QueryString\": true,
        \"Cookies\": {
          \"Forward\": \"all\"
        },
        \"Headers\": [\"Authorization\"]
      }
    }
  ]"
```

### 6. Set Up DNS Records in Route 53

Create DNS records to point your domain to CloudFront:

```bash
# Get CloudFront distribution ID
DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[0]=='example.com'].Id" --output text)

# Create A record in Route 53
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_HOSTED_ZONE_ID \
  --change-batch '{
    "Changes": [
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "example.com",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "'$DIST_ID'.cloudfront.net",
            "EvaluateTargetHealth": false
          }
        }
      }
    ]
  }'
```

## Advanced Configuration Options

### 1. Custom Error Pages

Configure custom error responses in CloudFront:

```bash
aws cloudfront update-distribution \
  --id $DIST_ID \
  --custom-error-responses '{
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/error.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 300
      }
    ]
  }'
```

### 2. Security Headers

Add security headers using CloudFront Functions:

```javascript
function handler(event) {
  var response = event.response
  var headers = response.headers

  // Add security headers
  headers['strict-transport-security'] = {
    value: 'max-age=63072000; includeSubdomains; preload'
  }
  headers['content-security-policy'] = {
    value:
      "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline';"
  }
  headers['x-content-type-options'] = { value: 'nosniff' }
  headers['x-frame-options'] = { value: 'DENY' }
  headers['x-xss-protection'] = { value: '1; mode=block' }
  headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' }

  return response
}
```

### 3. API Gateway Custom Domain Integration

Map API Gateway to a custom domain for cleaner API URLs:

```bash
# Create API Gateway domain name
aws apigateway create-domain-name \
  --domain-name api.example.com \
  --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID

# Create base path mapping
aws apigateway create-base-path-mapping \
  --domain-name api.example.com \
  --rest-api-id $API_ID \
  --stage prod
```

### 4. Lambda@Edge for Advanced Routing

For more complex routing requirements, use Lambda@Edge:

```javascript
exports.handler = async (event) => {
  const request = event.Records[0].cf.request
  const uri = request.uri

  // Implement complex routing logic
  if (uri.match(/^\/products\/[a-z0-9-]+\/details$/)) {
    // Route product detail pages to the appropriate backend
    request.origin = {
      custom: {
        domainName: 'product-details-api.execute-api.us-east-1.amazonaws.com',
        port: 443,
        protocol: 'https',
        path: '/prod',
        sslProtocols: ['TLSv1.2'],
        readTimeout: 5,
        keepaliveTimeout: 5,
        customHeaders: {}
      }
    }
    // Extract product ID and modify path for the backend
    const productId = uri.split('/')[2]
    request.uri = `/products/${productId}`
  }

  return request
}
```

## Handling Common Challenges

### 1. Authentication Across Paths

To maintain authentication across different sections:

1. Use JWT tokens stored in cookies at the domain root:

   ```javascript
   document.cookie =
     'auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; path=/; domain=example.com; secure; samesite=strict'
   ```

2. Configure API Gateway to validate these tokens:
   ```bash
   # Create authorizer
   aws apigateway create-authorizer \
     --rest-api-id $API_ID \
     --name JwtAuthorizer \
     --type TOKEN \
     --authorizer-uri arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:ACCOUNT_ID:function:jwtAuthorizerFunction/invocations \
     --identity-source "method.request.header.Authorization"
   ```

### 2. CORS Configuration

Even though your frontend and APIs share the same domain, configure CORS for development environments:

```bash
# Enable CORS on API Gateway
aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --status-code 200 \
  --response-parameters '{
    "method.response.header.Access-Control-Allow-Origin": true,
    "method.response.header.Access-Control-Allow-Methods": true,
    "method.response.header.Access-Control-Allow-Headers": true
  }'

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $RESOURCE_ID \
  --http-method GET \
  --status-code 200 \
  --response-parameters '{
    "method.response.header.Access-Control-Allow-Origin": "'\'https://example.com\''",
    "method.response.header.Access-Control-Allow-Methods": "'\''GET,POST,PUT,DELETE,OPTIONS\''",
    "method.response.header.Access-Control-Allow-Headers": "'\''Content-Type,Authorization,X-Amz-Date,X-Api-Key\'''"
  }'
```

### 3. Caching Strategies

Configure different caching behaviors for different content types:

```bash
# Update cache behavior for static assets
aws cloudfront update-distribution \
  --id $DIST_ID \
  --cache-behaviors '{
    "Quantity": 1,
    "Items": [
      {
        "PathPattern": "static/*",
        "TargetOriginId": "marketingSite",
        "ViewerProtocolPolicy": "redirect-to-https",
        "DefaultTTL": 86400,
        "MinTTL": 0,
        "MaxTTL": 31536000,
        "Compress": true
      }
    ]
  }'
```

## Deployment Best Practices

### 1. Infrastructure as Code

Use AWS CloudFormation or Terraform to define your infrastructure:

```yaml
# CloudFormation example (partial)
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt MarketingSiteBucket.RegionalDomainName
            Id: marketingSite
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CloudFrontOAI}'
          # Other origins here...
        DefaultRootObject: index.html
        Enabled: true
        DefaultCacheBehavior:
          TargetOriginId: marketingSite
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6 # Managed-CachingOptimized
        CacheBehaviors:
          - PathPattern: 'app/*'
            TargetOriginId: spaApp
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingDisabled
            FunctionAssociations:
              - EventType: viewer-request
                FunctionARN: !GetAtt SPAUrlRewriterFunction.FunctionARN
          # Other cache behaviors here...
```

### 2. CI/CD Pipeline Integration

Set up a CI/CD pipeline to automate deployments:

```yaml
# AWS CodePipeline example (partial)
Resources:
  Pipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      ArtifactStore:
        Type: S3
        Location: !Ref ArtifactBucket
      Stages:
        - Name: Source
          Actions:
            - Name: Source
              ActionTypeId:
                Category: Source
                Owner: AWS
                Provider: CodeStarSourceConnection
                Version: '1'
              Configuration:
                ConnectionArn: !Ref GitHubConnection
                FullRepositoryId: username/repo
                BranchName: main
              OutputArtifacts:
                - Name: SourceCode
        - Name: Build
          Actions:
            - Name: BuildAndDeploy
              ActionTypeId:
                Category: Build
                Owner: AWS
                Provider: CodeBuild
                Version: '1'
              Configuration:
                ProjectName: !Ref BuildProject
              InputArtifacts:
                - Name: SourceCode
```

## Performance Monitoring and Optimization

### 1. CloudWatch Alarms

Set up CloudWatch alarms to monitor performance:

```bash
# Create CloudWatch alarm for API Gateway latency
aws cloudwatch put-metric-alarm \
  --alarm-name APIGatewayHighLatency \
  --alarm-description "Alarm when API Gateway latency exceeds 1 second" \
  --metric-name Latency \
  --namespace AWS/ApiGateway \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=ApiName,Value=example-api Name=Stage,Value=prod \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:AlertTopic
```

### 2. CloudFront Cache Hit Ratio

Monitor and optimize CloudFront cache hit ratio:

```bash
# Get CloudFront cache metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate \
  --dimensions Name=DistributionId,Value=$DIST_ID Name=Region,Value=Global \
  --start-time $(date -d '1 day ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Average
```

## Conclusion

Directory-based domain splitting in AWS provides a flexible, scalable architecture for modern web applications. By leveraging CloudFront, S3, API Gateway, and Lambda, you can create a seamless user experience while using the most appropriate backend services for each section of your application.

The approach outlined in this guide allows you to:

1. Maintain a unified frontend experience under a single domain
2. Use specialized services for different parts of your application
3. Implement fine-grained caching and security policies
4. Scale different components independently
5. Deploy updates to individual sections without affecting others

With AWS's comprehensive service offering, you can implement this pattern with high reliability, security, and performance, creating a robust foundation for your web applications.

---

_Featured image: Photo by [Smit Patel](https://unsplash.com/@smitpatel?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/a-blue-and-white-abstract-background-with-wavy-lines-xMNQketH4tU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
