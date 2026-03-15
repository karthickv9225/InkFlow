# 🚀 Secure Blog Platform

A production-ready blogging platform built with Next.js, React, TypeScript, TailwindCSS, and Supabase.

## ✨ Features

- 👤 User authentication (register/login)
- 📝 Create, edit, delete blogs
- ❤️ Like system with optimistic updates
- 💬 Comment system
- 📰 Public blog feed with pagination
- 🔒 Protected dashboard
- 📱 Responsive design
- 🔐 Row-level security

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
- Create project at supabase.com
- Disable email confirmation (Settings → Auth → Email)
- Run SQL schema from `lib/database/schema.sql`

### 3. Configure Environment
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
DATABASE_URL=your-database-url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development
```bash
npm run dev
```

Visit: http://localhost:3000

## 📚 Documentation

- **QUICK_START.md** - Get running in 5 minutes
- **SETUP_GUIDE.md** - Complete setup instructions
- **PROJECT_DOCUMENTATION.md** - Architecture & API reference

## 🎯 Usage

### Register & Login
1. Go to `/register` to create account
2. Go to `/login` to sign in

### Create Blog
1. Click "Dashboard"
2. Click "Create New Blog"
3. Fill in title, slug, content
4. Click "Publish"

### Interact
- Like blogs (heart icon)
- Add comments
- Edit/delete from dashboard

## 🚀 Deploy to Vercel

```bash
git push origin main
# Then import to vercel.com
```

## 📁 Project Structure

```
secure-blog-platform/
├── app/              # Next.js pages
├── components/       # React components
├── lib/
│   ├── api/         # API layer
│   ├── auth/        # Auth utilities
│   ├── supabase/    # Supabase clients
│   └── types/       # TypeScript types
├── hooks/           # Custom hooks
└── middleware.ts    # Route protection
```

## 🔐 Security

- Row-Level Security (RLS) on all tables
- Protected routes with middleware
- Secure session handling
- User-owned data isolation

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email rate limit | Disable email confirmation in Supabase |
| Tables not found | Run SQL schema in Supabase |
| Auth not working | Check `.env.local` credentials |

## 📈 Scaling for 1M Users

- Supabase auto-scaling PostgreSQL
- Redis caching layer
- Vercel edge network
- Rate limiting middleware
- Monitoring & analytics

## 📝 License

MIT License - Free for personal and commercial use

## 🤝 Support

For issues or questions, check the documentation files or Supabase/Next.js docs.

---

**Ready to start blogging?** 🎉

1. Follow QUICK_START.md
2. Create your first blog
3. Share with the world!
