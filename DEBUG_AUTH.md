# Debugging Authentication Issues

## Current Status

### ✅ Backend
- Backend is running on `http://localhost:8000`
- Health check: Working
- Registration endpoint: Working
- Login endpoint: Working
- Get user endpoint: Working

### ❌ Frontend
- NextAuth warning about NEXTAUTH_URL
- Authentication not working from frontend
- Need to verify frontend is calling backend

## Issues Found

### 1. NEXTAUTH_URL Warning
- **Issue**: NextAuth requires `NEXTAUTH_URL` environment variable
- **Fix**: Added to `.env.local` file
- **Status**: ✅ Fixed

### 2. Environment Variables
- **Issue**: Frontend needs `NEXT_PUBLIC_BACKEND_URL` and `AUTH_SECRET`
- **Fix**: Added to `.env.local` file
- **Status**: ✅ Fixed

### 3. Frontend Restart Required
- **Issue**: Next.js needs to be restarted after adding `.env.local`
- **Fix**: Restart Next.js dev server
- **Status**: ⏭️ Needs restart

## Testing Steps

### 1. Restart Frontend
```bash
# Stop the current Next.js server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 2. Test Backend Directly
```bash
# Test registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "test123",
    "full_name": "New User"
  }'

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Test Frontend Login
1. Go to `http://localhost:3000/login`
2. Enter email: `test@example.com`
3. Enter password: `test123`
4. Click "Sign in"
5. Check browser console for errors
6. Check backend logs for requests

### 4. Check Browser Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors related to:
  - NextAuth
  - Backend API calls
  - CORS errors
  - Network errors

### 5. Check Network Tab
- Open browser DevTools (F12)
- Go to Network tab
- Try logging in
- Look for requests to:
  - `/api/auth/callback/credentials`
  - `http://localhost:8000/api/auth/login`
  - Check response status codes
  - Check response bodies

### 6. Check Backend Logs
```bash
tail -f /tmp/backend.log
```

Look for:
- POST requests to `/api/auth/login`
- POST requests to `/api/auth/register`
- GET requests to `/api/auth/me`
- Error messages
- CORS errors

## Common Issues

### Issue 1: CORS Error
**Symptom**: Browser console shows CORS error
**Fix**: Check backend CORS configuration allows `http://localhost:3000`

### Issue 2: 401 Unauthorized
**Symptom**: Login returns 401
**Fix**: Check email/password are correct, check backend logs

### Issue 3: Network Error
**Symptom**: Request fails with network error
**Fix**: Check backend is running, check backend URL is correct

### Issue 4: NextAuth Error
**Symptom**: NextAuth shows error in console
**Fix**: Check `NEXTAUTH_URL` and `AUTH_SECRET` are set correctly

### Issue 5: Session Not Persisting
**Symptom**: Login succeeds but session is lost
**Fix**: Check NextAuth configuration, check cookies are being set

## Next Steps

1. ✅ Create `.env.local` file with required variables
2. ⏭️ Restart Next.js dev server
3. ⏭️ Test authentication from frontend
4. ⏭️ Check browser console for errors
5. ⏭️ Check backend logs for requests
6. ⏭️ Verify session is being created

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-change-in-production-local-dev
```

### Backend (already configured)
- `DATABASE_URL`: SQLite (default)
- `SECRET_KEY`: JWT secret (default)
- `ALLOWED_ORIGINS`: CORS origins (default includes localhost:3000)

## Debugging Commands

### Check Backend Status
```bash
curl http://localhost:8000/health
```

### Check Backend Logs
```bash
tail -f /tmp/backend.log
```

### Test Backend Authentication
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get user (replace TOKEN with access_token from login)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Check Frontend Environment
```bash
cd frontend
cat .env.local
```

### Check Next.js Configuration
```bash
cd frontend
cat next.config.ts
```

