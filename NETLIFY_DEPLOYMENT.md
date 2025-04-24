# Netlify Deployment Guide for VerseFountain

This guide provides detailed instructions for deploying the VerseFountain application to Netlify.

## Prerequisites

Before deploying, ensure you have:

1. A [Netlify account](https://app.netlify.com/signup)
2. A PostgreSQL database (we recommend [Neon](https://neon.tech))
3. All required API keys (Paddle, Stripe, Firebase if using)
4. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Database

1. Ensure your PostgreSQL database is accessible from the internet
2. For Neon databases:
   - Enable the "Pooled connection" option
   - Make note of your connection string

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Show advanced" and add your environment variables (see list below)
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Follow the prompts to configure your site

4. Set up environment variables:
   ```bash
   netlify env:import .env
   ```
   Or set them individually:
   ```bash
   netlify env:set DATABASE_URL your-database-url
   ```

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Required Environment Variables

Make sure to set the following environment variables in Netlify:

```
# Database connection
DATABASE_URL=postgres://username:password@hostname:port/database
PGHOST=hostname
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database

# Session
SESSION_SECRET=your-session-secret

# Frontend environment variables must be prefixed with VITE_
VITE_PADDLE_VENDOR_ID=your-paddle-vendor-id
VITE_PADDLE_PRODUCT_ID=your-paddle-product-id
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Backend API keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Firebase (if used)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

## Post-Deployment Configuration

After your site is deployed:

1. **Set up domain**:
   - Go to "Site settings" > "Domain management"
   - Add a custom domain or use the default Netlify subdomain

2. **Configure build hooks** (optional):
   - In Netlify dashboard, go to "Site settings" > "Build & deploy" > "Build hooks"
   - Create a new build hook for automated deployments
   - Use the provided URL in your CI/CD pipelines or external systems

3. **Check logs**:
   - If you encounter issues, check the function logs in Netlify dashboard
   - Go to "Functions" > "Logs" to see detailed error messages

## WebSocket Considerations

Netlify Functions do not natively support WebSockets. The application is configured to:

1. Use WebSockets in development
2. Fall back to HTTP polling in production

For production applications requiring real-time functionality, consider:

1. Using a third-party service like Pusher, Firebase, or Ably
2. Deploying your WebSocket server separately on a platform that supports persistent connections
3. Using AWS API Gateway WebSockets with Lambda functions

## Troubleshooting Common Issues

1. **Database Connection Issues**:
   - Ensure your database allows connections from Netlify's IP ranges
   - For Neon: Use the "pooled" connection string, not the direct one
   - Check that all database environment variables are correctly set

2. **Build Failures**:
   - Check build logs for specific errors
   - Ensure all dependencies are properly listed in package.json
   - Verify that the build command works locally: `npm run build`

3. **API Errors**:
   - Check that all API keys are correctly set as environment variables
   - Verify that the Netlify Functions are deployed correctly
   - Review the function logs in the Netlify dashboard

4. **404 Errors After Navigation**:
   - Ensure the redirects in netlify.toml are correct
   - The file should include a catch-all redirect: `/* /index.html 200`