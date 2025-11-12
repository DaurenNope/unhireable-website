# Authentication Fix - Next Steps

## ✅ What's Been Fixed

1. **Created `.env.local` file** with required environment variables:
   - `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
   - `NEXTAUTH_URL=http://localhost:3000`
   - `AUTH_SECRET=your-secret-key-change-in-production-local-dev`

2. **Improved error handling** in NextAuth authorize function
3. **Better error messages** in login page
4. **Backend is running** and ready at `http://localhost:8000`

## ⚠️ IMPORTANT: Restart Next.js Dev Server

**The `.env.local` file has been created, but Next.js needs to be restarted for the changes to take effect!**

### Steps to Fix:

1. **Stop the current Next.js server**:
   - Go to the terminal where Next.js is running
   - Press `Ctrl+C` to stop it

2. **Restart Next.js**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Try logging in again**:
   - Go to `http://localhost:3000/login`
   - Enter email: `test@example.com`
   - Enter password: `test123`
   - Click "Sign in"

## 🔍 Debugging

If authentication still doesn't work after restarting:

### 1. Check Browser Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors related to:
  - NextAuth
  - Backend API calls
  - CORS errors
  - Network errors

### 2. Check Network Tab
- Open browser DevTools (F12)
- Go to Network tab
- Try logging in
- Look for requests to:
  - `/api/auth/callback/credentials`
  - Check if it's making a request to `http://localhost:8000/api/auth/login`
  - Check response status codes
  - Check response bodies

### 3. Check Backend Logs
```bash
tail -f /tmp/backend.log
```

Look for:
- POST requests to `/api/auth/login`
- POST requests to `/api/auth/register`
- GET requests to `/api/auth/me`
- Error messages

### 4. Test Backend Directly
```bash
# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

Expected response:
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### 5. Verify Environment Variables
```bash
cd frontend
cat .env.local
```

Should show:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-change-in-production-local-dev
```

## 🔧 Common Issues

### Issue 1: NEXTAUTH_URL Warning
**Symptom**: NextAuth shows warning about NEXTAUTH_URL
**Fix**: Restart Next.js server after creating `.env.local`

### Issue 2: CORS Error
**Symptom**: Browser console shows CORS error
**Fix**: Backend CORS is already configured for `http://localhost:3000`

### Issue 3: Network Error
**Symptom**: Request fails with network error
**Fix**: Check backend is running: `curl http://localhost:8000/health`

### Issue 4: 401 Unauthorized
**Symptom**: Login returns 401
**Fix**: Check email/password are correct, check backend logs

### Issue 5: Backend Not Responding
**Symptom**: No requests in backend logs
**Fix**: Check if NextAuth is actually calling the backend (check Network tab)

## 📝 Test Credentials

### Existing User
- Email: `test@example.com`
- Password: `test123`

### Register New User
- Go to `http://localhost:3000/register`
- Fill in the form
- Submit

## ✅ Verification Checklist

- [ ] `.env.local` file exists in `frontend/` directory
- [ ] Next.js server has been restarted
- [ ] Backend is running on `http://localhost:8000`
- [ ] Backend health check works: `curl http://localhost:8000/health`
- [ ] Backend login works: `curl -X POST http://localhost:8000/api/auth/login ...`
- [ ] No NEXTAUTH_URL warning in Next.js logs
- [ ] Browser console shows no errors
- [ ] Network tab shows requests to backend
- [ ] Authentication works from frontend

## 🚀 Next Steps

1. **Restart Next.js server** (IMPORTANT!)
2. **Test login** from frontend
3. **Check browser console** for errors
4. **Check backend logs** for requests
5. **Verify session** is created and persists

## 📚 Documentation

- `DEBUG_AUTH.md`: Detailed debugging guide
- `BACKEND_RUNNING.md`: Backend testing guide
- `AUTH_WHY_NOT_WORKING.md`: Root cause analysis

