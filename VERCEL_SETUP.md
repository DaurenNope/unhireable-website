# Vercel Deployment Configuration

## Issue
Vercel was failing to build with error: `Cannot find module 'next-auth/react'`

## Root Cause
Vercel was building from the repository root instead of the `frontend` directory where the Next.js app and `package.json` (with `next-auth`) are located.

## Solution
The `vercel.json` file has been configured with:
- `rootDirectory: "frontend"` - Tells Vercel to use the `frontend` directory as the build root
- `installCommand: "npm install --legacy-peer-deps"` - Ensures dependencies install correctly (needed for React 19 compatibility)
- `buildCommand: "npm install --legacy-peer-deps && npm run build"` - Ensures build uses correct dependencies

## Additional Vercel Settings
If the build still fails, verify in Vercel dashboard:
1. Go to Project Settings → General
2. Ensure "Root Directory" is set to `frontend`
3. Ensure "Framework Preset" is set to `Next.js`
4. Ensure "Build Command" is set to `npm run build` (or uses `--legacy-peer-deps` if needed)
5. Ensure "Install Command" is set to `npm install --legacy-peer-deps` (if needed)

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

