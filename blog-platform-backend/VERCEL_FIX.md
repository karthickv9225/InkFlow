# Vercel Deployment Fix

## Issue
Backend was showing "Cannot GET /" error on Vercel.

## Solution
Updated to use proper Vercel serverless handler with `@vercel/node`.

## What Changed
1. Created `api/handler.ts` - Proper Vercel serverless function
2. Updated `vercel.json` - Points to handler.ts
3. Added `@vercel/node` dependency

## How to Redeploy

### Option 1: Automatic Redeploy (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your backend project
3. Go to "Deployments"
4. Click the three dots on the latest deployment
5. Click "Redeploy"

### Option 2: Manual Redeploy
1. Go to https://vercel.com/dashboard
2. Select your backend project
3. Click "Redeploy" button
4. Wait for deployment to complete

### Option 3: Push to GitHub
The deployment will automatically trigger when you push:
```bash
git push origin master
```

## Testing After Deployment

### Test Root Endpoint
```bash
curl https://ink-flow-hpzd.vercel.app/
```

Expected response:
```json
{
  "message": "InkFlow Blog Platform API",
  "version": "1.0.0",
  "endpoints": {
    "auth": ["/auth/register", "/auth/login"],
    "public": ["/public/feed", "/public/blogs/:slug"],
    "blogs": ["/blogs", "/blogs/:id"],
    "health": "/health"
  }
}
```

### Test Health Endpoint
```bash
curl https://ink-flow-hpzd.vercel.app/health
```

Expected response:
```json
{ "status": "ok" }
```

### Test Auth Endpoint
```bash
curl -X POST https://ink-flow-hpzd.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

## If Still Getting Errors

1. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Select your project
   - Click "Logs"
   - Look for error messages

2. **Verify Files**
   - Ensure `api/handler.ts` exists
   - Ensure `vercel.json` is correct
   - Ensure `package.json` has all dependencies

3. **Clear Cache**
   - Go to project settings
   - Click "Advanced"
   - Click "Clear Build Cache"
   - Redeploy

4. **Check Environment**
   - Ensure `FRONTEND_URL` is set (optional)
   - Ensure `NODE_ENV` is set to `production`

## Success Indicators

✅ Root endpoint returns API info
✅ Health endpoint returns `{ "status": "ok" }`
✅ Can register new user
✅ Can login
✅ Can create blog
✅ Can view public feed

## Next Steps

1. Update frontend `.env.local` with backend URL
2. Deploy frontend to Vercel
3. Test full integration
