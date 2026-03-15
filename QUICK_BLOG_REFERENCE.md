# 🚀 Quick Blog Writing Reference

## 5-Minute Quick Start

### 1. Register
```
Go to: http://localhost:3000/auth/register
Fill: Email, Username, Password
Click: Create Account
```

### 2. Create Blog
```
Click: "Write Blog" button
Fill: Title, Slug, Content
Click: "Create Blog"
```

### 3. Publish
```
Check: "Publish immediately"
Or: Publish later from dashboard
```

## Markdown Cheat Sheet

| Format | Syntax | Result |
|--------|--------|--------|
| Bold | `**text**` | **text** |
| Italic | `*text*` | *text* |
| Heading | `## text` | Heading |
| List | `- item` | • item |
| Link | `[text](url)` | [text](url) |
| Image | `![alt](url)` | Image |
| Code | `` `code` `` | `code` |

## Toolbar Buttons

| Icon | Function |
|------|----------|
| **B** | Bold |
| *I* | Italic |
| H2 | Heading |
| ≡ | List |
| </> | Code |
| 🔗 | Link |
| 🖼️ | Image |

## Blog URLs

| Page | URL |
|------|-----|
| Home | `http://localhost:3000` |
| Register | `http://localhost:3000/auth/register` |
| Login | `http://localhost:3000/auth/login` |
| Dashboard | `http://localhost:3000/dashboard` |
| Create Blog | `http://localhost:3000/dashboard/create` |
| Edit Blog | `http://localhost:3000/dashboard/edit/[id]` |
| View Blog | `http://localhost:3000/blog/[slug]` |

## Common Tasks

### Create Blog
1. Click "Write Blog"
2. Enter title
3. Auto-generate slug
4. Write content
5. Click "Create Blog"

### Edit Blog
1. Go to Dashboard
2. Click edit icon (pencil)
3. Make changes
4. Click "Update Blog"

### Publish Blog
1. Go to Dashboard
2. Click edit icon
3. Check "Publish this blog"
4. Click "Update Blog"

### Delete Blog
1. Go to Dashboard
2. Click delete icon (trash)
3. Confirm deletion

### Like Blog
1. Go to blog page
2. Click heart icon
3. Like count increases

### Comment
1. Go to blog page
2. Scroll to comments
3. Enter comment
4. Click "Post Comment"

## Writing Tips

✅ **Good Titles**
- "Getting Started with React Hooks"
- "10 JavaScript Tips You Should Know"
- "Building a Blog Platform with Next.js"

❌ **Bad Titles**
- "Blog Post"
- "My Thoughts"
- "Random Stuff"

✅ **Good Slugs**
- `getting-started-react-hooks`
- `10-javascript-tips`
- `building-blog-platform-nextjs`

❌ **Bad Slugs**
- `blog-post`
- `my-thoughts`
- `random_stuff`

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+K` | Link |

## File Locations

```
Frontend:
- Create: app/dashboard/create/page.tsx
- Edit: app/dashboard/edit/[id]/page.tsx
- Dashboard: app/dashboard/page.tsx
- View: app/blog/[slug]/page.tsx

Backend:
- Blogs API: src/blogs/
- Public API: src/public/
- Auth: src/auth/
```

## API Endpoints

```
POST /auth/register          # Register
POST /auth/login             # Login
POST /blogs                  # Create blog
GET /blogs                   # Get your blogs
PATCH /blogs/:id             # Update blog
DELETE /blogs/:id            # Delete blog
GET /public/feed             # Get feed
GET /public/blogs/:slug      # Get blog
POST /public/blogs/:id/like  # Like blog
POST /public/blogs/:id/comments # Comment
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't create blog | Check title and content are filled |
| Blog not in feed | Make sure it's published |
| Can't edit | Make sure you're logged in |
| Formatting not working | Check markdown syntax |
| Can't delete | Confirm deletion popup |

## Environment Variables

```
Frontend:
NEXT_PUBLIC_API_URL=http://localhost:3001

Backend:
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
```

## Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Backend
npm run start:dev    # Start dev server
npm run build        # Build
npm run start:prod   # Start production
npm run prisma:studio # View database
```

## Features

✅ User authentication
✅ Create/edit/delete blogs
✅ Publish/unpublish
✅ Public feed
✅ Like system
✅ Comment system
✅ Dashboard
✅ Markdown support
✅ Preview mode
✅ Auto-slug generation

## Next Steps

1. ✅ Register account
2. ✅ Create first blog
3. ✅ Publish blog
4. ✅ View on feed
5. ✅ Like and comment
6. ✅ Edit blogs
7. ✅ Share with friends

---

**Start writing now!** 🎉

Go to: http://localhost:3000/auth/register
