# 🗄️ Database Setup Guide

Your blog platform is ready! Follow these steps to set up your PostgreSQL database.

## Quick Start (5 minutes)

### Step 1: Choose Your Database

**Option A: Supabase (Easiest - Free Tier)**
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub/Google
4. Create a new project
5. Wait for it to initialize
6. Go to Settings → Database → Connection String
7. Copy the connection string

**Option B: Local PostgreSQL**
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Windows (Download installer)
# https://www.postgresql.org/download/windows/

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

Create a database:
```bash
createdb blog_platform
```

Get connection string:
```
postgresql://postgres:password@localhost:5432/blog_platform
```

**Option C: Railway/Render/PlanetScale**
- Create account on their platform
- Create PostgreSQL database
- Copy connection string

---

### Step 2: Update Environment Variables

Edit `.env.local` in your project root:

```env
# Database Configuration (Prisma)
DATABASE_URL="postgresql://user:password@host:5432/database"

# Supabase Configuration (for Auth only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Example for Supabase:**
```env
DATABASE_URL="postgresql://postgres.izudkpehqivyxadzbpmz:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://izudkpehqivyxadzbpmz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_toxpvMTEI8ZqiWs98DEjOQ_3bUfQJzs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 3: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate deploy
```

If you get an error, try:
```bash
# For development (creates migration)
npx prisma migrate dev --name init
```

---

### Step 4: Verify Setup

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

You should see empty tables:
- `User`
- `Blog`
- `Like`
- `Comment`

---

### Step 5: Restart Development Server

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the home page!

---

## Testing the Setup

### 1. Create an Account

1. Go to http://localhost:3000/register
2. Fill in:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `password123`
3. Click "Create account"
4. You should be redirected to login

### 2. Login

1. Enter your email and password
2. Click "Sign in"
3. You should see the dashboard

### 3. Create a Blog

1. Click "Create New Blog"
2. Fill in:
   - Title: "My First Blog"
   - Slug: "my-first-blog"
   - Content: "Hello world!"
3. Click "Create Blog"
4. Click "Publish" to make it public

### 4. View Your Blog

1. Go to home page
2. You should see your blog in the feed
3. Click on it to view the full post
4. Try liking and commenting!

---

## Troubleshooting

### Error: "Connection refused"
**Cause:** PostgreSQL is not running or DATABASE_URL is wrong

**Solution:**
```bash
# Check if PostgreSQL is running
psql -U postgres

# If not running, start it
# macOS: brew services start postgresql
# Linux: sudo service postgresql start
# Windows: Start PostgreSQL service
```

### Error: "Cannot find module '.prisma/client/default'"
**Cause:** Prisma client not generated

**Solution:**
```bash
npx prisma generate
```

### Error: "relation 'User' does not exist"
**Cause:** Migrations not run

**Solution:**
```bash
npx prisma migrate deploy
```

### Error: "Too many signup attempts"
**Cause:** Supabase email rate limit

**Solution:** See FIX_RATE_LIMIT.md

### Error: "Invalid connection string"
**Cause:** DATABASE_URL format is wrong

**Solution:** Check your connection string format:
```
postgresql://user:password@host:port/database
```

---

## Database Schema

### User Table
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  fullName TEXT,
  avatarUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Table
```sql
CREATE TABLE "Blog" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "User"(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  isPublished BOOLEAN DEFAULT false,
  viewCount INTEGER DEFAULT 0,
  likeCount INTEGER DEFAULT 0,
  commentCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  publishedAt TIMESTAMP
);
```

### Like Table
```sql
CREATE TABLE "Like" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "User"(id),
  blogId TEXT NOT NULL REFERENCES "Blog"(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, blogId)
);
```

### Comment Table
```sql
CREATE TABLE "Comment" (
  id TEXT PRIMARY KEY,
  blogId TEXT NOT NULL REFERENCES "Blog"(id),
  userId TEXT NOT NULL REFERENCES "User"(id),
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name add_feature

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format schema
npx prisma format

# Generate client
npx prisma generate

# Check schema validity
npx prisma validate
```

---

## Next Steps

1. ✅ Set up database
2. ✅ Create account
3. ✅ Create blog posts
4. ✅ Test likes and comments
5. 📦 Deploy to Vercel
6. 🚀 Share with friends!

---

## Need Help?

- **Prisma Issues:** https://github.com/prisma/prisma/issues
- **PostgreSQL Issues:** https://www.postgresql.org/support/
- **Supabase Issues:** https://github.com/supabase/supabase/issues

Happy blogging! 🎉

