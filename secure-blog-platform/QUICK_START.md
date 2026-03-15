# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Clone/Download Project
```bash
cd secure-blog-platform
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note your URL and Anon Key

2. **Disable Email Confirmation** (Development)
   - Authentication → Providers → Email
   - Turn OFF "Confirm email"

3. **Run Database Schema**
   - Go to SQL Editor
   - Create new query
   - Copy schema from `lib/database/schema.sql`
   - Click Run

### Step 4: Configure Environment
Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
DATABASE_URL=your-database-url
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📝 Test Workflow

### 1. Register
- Go to `/register`
- Fill form and submit
- Redirected to login

### 2. Login
- Go to `/login`
- Enter credentials
- Redirected to dashboard

### 3. Create Blog
- Click "Dashboard"
- Click "Create New Blog"
- Fill title, slug, content
- Click "Publish"

### 4. View Blog
- Click "Home"
- See your blog in feed
- Click to view full post

### 5. Interact
- Like the blog (heart icon)
- Add comments
- Edit/delete from dashboard

---

## 🛠️ Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email rate limit | Disable email confirmation in Supabase |
| Tables not found | Run SQL schema in Supabase SQL Editor |
| Auth not working | Check `.env.local` credentials |
| Middleware errors | Delete `.next` folder, restart server |
| Port 3000 in use | Change port: `npm run dev -- -p 3001` |

---

## 📚 File Structure

```
secure-blog-platform/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/
│   ├── api/               # API abstraction
│   ├── auth/              # Auth utilities
│   ├── supabase/          # Supabase clients
│   └── types/             # TypeScript types
├── hooks/                 # Custom hooks
├── .env.local             # Environment variables
├── middleware.ts          # Route protection
└── package.json           # Dependencies
```

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 2. Go to vercel.com
# 3. Import GitHub repo
# 4. Add environment variables
# 5. Deploy!
```

---

## 📊 Features Checklist

- ✅ User Authentication
- ✅ Blog CRUD
- ✅ Like System
- ✅ Comments
- ✅ Public Feed
- ✅ Dashboard
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Rate Limit Handling
- ✅ Security (RLS)

---

## 💡 Tips

1. **Development**: Disable email confirmation for faster testing
2. **Passwords**: Use strong passwords in production
3. **Backups**: Export Supabase data regularly
4. **Monitoring**: Check error logs in Supabase dashboard
5. **Performance**: Use pagination for large datasets

---

## 🎉 You're Ready!

Your blog platform is ready to use. Start creating content!

For detailed documentation, see:
- `SETUP_GUIDE.md` - Complete setup instructions
- `PROJECT_DOCUMENTATION.md` - Architecture & API reference

Happy blogging! 🚀
