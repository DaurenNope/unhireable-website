# Quick Fix for Vercel 404

## If Root Directory is Already Set to `frontend`:

### Step 1: Check Build Status
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. **What does it say?**
   - ✅ "Ready" → Go to Step 2
   - ❌ "Error" or "Failed" → Check build logs for errors
   - ⏳ "Building" → Wait for it to finish

### Step 2: Force Redeploy
1. In Vercel Dashboard → Deployments
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Make sure **"Use existing Build Cache"** is set to **"No"**
5. Click **"Redeploy"**

### Step 3: Verify It's Building from frontend/
Look at the build logs - you should see:
```
Installing dependencies...
> npm install
...
> npm run build
...
Building Next.js app...
```

If you see errors about missing `package.json` or `next`, it's not building from `frontend/`.

### Step 4: Test the Deployment
After redeploy completes:
1. Visit your Vercel URL (e.g., `your-project.vercel.app`)
2. Try `/api/auth/providers` - should return JSON
3. Try `/` - should show homepage

### Step 5: If Still 404
1. **Check the actual deployment URL** - make sure you're visiting the production deployment, not a preview
2. **Check Vercel Function Logs** - might show runtime errors
3. **Try creating a new Vercel project** - sometimes projects get into a bad state
4. **Check if there's a `.vercelignore` file** - might be excluding important files

## Common Issues:

### Issue: Build succeeds but 404 on all routes
**Solution**: Root directory might not be saved properly. Double-check:
- Settings → General → Root Directory = `frontend` (no slash, no dot)
- Save, then redeploy

### Issue: Build fails with "Cannot find module"
**Solution**: Root directory not set, or Vercel is building from wrong directory

### Issue: 404 only on some routes
**Solution**: Check if routes are properly exported in `src/app/`

## Nuclear Option:
If nothing works, create a fresh Vercel project:
1. Delete the current Vercel project
2. Create a new project
3. Connect to the same GitHub repo
4. Set Root Directory to `frontend` BEFORE first deployment
5. Deploy

