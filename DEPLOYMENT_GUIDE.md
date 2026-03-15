# Complete Deployment Guide - InkFlow Blog Platform

## Overview

Deploy both frontend and backend to Vercel for a fully serverless blog platform.

---

## Part 1: Backend Deployment (Express API)

### Step 1: Prepare Backend for Vercel

The backend has been converted to Express.js and is ready for Vercel.

**Files created:**
- `blog-platform-backend/api/index.ts` - Express API
- `blog-platform-backend/vercel.json` - Vercel configuration

### Step 2: Deploy Backend to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository (karthickv9225/InkFlow)
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `blog-platform-backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

### Step 3: Get Backend URL

After deployment, you'll get a URL like:
```
https://ink-flow-backend.vercel.app
```

Save this URL - you'll need it for the frontend.

---

## Part 2: Frontend Deployment (Next.js)

### Step 1: Update Frontend Environment

Edit `blog-platform-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://ink-flow-backend.vercel.app
```

Replace with your actual backend URL from Part 1.

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `blog-platform-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
6. Click "Deploy"

### Step 3: Get Frontend URL

After deployment, you'll get a URL like:
```
https://ink-flow-frontend.vercel.app
```

---

## Part 3: Update Backend CORS

Update backend CORS to allow your frontend URL:

1. Go to Vercel dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add/Update:
   - `FRONTEND_URL`: `https://ink-flow-frontend.vercel.app`
5. Redeploy

---

## Testing Deployment

### Test Backend Health

```bash
curl https://ink-flow-backend.vercel.app/health
```

Expected response:
```json
{ "status": "ok" }
```

### Test Frontend

1. Open https://ink-flow-frontend.vercel.app
2. Register a new account
3. Create a blog
4. Publish it
5. View on public feed

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Public Blogs
- `GET /public/feed` - Get published blogs
- `GET /public/blogs/:slug` - Get blog by slug
- `POST /public/blogs/:id/like` - Like blog
- `POST /public/blogs/:id/comments` - Add comment
- `GET /public/blogs/:id/comments` - Get comments

### Protected Blogs (Requires Auth)
- `POST /blogs` - Create blog
- `GET /blogs` - Get user's blogs
- `PATCH /blogs/:id` - Update blog (owner only)
- `DELETE /blogs/:id` - Delete blog (owner only)

---

## Features

✅ **Authentication**: Mock-based (no database needed)
✅ **Blog Management**: Create, edit, delete, publish
✅ **Permission System**: Owner-only edit/delete
✅ **Public Feed**: View all published blogs
✅ **Likes**: Like published blogs
✅ **Comments**: Comment on published blogs
✅ **Responsive Design**: Works on all devices
✅ **Rich Text Editor**: Markdown support

---

## Troubleshooting

### Backend 500 Error

1. Check Vercel logs:
   ```bash
   vercel logs --project=ink-flow-backend
   ```

2. Verify `vercel.json` exists in `blog-platform-backend/`

3. Check `api/index.ts` is properly formatted

4. Ensure all dependencies are installed

### Frontend Not Connecting to Backend

1. Check `NEXT_PUBLIC_API_URL` in frontend environment variables
2. Verify backend is running and healthy
3. Check browser console for CORS errors
4. Ensure backend CORS allows frontend URL

### Data Not Persisting

- Backend uses in-memory storage
- Data resets when function restarts
- For persistence, connect to a database

---

## Production Improvements

### 1. Add Database

Replace in-memory storage with:
- PostgreSQL + Prisma
- MongoDB + Mongoose
- Firebase Firestore

### 2. Add Authentication

Replace mock auth with:
- JWT with secure tokens
- OAuth (Google, GitHub)
- NextAuth.js

### 3. Add File Storage

For blog images:
- AWS S3
- Cloudinary
- Vercel Blob Storage

### 4. Add Monitoring

- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics

---

## Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] Backend URL added to frontend env
- [ ] Frontend URL added to backend env
- [ ] CORS configured correctly
- [ ] Health check passing
- [ ] Can register new user
- [ ] Can create blog
- [ ] Can publish blog
- [ ] Can view public feed
- [ ] Can like blog
- [ ] Can comment on blog
- [ ] Permission system working (owner-only edit/delete)

---

## Support

For issues or questions:
1. Check Vercel logs
2. Review this guide
3. Check GitHub issues
4. Contact support

---

**Deployment Date**: March 15, 2026
**Status**: Ready for Production
