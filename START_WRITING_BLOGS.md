# 🚀 Start Writing Blogs - Complete Setup & Execution Guide

## Phase 1: Setup (10 minutes)

### Step 1: Start Backend Server

```bash
# Open Terminal 1
cd blog-platform-backend

# Install dependencies (if not done)
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345  - 01/01/2024, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/01/2024, 10:00:01 AM     LOG [InstanceLoader] AppModule dependencies initialized
Application is running on: http://localhost:3001
```

✅ Backend is ready on `http://localhost:3001`

---

### Step 2: Start Frontend Server

```bash
# Open Terminal 2
cd blog-platform-frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

✅ Frontend is ready on `http://localhost:3000`

---

## Phase 2: Create Your Account (2 minutes)

### Step 1: Open Browser
- Go to `http://localhost:3000`
- You should see the blog feed page

### Step 2: Register Account
1. Click "Sign Up" button (top right)
2. Fill in the registration form:
   - **Email**: `yourname@example.com`
   - **Username**: `yourname`
   - **Password**: `password123` (at least 8 characters)
3. Click "Create Account"

### Step 3: Verify Registration
- You should be redirected to login page
- Login with your credentials
- You should see the dashboard

✅ Account created and logged in!

---

## Phase 3: Write Your First Blog (5 minutes)

### Step 1: Go to Create Blog Page
1. Click "Write Blog" button (top right)
2. You should see the blog creation page with:
   - Title field
   - Slug field with "Auto" button
   - Summary field
   - Content editor with toolbar
   - Preview button
   - Publish checkbox

### Step 2: Fill in Blog Details

**Title:**
```
Getting Started with My Blog Platform
```

**Slug:** (Click "Auto" to generate)
```
getting-started-with-my-blog-platform
```

**Summary:**
```
This is my first blog post on this amazing platform. I'm excited to share my thoughts and experiences with the world!
```

### Step 3: Write Content

Use the editor to write your blog. Here's a template:

```markdown
## Introduction

Welcome to my first blog post! I'm excited to share my journey with this amazing blog platform.

## What is This Platform?

This is a modern blog platform built with:
- **Frontend**: Next.js 15 with React
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM

## Features

The platform includes:
- User authentication
- Blog creation and management
- Public blog feed
- Like system
- Comment system
- Markdown support

## Getting Started

To get started:
1. Create an account
2. Click "Write Blog"
3. Write your content
4. Publish your blog

## Conclusion

I'm excited to continue writing and sharing my thoughts on this platform. Stay tuned for more posts!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
```

### Step 4: Format Your Content

Use the toolbar buttons to format:

1. **Make text bold**: Select text → Click **B** button
   - Or type: `**text**`

2. **Make text italic**: Select text → Click *I* button
   - Or type: `*text*`

3. **Add heading**: Click H2 button
   - Or type: `## Heading`

4. **Add list**: Click List button
   - Or type: `- item`

5. **Add code**: Click Code button
   - Or type: ` ```code``` `

6. **Add link**: Click Link button
   - Or type: `[text](url)`

7. **Add image**: Click Image button
   - Or type: `![alt](url)`

### Step 5: Preview Your Blog

1. Click "Preview" button (top right of editor)
2. See how your blog looks formatted
3. Click "Edit" to go back to editing

### Step 6: Publish Your Blog

**Option A: Publish Immediately**
1. Check "Publish immediately" checkbox
2. Click "Create Blog" button
3. Blog appears on public feed right away

**Option B: Save as Draft**
1. Leave "Publish immediately" unchecked
2. Click "Create Blog" button
3. Blog is saved but not visible
4. Publish later from dashboard

✅ Your first blog is created!

---

## Phase 4: View Your Blog (2 minutes)

### Step 1: Go to Dashboard
1. Click "Dashboard" link (top right)
2. You should see your blog in the list

### Step 2: View Blog Statistics
- See number of likes
- See number of comments
- See creation date

### Step 3: View Published Blog
1. Click the eye icon (view button)
2. See your blog as readers will see it
3. See like and comment sections

### Step 4: Interact with Your Blog
1. Click heart icon to like your own blog
2. Scroll down to comments section
3. Add a comment to test the feature

✅ Your blog is live!

---

## Phase 5: Create More Blogs (Repeat)

### Blog Ideas to Write

**Technical Blogs:**
- "Getting Started with Next.js"
- "Understanding React Hooks"
- "Database Design Best Practices"
- "API Development with NestJS"

**Personal Blogs:**
- "My Learning Journey"
- "Lessons from Building Projects"
- "Tips for Staying Productive"
- "My Favorite Tools and Resources"

**Tutorial Blogs:**
- "How to Build a Blog Platform"
- "Step-by-Step Guide to React"
- "Introduction to TypeScript"
- "Database Fundamentals"

### Quick Blog Creation Workflow

1. Click "Write Blog"
2. Enter title
3. Click "Auto" for slug
4. Write summary
5. Write content using markdown
6. Click "Preview" to check
7. Check "Publish immediately"
8. Click "Create Blog"

---

## Phase 6: Manage Your Blogs

### Edit Blog
1. Go to Dashboard
2. Click pencil icon (edit button)
3. Make changes
4. Click "Update Blog"

### Delete Blog
1. Go to Dashboard
2. Click trash icon (delete button)
3. Confirm deletion
4. Blog is removed

### Publish/Unpublish
1. Go to Dashboard
2. Click pencil icon
3. Check/uncheck "Publish this blog"
4. Click "Update Blog"

---

## Markdown Formatting Reference

### Text Formatting

```markdown
**Bold text** → Bold text
*Italic text* → Italic text
***Bold and italic*** → Bold and italic
```

### Headings

```markdown
## Heading 2
### Heading 3
#### Heading 4
```

### Lists

```markdown
- Item 1
- Item 2
- Item 3

1. First item
2. Second item
3. Third item
```

### Code

```markdown
Inline code: `const x = 5;`

Code block:
```javascript
function hello() {
  console.log("Hello, World!");
}
```
```

### Links and Images

```markdown
[Link text](https://example.com)
![Alt text](https://example.com/image.jpg)
```

### Blockquote

```markdown
> This is a quote
> It can span multiple lines
```

---

## Troubleshooting

### Backend Won't Start

**Error: Port 3001 already in use**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3002 npm run start:dev
```

**Error: Database connection failed**
```bash
# Check DATABASE_URL in .env
cat .env

# Test connection
psql $DATABASE_URL

# Run migrations again
npm run prisma:migrate
```

### Frontend Won't Start

**Error: Port 3000 already in use**
```bash
# Use different port
npm run dev -- -p 3001
```

**Error: Can't connect to backend**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on `http://localhost:3001`
- Check browser console for errors

### Can't Create Blog

**Error: "Slug already exists"**
- Use a different slug
- Slug must be unique

**Error: "Title is required"**
- Make sure title field is filled
- Title must be at least 3 characters

**Error: "Content is required"**
- Make sure content field is filled
- Content must be at least 10 characters

### Blog Not Appearing in Feed

**Issue: Blog not visible on public feed**
- Make sure blog is published
- Check "Publish immediately" or publish from dashboard
- Refresh the page

**Issue: Can't edit blog**
- Make sure you're logged in
- Verify you're the blog owner
- Check that blog exists

---

## Testing Checklist

- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can create blog
- [ ] Can see blog in dashboard
- [ ] Can publish blog
- [ ] Can see blog in public feed
- [ ] Can like blog
- [ ] Can add comment
- [ ] Can edit blog
- [ ] Can delete blog
- [ ] Can view blog detail page
- [ ] Markdown formatting works
- [ ] Preview mode works

---

## Sample Blog Content

### Blog 1: Introduction

```markdown
# Welcome to My Blog!

## Hello World

This is my first blog post on this amazing platform. I'm excited to share my thoughts and experiences with you.

## About Me

I'm a developer passionate about:
- Building amazing web applications
- Learning new technologies
- Sharing knowledge with the community

## What to Expect

On this blog, I'll be writing about:
- Web development tips and tricks
- My learning journey
- Project tutorials
- Technology reviews

## Let's Connect

Feel free to:
- Like my posts
- Leave comments
- Share your thoughts

Thanks for reading! 🚀
```

### Blog 2: Technical Tutorial

```markdown
# Getting Started with Next.js 15

## Introduction

Next.js is a powerful React framework for building modern web applications. In this post, I'll show you how to get started.

## What is Next.js?

Next.js is a React framework that provides:
- Server-side rendering
- Static site generation
- API routes
- Built-in optimization

## Installation

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## Creating Your First Page

Create a file `app/page.tsx`:

```typescript
export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <p>This is my first Next.js page.</p>
    </div>
  );
}
```

## Conclusion

Next.js makes it easy to build modern web applications. Start building today!

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
```

---

## Next Steps After Writing

1. ✅ Write your first blog
2. ✅ Publish it
3. ✅ View on public feed
4. ✅ Get likes and comments
5. ⏳ Write more blogs
6. ⏳ Build an audience
7. ⏳ Deploy to production

---

## Deployment (Optional)

### Deploy Backend (Railway)

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project
4. Connect GitHub repository
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Set `NEXT_PUBLIC_API_URL` to backend URL
5. Deploy

---

## Support

If you encounter issues:

1. Check this guide
2. Review error messages
3. Check browser console (F12)
4. Check backend logs
5. Review documentation files

---

## Summary

You now have:
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ User authentication working
- ✅ Blog creation working
- ✅ Public feed working
- ✅ Like and comment system working

**Start writing your first blog now!** 🎉

Go to: `http://localhost:3000`
