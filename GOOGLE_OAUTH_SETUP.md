# Google OAuth Setup Guide

## Problem
Google OAuth login doesn't work because the credentials are not configured in your environment variables.

## Solution

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External (for testing) or Internal
   - App name: UNHIREABLE
   - Support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: UNHIREABLE Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://unhireable-website.vercel.app` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://unhireable-website.vercel.app/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

### Step 2: Add to Environment Variables

#### Local Development (`frontend/.env.local`)

Add these lines to your `frontend/.env.local` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-change-in-production-local-dev
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

#### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `GOOGLE_CLIENT_ID` = your Google Client ID
   - `GOOGLE_CLIENT_SECRET` = your Google Client Secret
   - `NEXTAUTH_URL` = `https://unhireable-website.vercel.app`
   - `AUTH_SECRET` = a secure random string (generate with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_BACKEND_URL` = your backend URL

### Step 3: Restart Your Development Server

After adding the environment variables:

```bash
# Stop your Next.js dev server (Ctrl+C)
# Then restart it
cd frontend
npm run dev
```

### Step 4: Test Google Login

1. Go to `http://localhost:3000/login`
2. Click "CONTINUE WITH GOOGLE"
3. You should be redirected to Google's login page
4. After logging in, you'll be redirected back and logged in

## Troubleshooting

### OAuth buttons don't appear
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Restart your Next.js dev server after adding env vars
- Check browser console for errors

### "Redirect URI mismatch" error
- Make sure the redirect URI in Google Console matches exactly:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://unhireable-website.vercel.app/api/auth/callback/google`

### "Invalid client" error
- Verify your Client ID and Secret are correct
- Make sure there are no extra spaces or quotes in `.env.local`

### Backend OAuth endpoint errors
- Ensure your backend is running on `http://localhost:8000`
- Check backend logs for errors when OAuth callback happens
- Verify the `/api/auth/oauth` endpoint exists and works

## Current Status

✅ **Fixed Issues:**
- Login/Register pages now only show OAuth buttons if providers are configured
- Better error messages for OAuth failures
- Backend `/api/auth/oauth` endpoint properly creates/links OAuth users

⚠️ **Still Need:**
- Google OAuth credentials in environment variables
- Restart Next.js dev server after adding credentials

