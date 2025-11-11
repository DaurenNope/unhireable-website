# Vercel Deployment Configuration

## Common Issues

### Issue 1: Build fails with `Cannot find module 'next-auth/react'`
**Root Cause**: Vercel was building from the repository root instead of the `frontend` directory.

**Solution**: 
- The `vercel.json` file is in the `frontend/` directory
- **CRITICAL**: Set Root Directory in Vercel Dashboard:
  1. Go to Vercel Dashboard → Your Project → Settings → General
  2. Under "Root Directory", click "Edit" and set it to `frontend`
  3. Save the settings
  4. Redeploy the project

### Issue 2: 404 NOT_FOUND error after deployment
**Root Cause**: Vercel can't find the Next.js app because:
- Root Directory is not set to `frontend` in Vercel dashboard
- Or the build output is in the wrong location

**Solution**:
1. **Verify Root Directory**: Go to Vercel Dashboard → Settings → General → Root Directory should be `frontend`
2. **Check Build Output**: The build should create `.next` folder in `frontend/.next`
3. **Redeploy**: After setting root directory, trigger a new deployment
4. **Check Build Logs**: Verify the build completes successfully in Vercel dashboard

## Configuration

The `vercel.json` file in `frontend/` contains:
- `buildCommand: "npm install --legacy-peer-deps && npm run build"` - Installs dependencies and builds
- `installCommand: "npm install --legacy-peer-deps"` - Installs dependencies with React 19 compatibility

**Without setting the root directory in the dashboard, Vercel will try to build from the repository root and won't find the Next.js app, resulting in 404 errors.**

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

