# AWS Amplify Setup Guide

This document provides step-by-step instructions for setting up your Next.js website on AWS Amplify and connecting it to your existing AppSync GraphQL API.

## Prerequisites

- AWS Account with appropriate permissions
- GitHub repository with your Next.js project
- Existing AppSync GraphQL API
- Domain name (if using a custom domain)

## Step 1: Prepare Your Repository

1. **Add amplify.yml Configuration**

   Create a file named `amplify.yml` in the root of your repository:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

2. **Add AppSync Integration Code**

   Create a utility file for AppSync integration (e.g., `src/utils/amplify-config.js`):

   ```javascript
   import { Amplify } from 'aws-amplify'

   export function configureAmplify() {
     Amplify.configure({
       // Use existing AppSync endpoint
       API: {
         GraphQL: {
           endpoint: process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT,
           region: process.env.NEXT_PUBLIC_AWS_REGION,
           // Choose the appropriate authentication type for your AppSync API
           // Option 1: API Key
           apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY
           // Option 2: IAM (comment out apiKey if using this)
           // authenticationType: 'AWS_IAM'
         }
       }
     })
   }
   ```

3. **Initialize Amplify in Your App**

   Add the configuration to your app entry point (e.g., in `src/pages/_app.js` or `src/app/layout.tsx`):

   ```jsx
   // For pages router
   import { configureAmplify } from '../utils/amplify-config'
   import { useEffect } from 'react'

   function MyApp({ Component, pageProps }) {
     useEffect(() => {
       configureAmplify()
     }, [])

     return <Component {...pageProps} />
   }

   export default MyApp
   ```

   Or for App Router:

   ```jsx
   // src/app/layout.tsx
   import { configureAmplify } from '../utils/amplify-config'

   // Call this once on the server side
   configureAmplify()

   export default function RootLayout({
     children
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang='en'>
         <body>{children}</body>
       </html>
     )
   }
   ```

## Step 2: Set Up AWS Amplify Console

1. **Open AWS Amplify Console**

   - Sign in to the AWS Console
   - Navigate to AWS Amplify
   - Click "New app" → "Host web app"

2. **Connect to GitHub**

   - Select GitHub as your repository provider
   - Authenticate with GitHub
   - Select your repository

3. **Configure Build Settings**

   - The build settings should be automatically detected from your `amplify.yml`
   - Add environment variables:
     - `NEXT_PUBLIC_APPSYNC_ENDPOINT`: Your existing AppSync GraphQL endpoint
     - `NEXT_PUBLIC_APPSYNC_API_KEY`: Your AppSync API key (if using API key auth)
     - `NEXT_PUBLIC_AWS_REGION`: AWS region of your AppSync API (e.g., `us-east-1`)

4. **Review and Deploy**
   - Review the configuration
   - Click "Save and deploy"

## Step 3: Configure Custom Domain (Optional)

1. **Add Domain in Amplify Console**

   - Go to the app settings
   - Click on "Domain management"
   - Click "Add domain"
   - Enter your domain name
   - Follow the verification steps

2. **Set Up DNS Records**
   - Amplify will provide CNAME records
   - Add these records to your domain's DNS settings
   - Wait for DNS propagation (can take up to 48 hours)

## Step 4: Test AppSync Integration

1. **Create a Test Component**

   ```jsx
   import { API } from 'aws-amplify'
   import { useEffect, useState } from 'react'

   export default function TestAppSync() {
     const [data, setData] = useState(null)
     const [loading, setLoading] = useState(true)
     const [error, setError] = useState(null)

     useEffect(() => {
       async function fetchData() {
         try {
           // Replace with your actual query
           const query = `
             query ListItems {
               listItems {
                 items {
                   id
                   title
                   description
                 }
               }
             }
           `

           const response = await API.graphql({
             query,
             // Use authMode: 'API_KEY' for API key auth
             authMode: 'API_KEY'
           })

           setData(response.data.listItems.items)
           setLoading(false)
         } catch (err) {
           console.error('Error fetching data:', err)
           setError(err)
           setLoading(false)
         }
       }

       fetchData()
     }, [])

     if (loading) return <p>Loading...</p>
     if (error) return <p>Error loading data</p>

     return (
       <div>
         <h2>Items from AppSync</h2>
         <ul>
           {data.map((item) => (
             <li key={item.id}>
               <h3>{item.title}</h3>
               <p>{item.description}</p>
             </li>
           ))}
         </ul>
       </div>
     )
   }
   ```

2. **Add the Component to a Page**
   - Import and add the test component to any page
   - Deploy the changes
   - Verify that data is correctly fetched from AppSync

## Step 5: Set Up Branch-Based Environments (Optional)

For a more robust deployment workflow:

1. **Create a Staging Branch**

   - Create a `staging` branch in your GitHub repository

2. **Add Branch to Amplify**

   - In the Amplify Console, go to your app
   - Click on "Hosting environments"
   - Click "Connect branch"
   - Select the `staging` branch
   - Configure build settings (can be copied from main branch)

3. **Configure Preview Branches**
   - Go to your app settings
   - Click on "Preview settings"
   - Enable pull request previews
   - Configure settings for preview deployments

## Step 6: Monitoring and Troubleshooting

1. **Set Up CloudWatch Alarms**

   - In the Amplify Console, go to your app
   - Click on "Alarms" under "App settings"
   - Click "New alarm"
   - Configure alarms for errors, availability, etc.

2. **View Application Logs**

   - In the Amplify Console, go to your app
   - Click on a deployment
   - Click on "Logs" tab
   - View build logs and access logs

3. **Common Issues and Fixes**

   | Issue                    | Solution                                                          |
   | ------------------------ | ----------------------------------------------------------------- |
   | Build fails              | Check build logs for errors, verify Node.js version compatibility |
   | AppSync connection fails | Verify environment variables and API key/auth                     |
   | CORS errors              | Configure CORS settings in AppSync console                        |
   | 404 errors on routes     | Configure rewrites in `amplify.yml` for client-side routing       |

## Conclusion

Your Next.js application should now be successfully deployed on AWS Amplify and connected to your existing AppSync GraphQL API. This setup provides a scalable, reliable hosting solution with automated deployments and the power of AWS services.

For further customization and advanced features, refer to the [AWS Amplify documentation](https://docs.aws.amazon.com/amplify/) and the [Next.js deployment documentation](https://nextjs.org/docs/deployment).
