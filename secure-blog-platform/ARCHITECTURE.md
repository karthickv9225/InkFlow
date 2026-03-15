# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Components                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • Navbar.tsx          - Navigation bar             │   │
│  │  • BlogCard.tsx        - Blog card display          │   │
│  │  • LikeButton.tsx      - Like functionality         │   │
│  │  • CommentItem.tsx     - Comment display            │   │
│  │  • CommentForm.tsx     - Comment input              │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Hooks & State Management                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • useAuth()           - Get current user           │   │
│  │  • useClientAuth()     - Sign in/up/out             │   │
│  │  • useState/useEffect  - Local state                │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Authentication Layer                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Mock Auth (Development)                    │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │  • localStorage storage                     │    │   │
│  │  │  • No rate limits                           │    │   │
│  │  │  • Instant signup                           │    │   │
│  │  │  • USE_MOCK_AUTH = true                     │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                    OR                                │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  Real Auth (Production)                     │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │  • Supabase Auth                            │    │   │
│  │  │  • Email verification                       │    │   │
│  │  │  • Secure sessions                          │    │   │
│  │  │  • USE_MOCK_AUTH = false                    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Browser Storage                           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • localStorage - Mock users & current user         │   │
│  │  • sessionStorage - Temporary data                  │   │
│  │  • Cookies - Session tokens (Supabase)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Server                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes & Server Actions             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • lib/api/blogs.ts    - Blog CRUD operations       │   │
│  │  • lib/api/likes.ts    - Like management            │   │
│  │  • lib/api/comments.ts - Comment management         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Prisma ORM                              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • Type-safe database queries                       │   │
│  │  • Automatic migrations                             │   │
│  │  • Connection pooling                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Auth                           │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • User authentication                              │   │
│  │  • Session management                               │   │
│  │  • Email verification                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database Tables                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  • User        - User accounts & profiles           │   │
│  │  • Blog        - Blog posts                          │   │
│  │  • Like        - Blog likes                          │   │
│  │  • Comment     - Blog comments                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### User Registration (Mock Auth)

```
User Input
    ↓
Register Page (app/register/page.tsx)
    ↓
useClientAuth().signUp()
    ↓
Check if email/username exists in localStorage
    ↓
Create new user object
    ↓
Save to localStorage (mock_users)
    ↓
Redirect to login page
    ↓
Success ✅
```

### User Login (Mock Auth)

```
User Input
    ↓
Login Page (app/login/page.tsx)
    ↓
useClientAuth().signIn()
    ↓
Find user in localStorage
    ↓
Verify password matches
    ↓
Set as current user in localStorage (current_user)
    ↓
Redirect to dashboard
    ↓
Success ✅
```

### Blog Creation

```
User Input
    ↓
Dashboard (app/dashboard/page.tsx)
    ↓
BlogAPI.createBlog()
    ↓
Prisma: prisma.blog.create()
    ↓
PostgreSQL: INSERT INTO Blog
    ↓
Return created blog
    ↓
Update dashboard
    ↓
Success ✅
```

### Blog Like

```
User Click
    ↓
LikeButton Component
    ↓
LikeAPI.toggleLike()
    ↓
Check if like exists
    ↓
If exists: Delete like, decrement count
If not: Create like, increment count
    ↓
Prisma: Update Blog.likeCount
    ↓
PostgreSQL: UPDATE Blog
    ↓
Optimistic UI update
    ↓
Success ✅
```

### Comment Creation

```
User Input
    ↓
CommentForm Component
    ↓
CommentAPI.createComment()
    ↓
Prisma: prisma.comment.create()
    ↓
PostgreSQL: INSERT INTO Comment
    ↓
Increment Blog.commentCount
    ↓
Return comment with author
    ↓
Update comments list
    ↓
Success ✅
```

---

## Component Hierarchy

```
RootLayout
├── Navbar
│   ├── useAuth() - Get current user
│   ├── useClientAuth() - Sign out
│   └── Navigation Links
│
├── Home Page (/)
│   └── Static content
│
├── Register Page (/register)
│   ├── RegisterForm
│   └── useClientAuth().signUp()
│
├── Login Page (/login)
│   ├── LoginForm
│   └── useClientAuth().signIn()
│
├── Dashboard (/dashboard)
│   ├── BlogList
│   │   └── BlogCard[] (for each blog)
│   │       ├── Edit button
│   │       ├── Delete button
│   │       └── View button
│   └── Stats
│
├── Blog Detail (/blog/[slug])
│   ├── BlogHeader
│   │   ├── Title
│   │   ├── Author info
│   │   └── Stats (views, likes, comments)
│   ├── BlogContent
│   ├── LikeButton
│   │   └── useAuth() - Check if logged in
│   └── Comments Section
│       ├── CommentForm
│       │   └── useClientAuth() - Get current user
│       └── CommentItem[]
│           ├── Edit button
│           ├── Delete button
│           └── Author info
│
└── Toaster (Toast notifications)
```

---

## State Management

### Global State (localStorage)

```javascript
// Mock Users
localStorage.mock_users = [
  {
    id: "user_123",
    email: "test@example.com",
    password: "password123",
    username: "testuser",
    fullName: "Test User"
  }
]

// Current User
localStorage.current_user = {
  id: "user_123",
  email: "test@example.com",
  username: "testuser",
  fullName: "Test User"
}
```

### Component State (React)

```typescript
// useAuth Hook
const { user, loading } = useAuth()
// user: Current user object or null
// loading: Boolean indicating if auth is loading

// useClientAuth Hook
const { signIn, signUp, signOut, getCurrentUser } = useClientAuth()
// Functions for authentication operations

// Component State
const [blogs, setBlogs] = useState([])
const [comments, setComments] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

---

## API Layer

### BlogAPI

```typescript
BlogAPI.getPublishedBlogs(page, limit)
  → Get paginated published blogs

BlogAPI.getBlogBySlug(slug)
  → Get single blog by slug

BlogAPI.getUserBlogs(userId)
  → Get all blogs for a user

BlogAPI.createBlog(data)
  → Create new blog

BlogAPI.updateBlog(id, userId, data)
  → Update blog (ownership verified)

BlogAPI.deleteBlog(id, userId)
  → Delete blog (ownership verified)

BlogAPI.incrementViewCount(slug)
  → Increment view count
```

### LikeAPI

```typescript
LikeAPI.getBlogLikes(blogId)
  → Get all likes for a blog

LikeAPI.getUserLike(blogId, userId)
  → Check if user liked blog

LikeAPI.likeBlog(blogId, userId)
  → Create like and increment count

LikeAPI.unlikeBlog(blogId, userId)
  → Delete like and decrement count

LikeAPI.toggleLike(blogId, userId)
  → Toggle like status
```

### CommentAPI

```typescript
CommentAPI.getBlogComments(blogId)
  → Get all comments for a blog

CommentAPI.createComment(blogId, userId, content)
  → Create comment and increment count

CommentAPI.updateComment(commentId, userId, content)
  → Update comment (ownership verified)

CommentAPI.deleteComment(commentId, userId)
  → Delete comment and decrement count
```

---

## Database Schema

```sql
-- User Table
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

-- Blog Table
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

-- Like Table
CREATE TABLE "Like" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "User"(id),
  blogId TEXT NOT NULL REFERENCES "Blog"(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, blogId)
);

-- Comment Table
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

## Authentication Flow

### Mock Auth (Development)

```
┌─────────────────────────────────────────┐
│         User Registration               │
├─────────────────────────────────────────┤
│                                         │
│  1. User enters email, password         │
│  2. Check localStorage for duplicates   │
│  3. Create user object                  │
│  4. Save to localStorage                │
│  5. Redirect to login                   │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Login                      │
├─────────────────────────────────────────┤
│                                         │
│  1. User enters email, password         │
│  2. Find user in localStorage           │
│  3. Verify password                     │
│  4. Set as current user                 │
│  5. Redirect to dashboard               │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Session                    │
├─────────────────────────────────────────┤
│                                         │
│  1. useAuth() reads current_user        │
│  2. User is authenticated               │
│  3. Can access protected pages          │
│  4. Can create/edit/delete content      │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Logout                     │
├─────────────────────────────────────────┤
│                                         │
│  1. User clicks sign out                │
│  2. Clear current_user from localStorage│
│  3. Redirect to home                    │
│  4. User is logged out                  │
│                                         │
└─────────────────────────────────────────┘
```

### Real Auth (Production)

```
┌─────────────────────────────────────────┐
│         User Registration               │
├─────────────────────────────────────────┤
│                                         │
│  1. User enters email, password         │
│  2. Send to Supabase Auth               │
│  3. Supabase creates user               │
│  4. Send verification email             │
│  5. User verifies email                 │
│  6. Redirect to login                   │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Login                      │
├─────────────────────────────────────────┤
│                                         │
│  1. User enters email, password         │
│  2. Send to Supabase Auth               │
│  3. Supabase verifies credentials       │
│  4. Return session token                │
│  5. Store in cookies                    │
│  6. Redirect to dashboard               │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Session                    │
├─────────────────────────────────────────┤
│                                         │
│  1. useAuth() reads Supabase session    │
│  2. User is authenticated               │
│  3. Can access protected pages          │
│  4. Can create/edit/delete content      │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         User Logout                     │
├─────────────────────────────────────────┤
│                                         │
│  1. User clicks sign out                │
│  2. Send logout to Supabase             │
│  3. Clear session token                 │
│  4. Redirect to home                    │
│  5. User is logged out                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Performance Optimizations

### Frontend
- ✅ Static page generation (home page)
- ✅ Server-side rendering (dynamic pages)
- ✅ Optimistic UI updates (likes)
- ✅ Component memoization
- ✅ Image optimization

### Backend
- ✅ Efficient database queries
- ✅ Connection pooling (Prisma)
- ✅ Indexed queries
- ✅ Pagination support
- ✅ Caching strategies

### Network
- ✅ Minimal API calls
- ✅ Batch operations
- ✅ Compression
- ✅ CDN delivery (Vercel)

---

## Security Features

### Authentication
- ✅ Supabase Auth (production)
- ✅ Session management
- ✅ Password hashing
- ✅ Email verification

### Authorization
- ✅ Ownership verification
- ✅ Role-based access
- ✅ Protected routes
- ✅ Server-side validation

### Data Protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (React)
- ✅ CSRF protection (Next.js)
- ✅ Secure headers

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
├─────────────────────────────────────────┤
│  • Next.js application                  │
│  • Static assets                        │
│  • API routes                           │
│  • Edge functions                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Supabase (Backend)              │
├─────────────────────────────────────────┤
│  • PostgreSQL database                  │
│  • Authentication                       │
│  • Real-time subscriptions              │
│  • Storage                              │
└─────────────────────────────────────────┘
```

---

## Summary

This architecture provides:
- ✅ Scalable frontend (Next.js)
- ✅ Type-safe backend (Prisma)
- ✅ Secure authentication (Supabase)
- ✅ Reliable database (PostgreSQL)
- ✅ Easy deployment (Vercel)
- ✅ Development flexibility (Mock auth)

