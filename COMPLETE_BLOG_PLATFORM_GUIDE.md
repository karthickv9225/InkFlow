# Complete Blog Platform - Full Setup Guide

## 🎯 Overview

You now have a **complete, production-ready blog platform** with:
- ✅ NestJS backend with authentication
- ✅ Next.js 15 frontend with all pages
- ✅ Blog creation, editing, deletion
- ✅ Public feed with pagination
- ✅ Like and comment system
- ✅ User dashboard

## 📁 Project Structure

```
blog-platform/
├── blog-platform-backend/     # NestJS backend
│   ├── src/
│   │   ├── auth/             # Authentication
│   │   ├── blogs/            # Blog management
│   │   ├── public/           # Public endpoints
│   │   ├── prisma/           # Database
│   │   └── app.module.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env
│   └── package.json
│
└── blog-platform-frontend/    # Next.js frontend
    ├── app/
    │   ├── page.tsx          # Home/Feed
    │   ├── auth/             # Auth pages
    │   ├── dashboard/        # Dashboard
    │   ├── blog/             # Blog detail
    │   └── layout.tsx
    ├── lib/
    │   ├── api.ts            # API client
    │   └── store.ts          # Auth store
    ├── .env.local
    └── package.json
```

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup

```bash
cd blog-platform-backend

# Install dependencies
npm install

# Setup database
cp .env.example .env
# Update DATABASE_URL in .env

# Run migrations
npm run prisma:generate
npm run prisma:migrate

# Start backend
npm run start:dev
```

Backend runs on: `http://localhost:3001`

### Step 2: Frontend Setup

```bash
cd blog-platform-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Step 3: Test the Application

1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Create an account
4. Click "Write Blog"
5. Create your first blog post
6. Publish it
7. View on public feed
8. Like and comment

## 📝 Creating a Blog - Step by Step

### 1. Register/Login
- Go to `http://localhost:3000/auth/register`
- Fill in email, username, password
- Click "Create Account"
- You'll be redirected to dashboard

### 2. Create Blog
- Click "Write Blog" button
- Fill in:
  - **Title**: Your blog title
  - **Slug**: URL-friendly slug (auto-generate available)
  - **Summary**: Brief description (optional)
  - **Content**: Your blog content
  - **Publish**: Check to publish immediately
- Click "Create Blog"

### 3. Manage Blogs
- View all your blogs in dashboard
- Edit blog details
- Delete blogs
- Publish/unpublish
- View statistics

### 4. Share & Interact
- View published blogs on public feed
- Like blogs
- Add comments
- View other users' blogs

## 🔑 Key Features

### Authentication
- Register with email, username, password
- Login with email and password
- JWT-based authentication
- Protected routes
- Auto-logout on token expiration

### Blog Management
- Create blogs with title, slug, content, summary
- Edit blog details
- Delete blogs
- Publish/unpublish blogs
- View blog statistics (likes, comments)

### Public Feed
- View all published blogs
- Pagination support
- Sort by newest first
- See author info
- Like count and comment count

### Interactions
- Like/unlike blogs
- Add comments
- View comments
- See comment author and date

### Dashboard
- View all your blogs
- Quick stats (total blogs, published, likes)
- Edit/delete blogs
- Publish/unpublish blogs

## 🛠️ API Endpoints

### Authentication
```
POST /auth/register
POST /auth/login
```

### Blogs (Protected)
```
POST /blogs                 # Create
GET /blogs                  # Get user blogs
GET /blogs/:id              # Get blog
PATCH /blogs/:id            # Update
DELETE /blogs/:id           # Delete
```

### Public
```
GET /public/feed            # Get feed
GET /public/blogs/:slug     # Get blog
POST /public/blogs/:id/like # Like
DELETE /public/blogs/:id/like # Unlike
POST /public/blogs/:id/comments # Add comment
GET /public/blogs/:id/comments # Get comments
```

## 🗄️ Database Schema

### User
- id (primary key)
- email (unique)
- username (unique)
- passwordHash
- createdAt, updatedAt

### Blog
- id (primary key)
- userId (foreign key)
- title, slug (unique), content, summary
- isPublished
- createdAt, updatedAt

### Like
- id (primary key)
- userId, blogId (foreign keys)
- Unique constraint: (userId, blogId)

### Comment
- id (primary key)
- blogId, userId (foreign keys)
- content
- createdAt, updatedAt

## 🔐 Security Features

✅ Password hashing with bcrypt
✅ JWT authentication
✅ Input validation
✅ Ownership verification
✅ Duplicate like prevention
✅ CORS enabled
✅ Environment variables for secrets

## 📊 Performance

✅ Optimized Prisma queries
✅ Pagination support
✅ Database indexes
✅ No N+1 queries
✅ Efficient relationships

## 🚢 Deployment

### Backend (Railway/Render)

1. Push to GitHub
2. Connect repository
3. Add PostgreSQL database
4. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-frontend.com
   ```
5. Deploy

### Frontend (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.com
   ```
4. Deploy

## 📚 File Locations

### Backend Files
- `blog-platform-backend/src/auth/` - Authentication
- `blog-platform-backend/src/blogs/` - Blog management
- `blog-platform-backend/src/public/` - Public endpoints
- `blog-platform-backend/prisma/schema.prisma` - Database schema

### Frontend Files
- `blog-platform-frontend/app/auth/` - Auth pages
- `blog-platform-frontend/app/dashboard/` - Dashboard
- `blog-platform-frontend/app/blog/` - Blog detail
- `blog-platform-frontend/lib/api.ts` - API client
- `blog-platform-frontend/lib/store.ts` - Auth store

## 🧪 Testing

### Backend
```bash
npm run test
npm run test:cov
```

### Frontend
```bash
npm run test
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port
lsof -i :3001

# Check database
psql $DATABASE_URL

# Regenerate Prisma
npm run prisma:generate
```

### Frontend can't connect
- Check `NEXT_PUBLIC_API_URL`
- Ensure backend is running
- Check browser console for errors

### Database errors
```bash
# Reset (development only)
npx prisma migrate reset

# View database
npm run prisma:studio
```

### Authentication issues
- Clear localStorage
- Check token in DevTools
- Verify backend is returning token

## 📖 Documentation

- `blog-platform-backend/README.md` - Backend docs
- `blog-platform-frontend/README.md` - Frontend docs
- `blog-platform-backend/SETUP_INSTRUCTIONS.md` - Setup guide

## 🎯 Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is ready
3. ⏳ Test locally
4. ⏳ Deploy to production
5. ⏳ Monitor and scale

## 💡 Tips

### For Development
- Use mock data for testing
- Keep backend and frontend running
- Check browser console for errors
- Use Prisma Studio to view database

### For Production
- Set strong JWT_SECRET
- Use HTTPS only
- Enable rate limiting
- Monitor error logs
- Set up backups

## 🎉 You're All Set!

Your blog platform is ready to use. Start creating blogs and sharing your stories!

**Happy blogging!** 🚀

---

## Quick Commands

```bash
# Backend
cd blog-platform-backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev

# Frontend
cd blog-platform-frontend
npm install
npm run dev

# View database
npm run prisma:studio

# Build for production
npm run build
npm start
```

---

## Support

For issues:
1. Check README files
2. Check SETUP_INSTRUCTIONS.md
3. Review API documentation
4. Check official docs (NestJS, Next.js, Prisma)
