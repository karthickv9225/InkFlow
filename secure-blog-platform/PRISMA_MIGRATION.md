# 🔄 Prisma Migration Guide - From Supabase to Prisma

This guide helps you migrate from Supabase direct access to Prisma ORM.

## 📋 What Changed

### Before (Supabase)
```typescript
import { createServerSupabaseClient } from '@/lib/supabase/server'

const supabase = createServerSupabaseClient()
const { data } = await supabase
  .from('blogs')
  .select('*')
  .eq('isPublished', true)
```

### After (Prisma)
```typescript
import { prisma } from '@/lib/prisma'

const blogs = await prisma.blog.findMany({
  where: { isPublished: true },
})
```

## 🚀 Quick Setup

### Step 1: Install Prisma
```bash
npm install @prisma/client prisma
```

### Step 2: Update .env.local
```env
DATABASE_URL="postgresql://postgres:password@host:5432/database"
```

### Step 3: Run Migrations
```bash
npx prisma migrate deploy
```

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

## 📊 Database Setup

### Option A: Fresh Database
```bash
# Create new database
npx prisma migrate dev --name init

# This will:
# 1. Create all tables
# 2. Generate Prisma client
# 3. Create migration files
```

### Option B: Existing Supabase Database
```bash
# 1. Export data from Supabase
# 2. Import into PostgreSQL
# 3. Run: npx prisma migrate deploy
```

## 🔧 API Changes

### Blogs API

**Get Published Blogs**
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('blogs')
  .select('*')
  .eq('isPublished', true)
  .order('publishedAt', { ascending: false })

// After (Prisma)
const blogs = await prisma.blog.findMany({
  where: { isPublished: true },
  orderBy: { publishedAt: 'desc' },
})
```

**Create Blog**
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('blogs')
  .insert({ userId, title, slug, content })

// After (Prisma)
const blog = await prisma.blog.create({
  data: { userId, title, slug, content },
})
```

**Update Blog**
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('blogs')
  .update({ title, content })
  .eq('id', blogId)

// After (Prisma)
const blog = await prisma.blog.update({
  where: { id: blogId },
  data: { title, content },
})
```

**Delete Blog**
```typescript
// Before (Supabase)
await supabase.from('blogs').delete().eq('id', blogId)

// After (Prisma)
await prisma.blog.delete({ where: { id: blogId } })
```

### Likes API

**Toggle Like**
```typescript
// Before (Supabase)
const { data: existing } = await supabase
  .from('likes')
  .select('*')
  .eq('userId', userId)
  .eq('blogId', blogId)
  .single()

if (existing) {
  await supabase.from('likes').delete().eq('id', existing.id)
} else {
  await supabase.from('likes').insert({ userId, blogId })
}

// After (Prisma)
const existing = await prisma.like.findUnique({
  where: { userId_blogId: { userId, blogId } },
})

if (existing) {
  await prisma.like.delete({
    where: { userId_blogId: { userId, blogId } },
  })
} else {
  await prisma.like.create({ data: { userId, blogId } })
}
```

### Comments API

**Get Comments**
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('comments')
  .select('*')
  .eq('blogId', blogId)
  .order('createdAt', { ascending: false })

// After (Prisma)
const comments = await prisma.comment.findMany({
  where: { blogId },
  orderBy: { createdAt: 'desc' },
})
```

**Create Comment**
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('comments')
  .insert({ blogId, userId, content })

// After (Prisma)
const comment = await prisma.comment.create({
  data: { blogId, userId, content },
})
```

## 🔐 Authentication

### Keep Supabase Auth
The project still uses Supabase for authentication. Only the database layer changed to Prisma.

```typescript
// Still using Supabase Auth
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

## 📝 File Structure

```
secure-blog-platform/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration files
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── api/
│   │   ├── blogs.ts           # Updated for Prisma
│   │   ├── likes.ts           # Updated for Prisma
│   │   └── comments.ts        # Updated for Prisma
│   └── supabase/              # Still used for Auth
└── .env.local                 # DATABASE_URL added
```

## ✅ Migration Checklist

- [ ] Install Prisma packages
- [ ] Update `.env.local` with DATABASE_URL
- [ ] Run `npx prisma migrate deploy`
- [ ] Verify tables created
- [ ] Test API endpoints
- [ ] Update authentication if needed
- [ ] Deploy to production

## 🧪 Testing

### Test Blog Creation
```typescript
const blog = await prisma.blog.create({
  data: {
    userId: 'test-user',
    title: 'Test Blog',
    slug: 'test-blog',
    content: 'Test content',
  },
})
console.log('Blog created:', blog)
```

### Test Like System
```typescript
const like = await prisma.like.create({
  data: {
    userId: 'test-user',
    blogId: 'test-blog',
  },
})
console.log('Like created:', like)
```

### Test Comments
```typescript
const comment = await prisma.comment.create({
  data: {
    blogId: 'test-blog',
    userId: 'test-user',
    content: 'Great post!',
  },
})
console.log('Comment created:', comment)
```

## 🚀 Deployment

### Vercel
1. Add `DATABASE_URL` to environment variables
2. Run migrations before deployment:
   ```bash
   npx prisma migrate deploy
   ```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy
CMD ["npm", "start"]
```

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

## 🆘 Troubleshooting

### Connection Error
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db execute --stdin < /dev/null
```

### Migration Failed
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually fix and create new migration
npx prisma migrate dev --name fix_issue
```

### Type Errors
```bash
# Regenerate Prisma client
npx prisma generate
```

---

**You're all set!** Your blog platform now uses Prisma for type-safe database access. 🎉
