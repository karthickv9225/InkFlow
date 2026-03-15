# 🔄 Prisma Database Setup Guide

This project now uses **Prisma ORM** with PostgreSQL instead of Supabase direct access.

## ✨ Benefits of Prisma

- Type-safe database queries
- Automatic migrations
- Built-in validation
- Better performance
- Easier testing

## 📋 Setup Steps

### 1. Install Dependencies
```bash
npm install @prisma/client prisma
```

### 2. Configure Database URL

Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@host:5432/database"
```

### 3. Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### 4. Create Database Tables

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables
- Generate Prisma client
- Create migration files

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Verify Setup

```bash
npx prisma studio
```

Opens Prisma Studio to view/manage data.

---

## 📊 Database Schema

### User Table
```prisma
model User {
  id          String      @id @default(uuid())
  email       String      @unique
  passwordHash String
  username    String      @unique
  fullName    String?
  avatarUrl   String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  blogs       Blog[]
  likes       Like[]
  comments    Comment[]
}
```

### Blog Table
```prisma
model Blog {
  id          String      @id @default(uuid())
  userId      String
  title       String
  slug        String      @unique
  content     String
  excerpt     String?
  isPublished Boolean     @default(false)
  viewCount   Int         @default(0)
  likeCount   Int         @default(0)
  commentCount Int        @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  publishedAt DateTime?
  
  author      User        @relation(fields: [userId], references: [id])
  likes       Like[]
  comments    Comment[]
}
```

### Like Table
```prisma
model Like {
  id        String    @id @default(uuid())
  userId    String
  blogId    String
  createdAt DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id])
  blog      Blog      @relation(fields: [blogId], references: [id])
  
  @@unique([userId, blogId])
}
```

### Comment Table
```prisma
model Comment {
  id        String    @id @default(uuid())
  blogId    String
  userId    String
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  blog      Blog      @relation(fields: [blogId], references: [id])
  user      User      @relation(fields: [userId], references: [id])
}
```

---

## 🔧 Common Commands

### Create Migration
```bash
npx prisma migrate dev --name add_feature
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

### Generate Client
```bash
npx prisma generate
```

### Format Schema
```bash
npx prisma format
```

---

## 📝 API Usage Examples

### Create Blog
```typescript
import { prisma } from '@/lib/prisma'

const blog = await prisma.blog.create({
  data: {
    userId: 'user-id',
    title: 'My Blog',
    slug: 'my-blog',
    content: 'Blog content...',
  },
})
```

### Get Published Blogs
```typescript
const blogs = await prisma.blog.findMany({
  where: { isPublished: true },
  include: { author: true },
  orderBy: { publishedAt: 'desc' },
})
```

### Like Blog
```typescript
await prisma.like.create({
  data: {
    userId: 'user-id',
    blogId: 'blog-id',
  },
})

// Update like count
await prisma.blog.update({
  where: { id: 'blog-id' },
  data: { likeCount: { increment: 1 } },
})
```

### Add Comment
```typescript
const comment = await prisma.comment.create({
  data: {
    blogId: 'blog-id',
    userId: 'user-id',
    content: 'Great post!',
  },
  include: { user: true },
})
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   - Add to `.gitignore`
   - Use environment variables in production

2. **Validate user input**
   - Check ownership before updates
   - Sanitize content

3. **Use transactions for complex operations**
   ```typescript
   await prisma.$transaction([
     prisma.blog.update(...),
     prisma.like.create(...),
   ])
   ```

4. **Implement rate limiting**
   - Limit API calls per user
   - Prevent abuse

---

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

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check DATABASE_URL |
| Migration failed | Run `npx prisma migrate reset` |
| Type errors | Run `npx prisma generate` |
| Slow queries | Add indexes in schema |

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

## ✅ Migration Checklist

- [ ] Install Prisma packages
- [ ] Update `.env.local` with DATABASE_URL
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify tables in Prisma Studio
- [ ] Update authentication to use Prisma
- [ ] Test all API endpoints
- [ ] Deploy to production

---

Happy coding with Prisma! 🎉
