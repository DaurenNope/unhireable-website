# Backend Testing Guide

## Backend Server Started

The backend server is now running at: **http://localhost:8000**

## Test Endpoints

### 1. Health Check
```bash
curl http://localhost:8000/health
```
Expected response: `{"status": "healthy"}`

### 2. Root Endpoint
```bash
curl http://localhost:8000/
```
Expected response: `{"message": "JobEz Assessment Platform API", "version": "1.0.0"}`

### 3. Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "full_name": "Test User"
  }'
```
Expected response: `{"access_token": "...", "token_type": "bearer", "expires_in": 1800}`

### 4. Login User
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```
Expected response: `{"access_token": "...", "token_type": "bearer", "expires_in": 1800}`

### 5. Get Current User (Protected)
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```
Expected response: `{"id": 1, "email": "test@example.com", "full_name": "Test User", "is_active": true, "is_verified": false}`

## Frontend Configuration

To test authentication from the frontend:

1. **Update frontend environment variable** (if not already set):
   - Set `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` in your local environment
   - Or create `.env.local` file in `frontend/` directory:
     ```
     NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
     ```

2. **Start frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test authentication**:
   - Go to http://localhost:3000/login
   - Try registering a new user
   - Try logging in with existing user

## Database

The database is automatically initialized on startup:
- Database file: `backend/test.db` (SQLite)
- Tables are created automatically when the server starts
- Check database: `sqlite3 backend/test.db .tables`

## Troubleshooting

### Backend not starting?
- Check if port 8000 is already in use: `lsof -i :8000`
- Check Python dependencies: `pip install -r requirements.txt`
- Check for errors in the terminal output

### Authentication not working?
- Check if database tables exist: `sqlite3 backend/test.db .tables`
- Check backend logs for errors
- Verify environment variables are set correctly
- Check CORS configuration allows `http://localhost:3000`

### Database errors?
- Delete `backend/test.db` and restart server (tables will be recreated)
- Check database file permissions
- Verify SQLite is installed: `sqlite3 --version`

## Next Steps

1. Test backend endpoints using curl or Postman
2. Test frontend authentication with backend running
3. Verify database tables are created
4. Test user registration and login flow
5. Check authentication tokens are working

## Notes

- Backend is running in reload mode (auto-restarts on code changes)
- Database tables are created automatically on startup
- CORS is configured to allow `http://localhost:3000` and `http://localhost:3001`
- JWT tokens expire in 30 minutes (1800 seconds)

