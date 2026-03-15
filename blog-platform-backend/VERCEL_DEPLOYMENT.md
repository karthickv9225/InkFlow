# Vercel Deployment Guide

## Backend Deployment (Express API)

The backend has been converted to an Express.js API that works with Vercel's serverless functions.

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with the code pushed

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Convert backend to Express for Vercel"
   git push origin master
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select `blog-platform-backend` as the root directory
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - Add `FRONTEND_URL` pointing to your frontend deployment
   - Example: `https://your-frontend.vercel.app`

### API Endpoints

All endpoints are available at your Vercel deployment URL:

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

**Public Blogs:**
- `GET /public/feed` - Get published blogs
- `GET /public/blogs/:slug` - Get blog by slug
- `POST /public/blogs/:id/like` - Like a blog
- `DELETE /public/blogs/:id/like` - Unlike a blog
- `POST /public/blogs/:id/comments` - Add comment
- `GET /public/blogs/:id/comments` - Get comments

**Protected Blogs:**
- `POST /blogs` - Create blog (requires auth)
- `GET /blogs` - Get user's blogs (requires auth)
- `PATCH /blogs/:id` - Update blog (requires auth, owner only)
- `DELETE /blogs/:id` - Delete blog (requires auth, owner only)

**Health:**
- `GET /health` - Health check

### Features

✅ Mock authentication (no database needed)
✅ In-memory storage (data persists during session)
✅ CORS enabled
✅ Permission system (owner-only edit/delete)
✅ Serverless compatible

### Notes

- Data is stored in memory and will be reset when the function restarts
- For production, connect to a database (PostgreSQL, MongoDB, etc.)
- The API uses base64 encoding for tokens (mock auth)

### Troubleshooting

If you get a 500 error:
1. Check Vercel logs: `vercel logs`
2. Ensure `vercel.json` is in the root of `blog-platform-backend`
3. Verify all dependencies are installed: `npm install`
4. Check that `api/index.ts` exists and is properly formatted

### Next Steps

1. Deploy frontend to Vercel
2. Update frontend `.env.local` with backend URL
3. Test all features
4. Connect to a real database for persistence
