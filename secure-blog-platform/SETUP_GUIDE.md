# 🚀 Secure Blog Platform - Complete Setup Guide

## Project Overview

A production-ready blogging platform built with Next.js, React, TypeScript, TailwindCSS, and Supabase.

**Features:**
- ✅ User authentication (register/login)
- ✅ Blog creation, editing, deletion
- ✅ Like system with optimistic updates
- ✅ Comment system
- ✅ Public blog feed with pagination
- ✅ Protected dashboard
- ✅ Responsive design
- ✅ Row-level security

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available)
- Git (optional)

---

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Create a new project
4. Note your **Project URL** and **Anon Key**

### 1.2 Disable Email Confirmation (Development)
1. Go to **Authentication** → **Providers** → **Email**
2. Turn OFF **"Confirm email"** toggle
3. Save changes

This allows instant signup without email verification during development.

### 1.3 Create Database Tables
1. Go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the SQL schema below:

```sql
-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blog_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON public.blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_blog_id ON public.likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON public.comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Row Level Security Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Published blogs are viewable by everyone" 
  ON public.blogs FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own blogs" 
  ON public.blogs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blogs" 
  ON public.blogs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blogs" 
  ON public.blogs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blogs" 
  ON public.blogs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" 
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can insert own likes" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Triggers for automatic count updates
CREATE OR REPLACE FUNCTION update_blog_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.blogs SET like_count = like_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.blogs SET like_count = like_count - 1 WHERE id = OLD.blog_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.blogs SET comment_count = comment_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.blogs SET comment_count = comment_count - 1 WHERE id = OLD.blog_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_like_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION update_blog_counts();

CREATE TRIGGER update_comment_count
AFTER INSERT OR DELETE ON public.comments
FOR EACH ROW EXECUTE FUNCTION update_blog_counts();
```

4. Click **Run** and wait for completion

---

## 🔑 Step 2: Environment Setup

### 2.1 Update .env.local

The `.env.local` file is already created. Update it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these values from:
- **Project URL**: Supabase Dashboard → Settings → API
- **Anon Key**: Supabase Dashboard → Settings → API → `anon` key
- **Database URL**: Supabase Dashboard → Settings → Database

---

## 🚀 Step 3: Run the Project

### 3.1 Install Dependencies
```bash
cd secure-blog-platform
npm install
```

### 3.2 Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 📱 Step 4: Test the Application

### 4.1 Register a New Account
1. Go to http://localhost:3000/register
2. Fill in the form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
3. Click "Create account"
4. You'll be redirected to login

### 4.2 Login
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Click "Sign in"

### 4.3 Create a Blog
1. Click "Dashboard" in the navbar
2. Click "Create New Blog"
3. Fill in:
   - Title: "My First Blog"
   - Slug: "my-first-blog"
   - Content: Your blog content
4. Click "Publish" to make it public

### 4.4 View Public Feed
1. Click "Home" in the navbar
2. See your published blog
3. Click on it to view the full post

### 4.5 Test Interactions
- **Like**: Click the heart icon
- **Comment**: Scroll down and add a comment
- **Edit**: Go to dashboard and edit your blog
- **Delete**: Go to dashboard and delete your blog

---

## 📁 Project Structure

```
secure-blog-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── BlogCard.tsx
│   ├── CommentForm.tsx
│   ├── CommentItem.tsx
│   ├── LikeButton.tsx
│   └── Navbar.tsx
├── lib/
│   ├── api/
│   │   ├── blogs.ts
│   │   ├── comments.ts
│   │   └── likes.ts
│   ├── auth/
│   │   ├── auth.ts
│   │   └── client-auth.ts
│   ├── database/
│   │   └── schema.sql
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── types/
│       └── database.ts
├── hooks/
│   └── useAuth.ts
├── middleware.ts
├── .env.local
└── package.json
```

---

## 🔐 Security Features

- ✅ Row-Level Security (RLS) on all tables
- ✅ Protected routes with middleware
- ✅ Secure session handling
- ✅ User-owned data isolation
- ✅ CSRF protection via Supabase
- ✅ Password hashing (Supabase Auth)

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/secure-blog-platform.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
5. Click "Deploy"

---

## 🐛 Troubleshooting

### Email Rate Limit Exceeded
**Solution**: Disable email confirmation in Supabase settings (already done in setup)

### Database Tables Not Found
**Solution**: Run the SQL schema in Supabase SQL Editor

### Authentication Not Working
**Solution**: Check `.env.local` has correct Supabase credentials

### Middleware Errors
**Solution**: Clear `.next` folder and restart dev server:
```bash
rm -rf .next
npm run dev
```

---

## 📚 API Reference

### BlogAPI
- `getPublishedBlogs(page, limit)` - Get paginated published blogs
- `getBlogBySlug(slug)` - Get single blog by slug
- `getUserBlogs(userId)` - Get user's blogs
- `createBlog(blog)` - Create new blog
- `updateBlog(id, updates)` - Update blog
- `deleteBlog(id)` - Delete blog

### LikeAPI
- `getBlogLikes(blogId)` - Get blog likes
- `toggleLike(blogId, userId)` - Like/unlike blog

### CommentAPI
- `getBlogComments(blogId)` - Get blog comments
- `createComment(blogId, userId, content)` - Add comment
- `updateComment(commentId, userId, content)` - Edit comment
- `deleteComment(commentId, userId)` - Delete comment

---

## 📈 Scaling Strategy for 1M Users

1. **Database**: Supabase auto-scaling PostgreSQL
2. **Caching**: Redis for frequent queries
3. **CDN**: Vercel edge network
4. **Rate Limiting**: Middleware-based protection
5. **Monitoring**: Supabase logs + Vercel analytics

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Next.js documentation

Happy blogging! 🎉
