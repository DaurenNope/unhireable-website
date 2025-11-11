# Vercel Deployment Configuration

## Issue
Vercel was failing to build with error: `Cannot find module 'next-auth/react'`

## Root Cause
Vercel was building from the repository root instead of the `frontend` directory where the Next.js app and `package.json` (with `next-auth`) are located.

## Solution
The `vercel.json` file has been moved to the `frontend/` directory. This ensures Vercel treats the `frontend` directory as the project root.

The `vercel.json` file contains:
- `buildCommand: "npm install --legacy-peer-deps && npm run build"` - Installs dependencies and builds
- `installCommand: "npm install --legacy-peer-deps"` - Installs dependencies with React 19 compatibility

**IMPORTANT**: You MUST configure the Root Directory in Vercel Dashboard:
1. Go to Vercel Dashboard → Your Project → Settings → General
2. Under "Root Directory", click "Edit" and set it to `frontend`
3. Save the settings
4. This tells Vercel to treat the `frontend` directory as the project root and use the `vercel.json` from that directory

Without setting the root directory in the dashboard, Vercel will try to build from the repository root and won't find the Next.js app.

## Environment Variables
Make sure to set these in Vercel dashboard (Settings → Environment Variables):
- `AUTH_SECRET` - Required for NextAuth.js
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- `GOOGLE_CLIENT_ID` - (Optional) For Google OAuth
- `GOOGLE_CLIENT_SECRET` - (Optional) For Google OAuth
- `GITHUB_ID` - (Optional) For GitHub OAuth
- `GITHUB_SECRET` - (Optional) For GitHub OAuth
- `LINKEDIN_ID` - (Optional) For LinkedIn OAuth
- `LINKEDIN_SECRET` - (Optional) For LinkedIn OAuth

